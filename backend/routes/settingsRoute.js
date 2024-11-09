import express from 'express';
import { updateOrdering, getOrderingStatus } from '../controllers/settingsController.js';

const router = express.Router();

// Маршрут для обновления настройки приёма заказов
router.post('/update-ordering', updateOrdering);

// Маршрут для получения текущего состояния приёма заказов
router.get('/get-ordering-status', getOrderingStatus);

export default router;
