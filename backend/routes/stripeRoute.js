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
router.post('/payments', last10Payments);
router.post('/items', getPaymentItems);
router.post('/webhook', handleStripeWebhook);

// Скачать отчет

export default router;
