// server.js

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import cartRouter from './routes/cartRoute.js';
import orderRouter from './routes/orderRoute.js';
import headerContentRouter from './routes/headerContent.js';
import { getPaymentDetails, getSuccessfulPaymentsByMonth } from './controllers/stripeController.js';
import userModel from './models/userModel.js'; // Импорт модели пользователя
import 'dotenv/config';

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());
app.use('/images', express.static('uploads'));

// db connection
connectDB();

// api endpoints
app.use('/api/food', foodRouter);
app.use('/api/user', userRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/header', headerContentRouter); // Подключение маршрута для headerContent

// Маршрут для проверки работы API
app.get('/', (req, res) => {
  res.send('API Working');
});

// Маршрут для статистики пользователей
app.get('/stats', async (req, res) => {
  try {
    const stats = await userModel.aggregate([
      {
        $addFields: {
          idAsString: { $toString: '$_id' }, // Преобразуем ObjectId в строку
        },
      },
      {
        $lookup: {
          from: 'orders',
          localField: 'idAsString',
          foreignField: 'userId',
          as: 'orders',
        },
      },
      {
        $addFields: {
          orderCount: { $size: '$orders' }, // Подсчет количества заказов
          lastOrder: { $arrayElemAt: ['$orders', -1] }, // Берем последний заказ
        },
      },
      {
        $addFields: {
          phoneNumber: '$lastOrder.address.phone', // Берем номер телефона из последнего заказа
        },
      },
      {
        $match: {
          orderCount: { $gt: 0 }, // Показывать только тех, у кого больше 0 заказов
          email: { $ne: 'ggkozlenko@gmail.com' }, // Исключаем пользователя с этим email
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phoneNumber: 1, // Отображаем номер телефона
          orderCount: 1,
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    console.error('Ошибка при получении статистики:', error);
    res.status(500).send('Ошибка сервера');
  }
});

// Маршруты для платежей
app.get('/api/payments', getSuccessfulPaymentsByMonth);
app.get('/api/payment/:id', getPaymentDetails);

// Запуск сервера
app.listen(port, () => {
  console.log(`Server Started on port ${port}`);
});
