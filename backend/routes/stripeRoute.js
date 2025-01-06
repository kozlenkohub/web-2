import express from 'express';
import { generateReport } from '../controllers/stripeController.js';

const router = express.Router();

// Создать отчет
router.post('/reports', generateReport);

// Скачать отчет

export default router;
