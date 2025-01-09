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
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const reportRuns = async (req, res) => {
  try {
    const { month, year } = req.body;

    // Создание отчета
    const reportRun = await stripe.reporting.reportRuns.create({
      report_type: 'balance.summary.1',
      parameters: {
        interval_start: new Date(year, month - 1, 1) / 1000,
        interval_end: new Date(year, month, 0) / 1000,
      },
    });

    // Отправка результата клиенту
    res.json({ url: reportRun.result?.url });
  } catch (error) {
    console.error('Error creating report run:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const balanceTransactions = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const transactions = await stripe.reporting.reportRuns.create({
      report_type: 'balance.transactions.1',
      parameters: {
        limit: parseInt(limit, 10),
      },
    });

    res.json(transactions);
  } catch (error) {
    console.error('Error fetching balance transactions:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
