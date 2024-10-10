import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // Используем пароль приложения
  },
});

// Функция для отправки письма
const sendOrderEmail = async (order, sessionUrl) => {
  if (order.emailSent) {
    console.log('Email already sent for this order.');
    return;
  }

  const paymentMethodMessage =
    order.paymentMethod === 'cash'
      ? '<p style="color: red; font-weight: bold;">ОПЛАТА НАЛИЧНЫМИ</p>'
      : `<p><a href="${sessionUrl}" style="color: #1a73e8; text-decoration: none;">Посмотреть транзакцию в Stripe</a></p>`;

  const itemsWithComments = order.items
    .map(
      (item) =>
        `<p><strong>${item.name}</strong> x ${item.quantity}</p>` +
        (item.comment ? `<p><em>Комментарий: ${item.comment}</em></p>` : ''),
    )
    .join('');

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.NOTIFICATION_EMAIL,
    subject: 'Новый заказ',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; background-color: #f9f9f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
          <div style="padding: 20px; border-bottom: 2px solid #4CAF50;">
            <h2 style="color: #4CAF50; text-align: center; margin-bottom: 10px;">🎉 Новый заказ!</h2>
          </div>
          <div style="padding: 20px;">
            <p style="font-size: 18px; margin: 0 0 10px;"><strong>Имя:</strong> ${
              order.address.firstName
            }</p>
            <p style="font-size: 18px; margin: 0 0 10px;"><strong>Адрес:</strong> ${
              order.address.address
            }, ${order.address.apartmentNumber}</p>
            <p style="font-size: 18px; margin: 0 0 10px;"><strong>Телефон:</strong> ${
              order.address.phone
            }</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <h3 style="color: #333; margin-bottom: 10px;">🛒 Товары:</h3>
            <div style="margin-bottom: 20px;">
              ${itemsWithComments}
            </div>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 18px; margin: 0 0 10px;"><strong>Оплата за упаковку:</strong> ${
              order.packagingCharge || 0
            } zł</p>
            <p style="font-size: 18px; margin: 0 0 10px;"><strong>Оплата за доставку:</strong> ${
              order.deliveryCharge / 100 || 0
            } zł</p>
            <p style="font-size: 20px; margin: 20px 0; font-weight: bold; color: #4CAF50;"><strong>Сумма:</strong> ${
              order.amount
            } zł</p>
            ${paymentMethodMessage}
          </div>
          <div style="padding: 20px; text-align: center; background-color: #4CAF50; color: #fff; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px;">
            <p style="margin: 0;">УДАЧНОЙ ДОСТАВКИ!</p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    await orderModel.findByIdAndUpdate(order._id, { emailSent: true });
    console.log('Email sent and order updated');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// Основная функция для размещения заказа
const placeOrder = async (req, res) => {
  const frontend_url = 'https://web-2-frontend.onrender.com';
  const token = req.headers.token;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

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
    if (distance <= 2) {
      deliveryCharge = 0;
    } else if (distance > 2 && distance <= 4) {
      deliveryCharge = 800;
    }

    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address, // Новая структура адреса
      paymentMethod: req.body.paymentMethod,
      payment: req.body.paymentMethod === 'cash' ? true : false,
      packagingCharge: req.body.packagingCharge,
      deliveryCharge: deliveryCharge,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    if (req.body.paymentMethod === 'cash') {
      await sendOrderEmail(newOrder, null);
      res.json({ success: true, message: 'Order placed with cash payment' });
    } else {
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
            product_data: { name: 'Opłata za dostawę' },
            unit_amount: deliveryCharge,
          },
          quantity: 1,
        });
      }

      if (req.body.packagingCharge > 0) {
        line_items.push({
          price_data: {
            currency: 'pln',
            product_data: { name: 'Opłata за opakowanie' },
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
    res.status(500).json({ success: false, message: 'Error' });
  }
};

export { placeOrder, sendOrderEmail };
