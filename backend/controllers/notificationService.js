// notificationService.js

import UserAccessModel from '../models/userAccessModel.js';
import bot from './bot.js'; // Убедитесь, что путь к боту корректен
import { formatPhoneNumber } from './utils.js';

// Функция для отправки сообщения о новом заказе в Telegram
export async function sendTelegramOrderMessage(order) {
  const orderMessage = `
📦 *Новый заказ!*
*ID заказа:* ${order._id}
*Имя:* ${order.address.firstName}
*Адрес:* ${order.address.address}
*Номер квартиры:* ${order.address.apartmentNumber}
*Телефон:* ${order.address.phone}
*Товары:*
${order.items.map((item) => `- ${item.name} x ${item.quantity}`).join('\n')}
*Итого:* ${order.amount} zł
*Способ оплаты:* ${order.paymentMethod}
  `;

  // Форматируем номер телефона клиента
  const formattedPhoneNumber = formatPhoneNumber(order.address.phone);

  // Если номер телефона недействителен, не добавляем кнопку "Связаться с клиентом"
  let contactButton = [];
  if (formattedPhoneNumber) {
    contactButton = [
      {
        text: 'Связаться с клиентом',
        url: `tel:${formattedPhoneNumber}`,
      },
    ];
  } else {
    console.error('Неверный номер телефона клиента:', order.address.phone);
  }

  const inlineKeyboard = [
    [
      { text: 'Установить время доставки', callback_data: `set_delivery_time_${order._id}` },
      ...contactButton,
    ],
  ];

  try {
    // Получаем всех пользователей с доступом
    const usersWithAccess = await UserAccessModel.find({});

    // Отправляем сообщение каждому пользователю
    usersWithAccess.forEach((user) => {
      bot.sendMessage(user.chatId, orderMessage, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: inlineKeyboard },
      });
    });

    console.log('Уведомления о заказе отправлены всем пользователям с доступом.');
  } catch (error) {
    console.error('Ошибка при отправке уведомлений о заказе:', error);
  }
}
