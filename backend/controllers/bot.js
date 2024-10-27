// bot.js

import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import UserAccessModel from '../models/userAccessModel.js';
import orderModel from '../models/orderModel.js';
import { sendDeliveryTimeEmail } from './emailService.js';
import { formatPhoneNumber } from './utils.js';

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

  // Обработчик callback_query
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;

    // Проверка доступа
    const hasAccess = await checkUserAccess(chatId);
    if (!hasAccess) {
      bot.answerCallbackQuery(query.id, {
        text: 'У вас нет прав для выполнения этого действия.',
      });
      return;
    }

    if (data.startsWith('set_delivery_time_')) {
      const orderId = data.replace('set_delivery_time_', '');

      const order = await orderModel.findById(orderId);
      if (order.deliveryTimeEmailSent) {
        bot.sendMessage(
          chatId,
          `Вы уже отправили электронное письмо с временем доставки для заказа ${orderId}. Вы не можете изменить время доставки.`,
        );
        return;
      }

      bot.sendMessage(chatId, 'Пожалуйста, введите время доставки в минутах:');
      bot.once('message', async (msg) => {
        const deliveryTime = parseInt(msg.text, 10);
        if (isNaN(deliveryTime)) {
          bot.sendMessage(chatId, 'Пожалуйста, введите корректное число.');
          return;
        }

        try {
          // Обновляем время доставки
          order.deliveryTime = deliveryTime;
          await order.save();

          // Пытаемся отправить письмо
          const emailSent = await sendDeliveryTimeEmail(order, deliveryTime);

          if (emailSent) {
            bot.sendMessage(
              chatId,
              `Время доставки для заказа ${orderId} установлено на ${deliveryTime} минут. Электронное письмо отправлено пользователю.`,
            );
          } else {
            bot.sendMessage(
              chatId,
              `Время доставки для заказа ${orderId} обновлено на ${deliveryTime} минут. Электронное письмо НЕ было отправлено, так как оно уже было отправлено ранее.`,
            );
          }
        } catch (error) {
          console.error('Ошибка при установке времени доставки:', error);
          bot.sendMessage(chatId, 'Произошла ошибка при установке времени доставки.');
        }
      });
    } else if (data.startsWith('contact_client_')) {
      const orderId = data.replace('contact_client_', '');

      try {
        const order = await orderModel.findById(orderId);
        if (!order) {
          bot.sendMessage(chatId, `Заказ с ID ${orderId} не найден.`);
          return;
        }

        // Получаем номер телефона клиента
        let phoneNumber = order.address.phone;
        let firstName = order.address.firstName || 'Клиент';

        // Форматируем номер телефона
        const formattedPhoneNumber = formatPhoneNumber(phoneNumber);

        if (!formattedPhoneNumber) {
          bot.sendMessage(chatId, `Неверный формат номера телефона клиента: ${phoneNumber}`);
          return;
        }

        // Отправляем контакт
        bot.sendContact(chatId, formattedPhoneNumber, firstName);
      } catch (error) {
        console.error('Ошибка при отправке контакта клиента:', error);
        bot.sendMessage(chatId, 'Произошла ошибка при отправке контакта клиента.');
      }
    }

    // Другие обработчики остаются без изменений
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

  // Вы можете добавить другие обработчики по необходимости
};

export default getBotInstance();
