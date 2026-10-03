// bot.js

import TelegramBot from 'node-telegram-bot-api';
import crypto from 'crypto';
import dotenv from 'dotenv';
import UserAccessModel from '../models/userAccessModel.js';
import orderModel from '../models/orderModel.js';
import { sendDeliveryTimeEmail } from './emailService.js';

dotenv.config();

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID;

const publicUrl = (process.env.PUBLIC_URL || process.env.RENDER_EXTERNAL_URL || '').replace(
  /\/+$/,
  '',
);

export const TELEGRAM_WEBHOOK_PATH = '/telegram/webhook';

// Фолбэк выводится из токена бота, чтобы роут не остался без защиты,
// если TELEGRAM_WEBHOOK_SECRET забыли задать в окружении.
export const TELEGRAM_WEBHOOK_SECRET =
  process.env.TELEGRAM_WEBHOOK_SECRET ||
  crypto.createHash('sha256').update(telegramBotToken || '').digest('hex').slice(0, 32);

let botInstance;

const getBotInstance = () => {
  if (!botInstance) {
    // polling: false — апдейты приходят через webhook. Любой polling-инстанс
    // вызывает getUpdates и конфликтует (409) с остальными инстансами на Render.
    botInstance = new TelegramBot(telegramBotToken, { polling: false });
    initializeBot(botInstance);
  }
  return botInstance;
};

export const registerTelegramWebhook = async () => {
  const bot = getBotInstance();

  if (!telegramBotToken) {
    console.warn('[telegram] TELEGRAM_BOT_TOKEN не задан — webhook не регистрируется.');
    return;
  }

  if (!publicUrl) {
    console.warn(
      '[telegram] PUBLIC_URL / RENDER_EXTERNAL_URL не задан — webhook не регистрируется. ' +
        'Бот сможет отправлять сообщения, но не будет получать апдейты.',
    );
    return;
  }

  const webhookUrl = `${publicUrl}${TELEGRAM_WEBHOOK_PATH}`;

  try {
    // drop_pending_updates очищает очередь, накопленную за время 409-конфликта.
    await bot.setWebHook(webhookUrl, {
      secret_token: TELEGRAM_WEBHOOK_SECRET,
      drop_pending_updates: true,
      allowed_updates: ['message', 'callback_query'],
    });
    console.log(`[telegram] Webhook зарегистрирован: ${webhookUrl}`);
  } catch (error) {
    console.error('[telegram] Не удалось зарегистрировать webhook:', error.message);
  }
};

export const processTelegramUpdate = (update) => {
  getBotInstance().processUpdate(update);
};

const saveChatId = async (chatId) => {
  try {
    const exists = await UserAccessModel.findOne({ chatId });
    if (!exists) {
      await UserAccessModel.create({ chatId });
      console.log(`[telegram] Chat ID ${chatId} сохранён в базе.`);
      return true;
    }
    return false;
  } catch (error) {
    console.error('[telegram] Ошибка при сохранении chat ID:', error.message);
    return false;
  }
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

    const isNewUser = await saveChatId(chatId);
    if (isNewUser) {
      bot.sendMessage(chatId, 'Привет! Теперь вы будете получать уведомления.');
    }

    // Пропускаем обработку, если это команда
    if (!msg.text || msg.text.startsWith('/')) return;

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
