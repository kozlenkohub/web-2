import express from 'express';
import {
  generateReport,
  getPaymentItems,
  last10Payments,
  handleStripeWebhook,
} from '../controllers/stripeController.js';

const router = express.Router();

// Создать отчет
router.post('/reports', generateReport);

// Последние 10 платежей
router.post('/payments', last10Payments);

// Получить элементы платежа
router.post('/items', getPaymentItems);

// Вебхук Stripe
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }), // Используем express.raw для вебхука
  handleStripeWebhook,
);

export default router;
