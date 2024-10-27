// paymentService.js

import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Функция для создания платежной сессии
export async function createStripeSession(order, frontendUrl) {
  const line_items = order.items.map((item) => ({
    price_data: {
      currency: 'pln',
      product_data: { name: item.name },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  if (order.deliveryCharge > 0) {
    line_items.push({
      price_data: {
        currency: 'pln',
        product_data: { name: 'Delivery Fee' },
        unit_amount: order.deliveryCharge * 100,
      },
      quantity: 1,
    });
  }

  if (order.packagingCharge > 0) {
    line_items.push({
      price_data: {
        currency: 'pln',
        product_data: { name: 'Package Fee' },
        unit_amount: order.packagingCharge * 100,
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    line_items: line_items,
    mode: 'payment',
    payment_method_types: ['blik', 'card'],
    success_url: `${frontendUrl}/verify?success=true&orderId=${order._id}`,
    cancel_url: `${frontendUrl}/verify?success=false&orderId=${order._id}`,
  });

  return session.url;
}
