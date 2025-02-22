import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const generateReport = async (req, res) => {
  try {
    const balance = await stripe.balance.retrieve();
    const { amount } = balance.pending[0];
    const formattedAmount = (amount / 100).toFixed(2);
    const payouts = await stripe.payouts.list({ limit: 15 });
    const upcomingPayouts = payouts.data.filter((payout) => payout.status === 'in_transit');

    res.json({ amount: formattedAmount, upcomingPayouts });
  } catch (error) {
    console.error('Error in generateReport:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const reportRuns = async (req, res) => {
  try {
    const { month, year } = req.body;

    const intervalStart = Math.floor(new Date(year, month - 1, 1).getTime() / 1000);
    const intervalEnd = Math.floor(new Date(year, month, 0).getTime() / 1000);

    const reportRun = await stripe.reporting.reportRuns.create({
      report_type: 'balance.summary.1',
      parameters: {
        interval_start: intervalStart,
        interval_end: intervalEnd,
      },
    });

    res.json({ url: reportRun.result?.url });
  } catch (error) {
    console.error('Error in reportRuns:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const last10Payments = async (req, res) => {
  try {
    const payments = await stripe.paymentIntents.list({ limit: 10, status: 'succeeded' });
    res.json(payments.data);
  } catch (error) {
    console.error('Error in last10Payments:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getPaymentItems = async (req, res) => {
  const { paymentIntentId } = req.body;
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    const rawItems = paymentIntent.metadata?.items || '[]';

    // Безопасный парсер для JSON
    let items = [];
    try {
      items = JSON.parse(rawItems);
    } catch (error) {
      console.error('Invalid metadata.items JSON:', error);
      return res.status(400).json({ message: 'Invalid items format in metadata' });
    }

    res.json({ items });
  } catch (error) {
    console.error('Error in getPaymentItems:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const handleStripeWebhook = async (req, res) => {
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Проверка подписи Stripe
    event = stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Обработка событий
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      console.log('✅ Checkout session completed:', session);
      handleCheckoutSession(session);
      break;
    }

    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      console.log('✅ PaymentIntent succeeded:', paymentIntent);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).send('Event received');
};

// Обработка завершенного сеанса Checkout
const handleCheckoutSession = (session) => {
  const { id, amount_total, currency, customer_details, metadata } = session;

  console.log('📦 Новый заказ:');
  console.log(`- ID: ${id}`);
  console.log(`- Сумма: ${(amount_total / 100).toFixed(2)} ${currency.toUpperCase()}`);
  console.log(`- Покупатель: ${customer_details.email}`);
  console.log(`- Метаданные: ${JSON.stringify(metadata)}`);

  // Здесь можно добавить логику для сохранения данных в базу или отправки уведомления
};
