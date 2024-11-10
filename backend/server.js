import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import foodRouter from './routes/foodRoute.js';
import userRouter from './routes/userRoute.js';
import settingsRoute from './routes/settingsRoute.js';

import 'dotenv/config';
import headerContentRouter from './routes/headerContent.js';
import userModel from './models/userModel.js'; // Импорт модели пользователя

import cartRouter from './routes/cartRoute.js';
import menuRoutes from './routes/menuRoute.js';
import orderRouter from './routes/orderRoute.js';
import { getPaymentDetails, getSuccessfulPaymentsByMonth } from './controllers/stripeController.js';

// app configa
const app = express();
const port = process.env.PORT || 4000;

// middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://web-2-admin.onrender.com',
  'https://www.burgergastrofaza.pl',
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Разрешаем запрос, если домен находится в списке разрешённых
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }),
);

app.use(express.json({ limit: '10mb' })); // Устанавливаем лимит на JSON данные
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Лимит на urlencoded данные
app.use('/api/menu', menuRoutes);

// db connection
connectDB();

// api endpoints
app.use('/api/food', foodRouter);
app.use('/images', express.static('uploads'));
app.use('/api/user', userRouter);
app.use('/api/settings', settingsRoute);

app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.get('/', (req, res) => {
  res.send('API Working');
});
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

app.get('/api/payments', getSuccessfulPaymentsByMonth);
app.get('/api/payment/:id', getPaymentDetails);
app.use('/api/header', headerContentRouter);

app.listen(port, () => {
  console.log(`Server Started on https://web-2-backend-wbs4.onrender.com:${port}`);
});

// YOU CAN SAVE UR DATABASE IN THIS COMMENT IF U WANT -->
