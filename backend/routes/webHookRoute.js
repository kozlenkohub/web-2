import express from 'express';
import 'dotenv/config';
import bodyParser from 'body-parser';
import stripePackage from 'stripe';
import TelegramBot from 'node-telegram-bot-api';

import dotenv from 'dotenv';

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY);

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Загружаем переменные окружения из .env файла
dotenv.config();

async function sendTelegramMessage(message) {
  try {
    await bot.sendMessage(TELEGRAM_CHAT_ID, message);
    console.log('Message sent to Telegram');
  } catch (error) {
    console.error('Error sending message to Telegram:', error.message);
  }
}

const webHook = express.Router();
//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

// Вебхук
webHook.post('/', bodyParser.raw({ type: 'application/json' }), async (request, response) => {
  console.log('Webhook received!');

  const sig = request.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    // Проверка подписи события
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('Parsed Event:', event);

  // Обработка событий Stripe
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed!');
      console.log(`Session ID: ${session.id}`);
      console.log(`Customer email: ${session.customer_email || 'Not provided'}`);

      // Запрос line_items из Stripe
      try {
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);

        // Формируем список товаров
        let itemsList = '🛒 Список товаров:\n';
        lineItems.data.forEach((item) => {
          itemsList += `- ${item.description}: ${item.quantity} x ${(
            item.amount_total / 100
          ).toFixed(2)} ${item.currency.toUpperCase()}\n`;
        });

        // Отправка уведомления о поступлении денег
        await sendTelegramMessage(
          `💰 Поступление денег!\nСумма: ${(session.amount_total / 100).toFixed(
            2,
          )} ${session.currency.toUpperCase()}`,
        );
      } catch (error) {
        console.error('Error fetching line items:', error.message);
        await sendTelegramMessage(`❌ Ошибка получения товаров для сессии: ${session.id}`);
      }
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);

      // Отправка уведомления в Telegram
      await sendTelegramMessage(
        `💳 Платеж успешен!\nID платежа: ${paymentIntent.id}\nСумма: ${
          paymentIntent.amount / 100
        } ${paymentIntent.currency.toUpperCase()}`,
      );
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Подтверждаем получение события
  response.json({ received: true });
});

export default webHook;
