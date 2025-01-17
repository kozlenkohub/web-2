// emailRoutes.js

import express from 'express';
import {
  sendBulkEmailController,
  sendTestEmailController,
  unsubscribeEmailController,
  getUnsubscribedUsersController,
} from '../controllers/emailController.js';

const router = express.Router();

// Маршрут для массовой рассылки
router.post('/send-bulk-email', sendBulkEmailController);
router.post('/send-test-email', sendTestEmailController);
router.post('/unsubscribe-email', unsubscribeEmailController);
router.get('/unsubscribed-users', getUnsubscribedUsersController);

export default router;
