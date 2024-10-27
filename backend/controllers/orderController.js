import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import UserAccessModel from '../models/userAccessModel.js'; // Import the UserAccessModel
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
  service: 'gmail', // Or your email service
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(telegramBotToken, { polling: true });

const adminChatId = process.env.ADMIN_TELEGRAM_CHAT_ID; // Your Telegram Chat ID

// Function to check user access
const checkUserAccess = async (chatId) => {
  // Всегда разрешаем доступ администратору
  if (chatId.toString() === adminChatId.toString()) {
    return true;
  }
  const userAccess = await UserAccessModel.findOne({ chatId });
  return userAccess !== null; // Возвращает true, если пользователь есть в списке
};

// Function to send a delivery time email to the user
const sendDeliveryTimeEmail = async (order, deliveryTime) => {
  try {
    const user = await userModel.findById(order.userId);
    if (!user) {
      console.error(`User with ID ${order.userId} not found`);
      return;
    }

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

    const mailOptions = {
      from: process.env.EMAIL,
      to: user.email,
      subject: 'GastroFaza Delivery',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f2f2f2; padding: 20px;">
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
                    <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
                    <th style="padding: 8px; border: 1px solid #ddd;">Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
              <p style="font-size: 18px; font-weight: bold; text-align: right;">Total amount: ${
                order.amount
              } zł</p>
              <p>If you have any questions, please contact us by phone at ${
                process.env.CONTACT_PHONE
              }.</p>
            </div>
            <div style="background-color: #f1f1f1; color: #777777; padding: 10px; text-align: center;">
              <p style="margin: 0;">&copy; ${new Date().getFullYear()} GASTROFAZA</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Delivery time email sent to the user');
  } catch (error) {
    console.error('Error sending delivery time email:', error);
  }
};

// Function to send an email to the administrator
const sendAdminOrderEmail = async (order, sessionUrl) => {
  const itemsList = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${item.price} zł</td>
        </tr>` +
        (item.comment
          ? `<tr><td colspan="3" style="padding: 8px; border: 1px solid #ddd; color: #666;">Comment: ${item.comment}</td></tr>`
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
            <p style="font-size: 18px; font-weight: bold; text-align: right;">Итоговая сумма: ${
              order.amount
            } zł</p>
            <p><strong>СПОСОБ ОПЛАТЫ:</strong> 
              <span style="text-transform: uppercase; color: #FF5733; font-weight: bold;">${
                order.paymentMethod
              }</span>
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
    console.log('Admin notification email sent');
  } catch (error) {
    console.error('Error sending admin email:', error);
  }
};

// Function to place an order
const placeOrder = async (req, res) => {
  const frontend_url = 'https://www.burgergastrofaza.pl'; // Replace with your frontend URL

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
      // For cash payment, send notifications immediately
      await sendAdminOrderEmail(newOrder, null);
      sendTelegramOrderMessage(newOrder);
      res.json({ success: true, message: 'Order placed with cash payment' });
    } else {
      // Create Stripe session
      const line_items = req.body.items.map((item) => ({
        price_data: {
          currency: 'pln',
          product_data: { name: item.name },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      if (deliveryCharge > 0) {
        line_items.push({
          price_data: {
            currency: 'pln',
            product_data: { name: 'Delivery Fee' },
            unit_amount: deliveryCharge * 100,
          },
          quantity: 1,
        });
      }

      if (req.body.packagingCharge > 0) {
        line_items.push({
          price_data: {
            currency: 'pln',
            product_data: { name: 'Packaging Fee' },
            unit_amount: req.body.packagingCharge * 100,
          },
          quantity: 1,
        });
      }

      const session = await stripe.checkout.sessions.create({
        line_items: line_items,
        mode: 'payment',
        payment_method_types: ['blik', 'card'],
        success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
      });

      res.json({ success: true, session_url: session.url });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error placing order' });
  }
};

// Function to verify the order
const verifyOrder = async (req, res) => {
  const { orderId, success, sessionUrl } = req.body;
  try {
    const order = await orderModel.findById(orderId);
    if (success === 'true') {
      await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true, paymentTime: new Date() },
        { new: true },
      );
      await sendAdminOrderEmail(order, sessionUrl);
      sendTelegramOrderMessage(order);
      res.json({ success: true, message: 'Payment confirmed' });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: 'Payment failed, order canceled' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error confirming order' });
  }
};

// Function to send a Telegram message about the order
const sendTelegramOrderMessage = (order) => {
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

  // Inline buttons for interaction
  const inlineKeyboard = [
    [{ text: 'Set Delivery Time', callback_data: `set_delivery_time_${order._id}` }],
  ];

  bot.sendMessage(adminChatId, orderMessage, {
    parse_mode: 'Markdown',
    reply_markup: { inline_keyboard: inlineKeyboard },
  });
};

// Function to get user orders
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId, payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error retrieving user orders' });
  }
};

// Function to list all orders
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error retrieving all orders' });
  }
};

// Function to update order status
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error updating status' });
  }
};

// Function to delete an order
const deleteOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.body.orderId);
    res.json({ success: true, message: 'Order deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error deleting order' });
  }
};

// Telegram bot handlers with access check
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  // Access check
  const hasAccess = await checkUserAccess(chatId);
  if (!hasAccess) {
    bot.answerCallbackQuery(query.id, {
      text: 'У вас нет прав для выполнения этого действия.',
    });
    return;
  }

  // Handle inline buttons
  if (data.startsWith('set_delivery_time_')) {
    const orderId = data.replace('set_delivery_time_', '');

    bot.sendMessage(chatId, 'Пожалуйста, введите время доставки в минутах:');
    bot.once('message', async (msg) => {
      const deliveryTime = parseInt(msg.text, 10);
      if (isNaN(deliveryTime)) {
        bot.sendMessage(chatId, 'Пожалуйста, введите корректное число.');
        return;
      }

      try {
        await orderModel.findByIdAndUpdate(orderId, { deliveryTime });
        const order = await orderModel.findById(orderId);

        await sendDeliveryTimeEmail(order, deliveryTime);

        bot.sendMessage(
          chatId,
          `Delivery time for order ${orderId} set to ${deliveryTime} minutes. Email sent to the user.`,
        );
      } catch (error) {
        console.error('Error setting delivery time:', error);
        bot.sendMessage(chatId, 'An error occurred while setting the delivery time.');
      }
    });
  }
});

bot.onText(/\/adduser (\d+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const userIdToAdd = match[1];

  // Проверяем, что команду отправил администратор
  if (chatId.toString() !== adminChatId) {
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

// Handler for the /start command with access check
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;

  // Access check
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

// Function to calculate the distance between two points
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, deleteOrder };
