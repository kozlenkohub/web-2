// orderController.js

import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import { getDistanceFromLatLonInKm } from './utils.js';
import { sendAdminOrderEmail } from './emailService.js';
import { createStripeSession } from './paymentService.js';
import { sendTelegramOrderMessage } from './notificationService.js';

const frontend_url = 'https://www.burgergastrofaza.pl'; // Замените на ваш URL

// Функция для оформления заказа
export const placeOrder = async (req, res) => {
  try {
    const deliveryCenter = { lat: 51.154, lng: 16.9305 };
    const userLocation = req.body.address.location;
    const distance = getDistanceFromLatLonInKm(
      deliveryCenter.lat,
      deliveryCenter.lng,
      userLocation.lat,
      userLocation.lng,
    );

    let deliveryCharge = 0;
    if (distance <= 1.77) {
      deliveryCharge = 0;
    } else if (distance > 1.77 && distance <= 5) {
      deliveryCharge = 8;
    }

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
      payment: req.body.paymentMethod === 'cash' ? true : false,
      packagingCharge: req.body.packagingCharge,
      deliveryCharge: deliveryCharge,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    if (req.body.paymentMethod === 'cash') {
      // Для оплаты наличными отправляем уведомления сразу
      await sendAdminOrderEmail(newOrder, null);
      await sendTelegramOrderMessage(newOrder);
      res.json({ success: true, message: 'Заказ оформлен с оплатой наличными' });
    } else {
      // Создаем платежную сессию Stripe
      const sessionUrl = await createStripeSession(newOrder, frontend_url);
      res.json({ success: true, session_url: sessionUrl });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Ошибка при оформлении заказа' });
  }
};

// Функция для подтверждения заказа
export const verifyOrder = async (req, res) => {
  const { orderId, success, sessionUrl } = req.body;
  try {
    const order = await orderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Заказ не найден' });
    }

    if (success === 'true') {
      // Проверяем, был ли уже отправлен уведомление
      if (!order.notificationSent) {
        await orderModel.findByIdAndUpdate(
          orderId,
          {
            payment: true,
            paymentTime: new Date(),
            notificationSent: true, // Устанавливаем флаг, чтобы предотвратить повторную отправку
          },
          { new: true },
        );

        await sendAdminOrderEmail(order, sessionUrl);
        await sendTelegramOrderMessage(order);
      }

      res.json({ success: true, message: 'Платеж подтвержден' });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: 'Платеж не прошел, заказ отменен' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Ошибка при подтверждении заказа' });
  }
};

// Функция для получения заказов пользователя
export const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId, payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Ошибка при получении заказов пользователя' });
  }
};

// Функция для получения всех заказов
export const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Ошибка при получении всех заказов' });
  }
};

// Функция для обновления статуса заказа
export const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: 'Статус обновлен' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Ошибка при обновлении статуса' });
  }
};

// Функция для удаления заказа
export const deleteOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.body.orderId);
    res.json({ success: true, message: 'Заказ удален' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Ошибка при удалении заказа' });
  }
};

export const getLastOrder = async (req, res) => {
  try {
    const lastOrder = await orderModel.findOne({ userId: req.userId }).sort({ date: -1 });
    if (lastOrder) {
      res.json({ success: true, order: lastOrder });
    } else {
      res.json({ success: false, message: 'Нет предыдущих заказов' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Ошибка при получении последнего заказа' });
  }
};
