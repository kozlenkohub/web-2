import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // используем пароль приложения
  },
});

const sendOrderEmail = async (order, sessionUrl) => {
  const paymentMethodMessage =
    order.paymentMethod === 'cash'
      ? '<p style="color: red; font-weight: bold;">ОПЛАТА НАЛИЧНЫМИ</p>'
      : `<p><a href="${sessionUrl}" style="color: #1a73e8; text-decoration: none;">Посмотреть транзакцию в Stripe</a></p>`;

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.NOTIFICATION_EMAIL,
    subject: 'Новый заказ',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="color: #333;">Поступил новый заказ</h2>
        <p><strong>Имя:</strong> ${order.address.firstName} ${order.address.lastName}</p>
        <p><strong>Адрес:</strong> ${order.address.street}, ${order.address.city},  ${
      order.address.country
    }, ${order.address.zipcode}</p>
        <p><strong>Телефон:</strong> ${order.address.phone}</p>
        <p><strong>Товары:</strong> ${order.items
          .map((item) => `${item.name} x ${item.quantity}`)
          .join(', ')}</p>
        <p><strong>Сумма:</strong> ${order.amount} zł</p>
       <p><strong>Opłata za opakowanie:</strong> ${order.packagingCharge || 0} zł</p>
        ${paymentMethodMessage}
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

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
      amount: req.body.amount, // Сумма уже включает доставку и упаковку
      packagingCharge: req.body.packagingCharge, // Добавляем упаковку
      address: req.body.address,
      paymentMethod: req.body.paymentMethod,
      payment: req.body.paymentMethod === 'cash' ? true : false,
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
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      }));

      if (deliveryCharge > 0) {
        line_items.push({
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Opłata za dostawę',
            },
            unit_amount: deliveryCharge,
          },
          quantity: 1,
        });
      }

      if (req.body.packagingCharge > 0) {
        line_items.push({
          price_data: {
            currency: 'pln',
            product_data: {
              name: 'Opłata za opakowanie',
            },
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

// Utility function to calculate distance between two points in km
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return distance;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const verifyOrder = async (req, res) => {
  const { orderId, success, sessionUrl } = req.body;
  try {
    const order = await orderModel.findById(orderId);
    if (success === 'true') {
      // Если оплата через Stripe успешна, обновляем статус оплаты и время
      await orderModel.findByIdAndUpdate(
        orderId,
        { payment: true, paymentTime: new Date() },
        { new: true },
      );
      await sendOrderEmail(order, sessionUrl);
      res.json({ success: true, message: 'Payment confirmed' });
    } else {
      // Если оплата неуспешна, заказ удаляется
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: 'Payment failed, order canceled' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId, payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ payment: true });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: 'Status Updated' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

const deleteOrder = async (req, res) => {
  try {
    await orderModel.findByIdAndDelete(req.body.orderId);
    res.json({ success: true, message: 'Order Deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Error' });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, deleteOrder };
