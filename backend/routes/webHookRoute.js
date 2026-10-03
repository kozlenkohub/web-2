import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import stripePackage from 'stripe';
import orderModel from '../models/orderModel.js'; // Путь к вашей модели заказа
import cron from 'node-cron'; // Импортируем node-cron
import moment from 'moment-timezone'; // Импортируем moment-timezone
import axios from 'axios';
import { sendTelegramMessageToAll } from '../controllers/notificationService.js';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const webHook = express.Router();

webHook.get('/', (req, res) => {
  res.send('Webhook is working');
});

// Вебхук для обработки событий Stripe
webHook.post('/', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
  console.log('Webhook received!');

  const sig = request.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Parsed Event:', event);

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        const paymentTime = new Date(session.created * 1000);
        const matchingOrder = await orderModel.findOne({
          payment: false,
          date: {
            $gte: new Date(paymentTime.getTime() - 5 * 60000),
            $lte: new Date(paymentTime.getTime() + 5 * 60000),
          },
          amount: session.amount_total / 100,
        });

        await axios.post('https://web-2-backend-wbs4.onrender.com/api/order/verify', {
          orderId: matchingOrder._id,
          success: 'true',
          sessionUrl: session.url,
        });

        await sendTelegramMessageToAll(
          `💰 Поступление денег!\nСумма: ${(session.amount_total / 100).toFixed(
            2,
          )} ${session.currency.toUpperCase()}`,
        );
      } catch (error) {
        console.error('Error fetching line items:', error.message);
        await sendTelegramMessageToAll(`❌ Ошибка получения товаров для сессии: ${session.id}`);
      }
      break;
    }

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);

      await sendTelegramMessageToAll(
        `💳 Платеж успешен!\nID платежа: ${paymentIntent.id}\nСумма: ${(
          paymentIntent.amount / 100
        ).toFixed(2)} ${paymentIntent.currency.toUpperCase()}`,
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
});

// Задача по расписанию для отправки заработка за день
export const startDailyEarningsCron = () => {
  cron.schedule('0 22 * * *', async () => {
    try {
      // Получаем текущую дату в польском времени (Europe/Warsaw)
      const now = moment.tz('Europe/Warsaw');
      const startOfDay = now.clone().startOf('day');
      const endOfDay = now.clone().endOf('day');
      const orders = await orderModel.find({
        date: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
        payment: true,
      });
      const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);
      const message = `💰 Сумма заработка за сегодня: ${totalAmount} PLN`;
      await sendTelegramMessageToAll(message);
    } catch (error) {
      console.error('Error sending daily earnings:', error.message);
    }
  });
};

export default webHook;
