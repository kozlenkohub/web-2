import express from 'express';
import {
  addFood,
  updateFood,
  listFood,
  removeFood,
  listActiveFood,
} from '../controllers/foodController.js';
import multer from 'multer';

// Создание маршрутизатора
const foodRouter = express.Router();

// Настройка multer для работы с in-memory storage (буфер, а не диск)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Маршруты для работы с продуктами
// Маршрут для добавления продукта, с загрузкой изображения
foodRouter.post('/add', upload.single('image'), addFood);

// Маршрут для обновления продукта, с возможной заменой изображения
foodRouter.post('/update', upload.single('image'), updateFood);

// Маршрут для получения списка всех продуктов
foodRouter.get('/list', listFood);

// Маршрут для удаления продукта
foodRouter.post('/remove', removeFood);

foodRouter.get('/active-list', listActiveFood); // Маршрут для получения активных продуктов

export default foodRouter;
