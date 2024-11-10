// emailRoutes.js

import express from 'express';
import {
  sendBulkEmailController,
  sendTestEmailController,
} from '../controllers/emailController.js';

const router = express.Router();

// Маршрут для массовой рассылки
router.post('/send-bulk-email', sendBulkEmailController);
router.post('/send-test-email', sendTestEmailController);

export default router;
