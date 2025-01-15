import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(
  'pk_test_51PtzgmHpIlFhlJbKkSTjQS3NrT4GcAwRm14JYEt3Y27MZAYeOUCAr8ReAFBiGdaBBu2pyCu7zCalC3mLY3zoPYKn00e66ghrIz',
);
const endpointSecret = 'whsec_Tqj0tPZjigY2acPgoWNv5lJE2sGjxnuv';

const webHookRoute = express.Router();

webHookRoute.post('/', express.raw({ type: 'application/json' }), (request, response) => {
  console.log('Webhook received!');

  const sig = request.headers['stripe-signature'];

  let event;

  try {
    // Проверка подписи вебхука с сырым телом запроса
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Обработка события
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log('Checkout session completed!');
      console.log(`Session ID: ${session.id}`);
      console.log(`Customer email: ${session.customer_email || 'Not provided'}`);
      // Дополнительная логика
      break;

    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent succeeded: ${paymentIntent.id}`);
      // Дополнительная логика
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Подтверждаем получение события
  response.json({ received: true });
});

export default webHookRoute;
