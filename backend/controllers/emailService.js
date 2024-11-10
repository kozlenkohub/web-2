// emailService.js

import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import userModel from '../models/userModel.js';

dotenv.config();

// Настройка транспортера
const transporter = nodemailer.createTransport({
  service: 'gmail', // Или ваш почтовый сервис
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Функция для отправки письма клиенту с временем доставки
export async function sendDeliveryTimeEmail(order, deliveryTime) {
  try {
    // Проверка: если письмо уже отправлено, сразу возвращаем false
    if (order.deliveryTimeEmailSent) {
      console.log('Письмо с временем доставки уже было отправлено клиенту');
      return false; // Письмо не отправляется повторно
    }

    // Получаем пользователя по userId из заказа
    const user = await userModel.findById(order.userId);
    if (!user) {
      console.error(`Пользователь с ID ${order.userId} не найден`);
      return false;
    }

    // Формируем список товаров
    const itemsList = order.items
      .map(
        (item) => `
          <tr>
            <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.price} zł</td>
          </tr>
        `,
      )
      .join('');

    // Параметры письма
    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'GastroFaza Delivery',
      html: `<div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <div style="background-color: #4CAF50; color: #ffffff; padding: 20px; text-align: center;">
      <h1 style="margin: 0;">Thank you for your order!</h1>
    </div>
    <div style="padding: 20px; color: #333333;">
      <p>Hello, <strong>${order.address.firstName}</strong>!</p>
      <p>Your order will be delivered in approximately <strong>${deliveryTime} minutes</strong>.</p>
      <h2 style="color: #4CAF50;">Order Details:</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th style="padding: 8px; border: 1px solid #ddd;">Product</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
            <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${itemsList}
        </tbody>
      </table>
      <p style="font-size: 18px; font-weight: bold; text-align: right;">Total Amount: ${
        order.amount
      } zł</p>
      <p>If you have any questions, please contact us at ${process.env.CONTACT_PHONE}.</p>
    </div>
    <div style="background-color: #f1f1f1; color: #777777; padding: 10px; text-align: center;">
      <p style="margin: 0;">&copy; ${new Date().getFullYear()} GASTROFAZA</p>
    </div>
  </div>
</div>`,
    };

    // Отправка письма
    await transporter.sendMail(mailOptions);
    console.log('Письмо с временем доставки отправлено клиенту');

    // Устанавливаем флаг `deliveryTimeEmailSent` в true и сохраняем заказ
    order.deliveryTimeEmailSent = true;
    await order.save();

    return true;
  } catch (error) {
    console.error('Ошибка при отправке письма с временем доставки:', error);
    return false;
  }
}
// Функция для отправки письма администратору о новом заказе
export async function sendAdminOrderEmail(order, sessionUrl) {
  const itemsList = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.price} zł</td>
        </tr>` +
        (item.comment
          ? `<tr><td colspan="3" style="padding: 8px; border: 1px solid #ddd; color: #666;">Комментарий: ${item.comment}</td></tr>`
          : ''),
    )
    .join('');

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.NOTIFICATION_EMAIL,
    subject: '🎉 Новый заказ',
    html: `
  <div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
      <div style="background-color: #4CAF50; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Новый заказ от ${order.address.firstName}</h1>
      </div>
      <div style="padding: 20px; color: #333;">
        <p><strong>ID заказа:</strong> ${order._id}</p>
        <p><strong>Имя:</strong> ${order.address.firstName}</p>
        <p><strong>Адрес:</strong> ${order.address.address}</p>
        <p><strong>Номер квартиры:</strong> ${order.address.apartmentNumber}</p>
        <p><strong>Телефон:</strong> ${order.address.phone}</p>
        <h2 style="color: #4CAF50;">Товары:</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd;">Товар</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Количество</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Цена</th>
            </tr>
          </thead>
          <tbody>
            ${itemsList}
          </tbody>
        </table>
        
        <p style="font-size: 16px; font-weight: bold;">Стоимость упаковки: ${
          order.packagingCharge
        } zł</p>
        <p style="font-size: 16px; font-weight: bold;">Стоимость доставки: ${
          order.deliveryCharge
        } zł</p>
        <p style="font-size: 18px; font-weight: bold; text-align: right;">Итоговая сумма: ${
          order.amount
        } zł</p>
        
        <p><strong>СПОСОБ ОПЛАТЫ:</strong> 
          <span style="text-transform: uppercase; color: #FF5733; font-weight: bold;">
            ${order.paymentMethod}
          </span>
        </p>
        ${
          sessionUrl
            ? `<p><a href="${sessionUrl}" style="color: #4CAF50; text-decoration: none;">Просмотреть детали оплаты</a></p>`
            : ''
        }
      </div>
      <div style="background-color: #f1f1f1; color: #777777; padding: 10px; text-align: center;">
        <p style="margin: 0;">&copy; ${new Date().getFullYear()} GASTROFAZA</p>
      </div>
    </div>
  </div>
`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Уведомление администратору отправлено');
  } catch (error) {
    console.error('Ошибка при отправке письма администратору:', error);
  }
}

export async function sendBulkEmail(subject, htmlContent) {
  try {
    // Получаем всех пользователей
    const users = await userModel.find({}, 'email'); // Извлекаем только поле email

    if (!users.length) {
      console.log('Нет пользователей для рассылки.');
      return;
    }

    // Создаем массив задач для отправки писем
    const emailPromises = users.map((user) => {
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: subject,
        html: htmlContent,
      };

      return transporter.sendMail(mailOptions);
    });

    // Отправляем все письма параллельно
    await Promise.all(emailPromises);
    console.log('Массовая рассылка выполнена успешно');
  } catch (error) {
    console.error('Ошибка при массовой рассылке:', error);
  }
}

export async function sendTestEmail(subject, htmlContent) {
  try {
    // Получаем всех пользователей
    const users = [{ email: 'gastrofaza2024@gmail.com' }];
    // Извлекаем только поле email

    if (!users.length) {
      console.log('Нет пользователей для рассылки.');
      return;
    }

    // Создаем массив задач для отправки писем
    const emailPromises = users.map((user) => {
      const mailOptions = {
        from: process.env.EMAIL,
        to: user.email,
        subject: subject,
        html: htmlContent,
      };

      return transporter.sendMail(mailOptions);
    });

    // Отправляем все письма параллельно
    await Promise.all(emailPromises);
    console.log('Массовая рассылка выполнена успешно');
  } catch (error) {
    console.error('Ошибка при массовой рассылке:', error);
  }
}
