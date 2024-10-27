import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const getSuccessfulPaymentsByMonth = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Получаем временные метки для начала и конца месяца
    const startOfMonth = new Date(year, month - 1, 1).getTime() / 1000;
    const endOfMonth = new Date(year, month, 0, 23, 59, 59).getTime() / 1000;

    // Запрашиваем успешные платежи через Stripe Charges API
    const charges = await stripe.charges.list({
      created: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
      limit: 100, // Максимум 100 за один запрос (пагинация может понадобиться для больших данных)
      status: 'succeeded', // Только успешные платежи
    });

    // Возвращаем список успешных платежей
    res.json({ success: true, data: charges.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Ошибка при получении платежей' });
  }
};
const getPaymentDetails = async (req, res) => {
  try {
    const { id } = req.params; // Идентификатор транзакции передается через URL

    // Получение полной информации по транзакции
    const payment = await stripe.charges.retrieve(id);

    res.json({ success: true, data: payment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Ошибка при получении деталей транзакции' });
  }
};

export { getSuccessfulPaymentsByMonth, getPaymentDetails };
