import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import stripePackage from 'stripe';
import TelegramBot from 'node-telegram-bot-api';
import UserAccessModel from '../models/userAccessModel.js'; // Путь к вашей модели
import orderModel from '../models/orderModel.js'; // Путь к вашей модели заказа
import cron from 'node-cron'; // Импортируем node-cron
import moment from 'moment-timezone'; // Импортируем moment-timezone

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true }); // Включаем polling

// Функция для сохранения chatId
async function saveChatId(chatId) {
  try {
    const exists = await UserAccessModel.findOne({ chatId });
    if (!exists) {
      await UserAccessModel.create({ chatId });
      console.log(`Chat ID ${chatId} saved to the database.`);
    }
  } catch (error) {
    console.error('Error saving chat ID:', error.message);
  }
}

// Функция для отправки сообщений всем пользователям
async function sendTelegramMessageToAll(message) {
  try {
    const users = await UserAccessModel.find();
    for (const user of users) {
      await bot.sendMessage(user.chatId, message);
    }
    console.log('Message sent to all users.');
  } catch (error) {
    console.error('Error sending message to all users:', error.message);
  }
}

// Слушаем сообщения от пользователей
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  // Сохраняем chatId в базе данных
  await saveChatId(chatId);

  // Приветственное сообщение
  bot.sendMessage(chatId, 'Привет! Теперь вы будете получать уведомления.');
});

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
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed!');
      console.log(`Session ID: ${session.id}`);
      console.log(`Customer email: ${session.customer_email || 'Not provided'}`);

      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        let itemsList = '🛒 Список товаров:\n';
        lineItems.data.forEach((item) => {
          itemsList += `- ${item.description}: ${item.quantity} x ${(
            item.amount_total / 100
          ).toFixed(2)} ${item.currency.toUpperCase()}\n`;
        });

        const paymentTime = new Date(session.created * 1000); // Convert Stripe timestamp to Date

        // Find matching order
        const matchingOrder = await orderModel.findOne({
          payment: false,
          date: {
            $gte: new Date(paymentTime.getTime() - 5 * 60000), // 5 minutes before
            $lte: new Date(paymentTime.getTime() + 5 * 60000), // 5 minutes after
          },
          amount: session.amount_total / 100, // Convert cents to whole currency units
        });

        if (matchingOrder) {
          matchingOrder.payment = true;
          matchingOrder.paymentTime = paymentTime;
          await matchingOrder.save();
          console.log(`Order ${matchingOrder._id} marked as paid`);

          const orderMessage = `💰 Поступление денег!
Сумма: ${(session.amount_total / 100).toFixed(2)} ${session.currency.toUpperCase()}

📍 Адрес доставки:
Улица: ${matchingOrder.address.address}
Квартира: ${matchingOrder.address.apartmentNumber}
📱 Телефон: ${matchingOrder.address.phone}
👤 Имя: ${matchingOrder.address.firstName}

${itemsList}`;

          await sendTelegramMessageToAll(orderMessage);
        } else {
          await sendTelegramMessageToAll(
            `💰 Поступление денег!\nСумма: ${(session.amount_total / 100).toFixed(
              2,
            )} ${session.currency.toUpperCase()}\n${itemsList}`,
          );
        }
      } catch (error) {
        console.error('Error fetching line items:', error.message);
        await sendTelegramMessageToAll(`❌ Ошибка получения товаров для сессии: ${session.id}`);
      }
      break;

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
cron.schedule('0 22 * * *', async () => {
  try {
    // Получаем текущую дату в польском времени (Europe/Warsaw)
    const now = moment.tz('Europe/Warsaw');

    const startOfDay = now.clone().startOf('day'); // Начало дня
    const endOfDay = now.clone().endOf('day'); // Конец дня

    // Находим заказы, сделанные за сегодняшний день
    const orders = await orderModel.find({
      date: { $gte: startOfDay.toDate(), $lte: endOfDay.toDate() },
      payment: true,
    });

    const totalAmount = orders.reduce((sum, order) => sum + order.amount, 0);

    const message = `💰 Сумма заработка за сегодня: ${totalAmount} PLN`;

    // Отправляем сообщение в Telegram
    await sendTelegramMessageToAll(message);
  } catch (error) {
    console.error('Error sending daily earnings:', error.message);
  }
});

export default webHook;
