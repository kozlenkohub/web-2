// routes/webHookRoute.js

import express from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

// Загружаем переменные окружения из .env файла
dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15', // Укажите актуальную версию API Stripe
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Используем встроенный middleware Express для обработки сырых данных
router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  // Логирование заголовков и типа тела
  console.log('Headers:', req.headers);
  console.log('Body type:', typeof req.body);
  console.log('Body buffer:', req.body instanceof Buffer);

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    console.log('Webhook event constructed successfully.');
  } catch (err) {
    console.error('Ошибка проверки подписи вебхука:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Обработка события
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      try {
        // Ваша логика обработки успешной оплаты
        console.log('Оплата завершена для сессии:', session);
        // Пример: обновите статус заказа в базе данных
        // await updateOrderStatus(session);
      } catch (error) {
        console.error('Ошибка обработки события checkout.session.completed:', error);
        return res.status(500).send('Internal Server Error');
      }
      break;
    // Добавьте обработку других типов событий по необходимости
    default:
      console.log(`Необработанный тип события: ${event.type}`);
  }

  // Возвращаем ответ Stripe для подтверждения получения события
  res.status(200).json({ received: true });
});

export default router;
