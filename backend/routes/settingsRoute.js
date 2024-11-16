import express from 'express';
import {
  updateOrdering,
  getOrderingStatus,
  getDeliveryRadius,
  updateDeliveryRadius,
  getDeliveryCenter,
  updateDeliveryCenter,
} from '../controllers/settingsController.js';

const router = express.Router();

// Маршрут для обновления настройки приёма заказов
router.post('/update-ordering', updateOrdering);

// Маршрут для получения текущего состояния приёма заказов
router.get('/get-ordering-status', getOrderingStatus);

// Маршрут для получения текущего радиуса доставки
router.get('/get-delivery-radius', getDeliveryRadius);

// Маршрут для обновления радиуса доставки
router.post('/update-delivery-radius', updateDeliveryRadius);

// Маршрут для получения текущего центра доставки
router.get('/get-delivery-center', getDeliveryCenter);

// Маршрут для обновления центра доставки
router.post('/update-delivery-center', updateDeliveryCenter);

export default router;
