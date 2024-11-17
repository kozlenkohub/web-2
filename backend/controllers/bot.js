// bot.js

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import UserAccessModel from '../models/userAccessModel.js';
import orderModel from '../models/orderModel.js';
import { sendDeliveryTimeEmail } from './emailService.js';

dotenv.config();

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID;

let botInstance;

const getBotInstance = () => {
  if (!botInstance) {
    botInstance = new TelegramBot(telegramBotToken, { polling: true });
    initializeBot(botInstance);
  }
  return botInstance;
};

const initializeBot = (bot) => {
  // Функция для проверки доступа пользователя
  const checkUserAccess = async (chatId) => {
    if (chatId.toString() === adminChatId.toString()) {
      return true;
    }
    const userAccess = await UserAccessModel.findOne({ chatId });
    return userAccess !== null;
  };

  // Функция для добавления доступа пользователю
  const addUserAccess = async (chatId) => {
    try {
      const existingUser = await UserAccessModel.findOne({ chatId });
      if (existingUser) {
        return false; // Пользователь уже имеет доступ
      }

      const newUser = new UserAccessModel({ chatId });
      await newUser.save();
      return true;
    } catch (error) {
      console.error('Ошибка при добавлении доступа пользователю:', error);
      return false;
    }
  };

  // Состояния чатов для управления процессами
  const chatStates = {};

  // Обработчик callback_query
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Проверка доступа
    const hasAccess = await checkUserAccess(chatId);
    if (!hasAccess) {
      bot.answerCallbackQuery(query.id, {
        text: 'У вас нет прав для выполнения этого действия.',
        show_alert: true,
      });
      return;
    }

    if (data.startsWith('set_delivery_time_')) {
      const orderId = data.replace('set_delivery_time_', '');

      const order = await orderModel.findById(orderId);
      if (!order) {
        bot.sendMessage(chatId, `Заказ с ID ${orderId} не найден.`);
        return;
      }

      if (order.deliveryTimeEmailSent) {
        bot.sendMessage(
          chatId,
          `Электронное письмо с временем доставки для заказа ${orderId} уже было отправлено. Изменение времени доставки невозможно.`,
        );
        return;
      }

      // Если у пользователя уже есть активный процесс установки времени доставки, отменяем его
      if (chatStates[chatId]) {
        clearTimeout(chatStates[chatId].timeout);
        bot.sendMessage(chatId, 'Предыдущий процесс установки времени доставки был отменен.');
      }

      // Устанавливаем состояние ожидания ввода времени доставки
      chatStates[chatId] = {
        pendingDeliveryTime: true,
        orderId: orderId,
        // Устанавливаем таймер на 10 минут для сброса состояния
        timeout: setTimeout(() => {
          delete chatStates[chatId];
          bot.sendMessage(
            chatId,
            'Процесс установки времени доставки был отменен из-за бездействия.',
          );
        }, 10 * 60 * 1000), // 10 минут в миллисекундах
      };

      bot.sendMessage(chatId, 'Пожалуйста, введите время доставки в минутах:');
    }
  });

  // Обработчик входящих сообщений
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;

    // Пропускаем обработку, если это команда
    if (msg.text.startsWith('/')) return;

    // Проверка, находится ли пользователь в процессе установки времени доставки
    if (chatStates[chatId]?.pendingDeliveryTime) {
      const state = chatStates[chatId];
      const deliveryTimeInput = msg.text;
      const deliveryTime = parseInt(deliveryTimeInput, 10);

      if (isNaN(deliveryTime) || deliveryTime <= 0) {
        bot.sendMessage(chatId, 'Пожалуйста, введите корректное число больше нуля.');
        return;
      }

      const orderId = state.orderId;

      try {
        const order = await orderModel.findById(orderId);
        if (!order) {
          bot.sendMessage(chatId, `Заказ с ID ${orderId} не найден.`);
          clearTimeout(state.timeout);
          delete chatStates[chatId];
          return;
        }

        if (order.deliveryTimeEmailSent) {
          bot.sendMessage(
            chatId,
            `Электронное письмо с временем доставки для заказа ${orderId} уже было отправлено. Изменение времени доставки невозможно.`,
          );
          clearTimeout(state.timeout);
          delete chatStates[chatId];
          return;
        }

        // Обновляем время доставки
        order.deliveryTime = deliveryTime;
        await order.save();

        // Отправляем письмо
        const emailSent = await sendDeliveryTimeEmail(order, deliveryTime);

        if (emailSent) {
          // Помечаем, что письмо было отправлено
          order.deliveryTimeEmailSent = true;
          await order.save();

          bot.sendMessage(
            chatId,
            `Время доставки для заказа ${orderId} установлено на ${deliveryTime} минут. Электронное письмо отправлено пользователю.`,
          );
        } else {
          bot.sendMessage(
            chatId,
            `Время доставки для заказа ${orderId} обновлено на ${deliveryTime} минут. Электронное письмо не было отправлено.`,
          );
        }
      } catch (error) {
        console.error('Ошибка при установке времени доставки:', error);
        bot.sendMessage(chatId, 'Произошла ошибка при установке времени доставки.');
      }

      // Сбрасываем состояние и таймер
      clearTimeout(state.timeout);
      delete chatStates[chatId];
    }
  });

  // Обработчик команды /adduser
  bot.onText(/\/adduser (\d+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const userIdToAdd = match[1];

    // Проверяем, что команду отправил администратор
    if (chatId.toString() !== adminChatId.toString()) {
      bot.sendMessage(chatId, 'У вас нет прав на выполнение этого действия.');
      return;
    }

    const success = await addUserAccess(userIdToAdd);
    if (success) {
      bot.sendMessage(
        chatId,
        `Пользователь с chat ID ${userIdToAdd} был добавлен в список разрешенных.`,
      );
    } else {
      bot.sendMessage(
        chatId,
        `Пользователь с chat ID ${userIdToAdd} уже имеет доступ или произошла ошибка.`,
      );
    }
  });

  // Обработчик команды /start
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;

    // Проверка доступа
    const hasAccess = await checkUserAccess(chatId);
    if (!hasAccess) {
      bot.sendMessage(
        chatId,
        'У вас нет разрешения на использование этого бота. Пожалуйста, свяжитесь с администратором.',
      );
      return;
    }

    bot.sendMessage(
      chatId,
      'Здравствуйте! Вы можете использовать этого бота для управления заказами.',
    );
  });

  // Дополнительные обработчики можно добавить здесь
};

export default getBotInstance();
