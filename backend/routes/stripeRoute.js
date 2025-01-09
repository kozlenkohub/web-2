import express from 'express';
import { generateReport, reportRuns } from '../controllers/stripeController.js';

const router = express.Router();

// Создать отчет
router.post('/reports', generateReport);
router.post('/report-runs', reportRuns);

// Скачать отчет

export default router;
