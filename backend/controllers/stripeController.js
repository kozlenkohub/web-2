import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const generateReport = async (req, res) => {
  try {
    // Создаем отчет
    const reportRun = await stripe.reporting.reportRuns.create({
      report_type: 'balance_change_from_activity.summary.1', // Тип отчета
      parameters: {
        interval_start: Math.floor(new Date('2024-12-01').getTime() / 1000), // Начало периода
        interval_end: Math.floor(new Date('2024-12-31').getTime() / 1000), // Конец периода
      },
    });

    // Проверяем статус отчета
    const checkReportStatus = async () => {
      const report = await stripe.reporting.reportRuns.retrieve(reportRun.id);
      if (report.status === 'succeeded') {
        return report.result.url; // Возвращаем ссылку на PDF
      } else if (report.status === 'failed') {
        throw new Error('Отчет не удалось создать.');
      }
      return null; // Отчет еще обрабатывается
    };

    // Ожидание генерации отчета
    let reportUrl = null;
    const timeout = 30000; // 30 секунд
    const interval = 3000; // Интервал проверки (3 секунды)
    const startTime = Date.now();

    while (!reportUrl && Date.now() - startTime < timeout) {
      reportUrl = await checkReportStatus();
      if (!reportUrl) {
        await new Promise((resolve) => setTimeout(resolve, interval));
      }
    }

    if (reportUrl) {
      res.status(200).json({ message: 'Отчет готов', url: reportUrl });
    } else {
      res
        .status(202)
        .json({ message: 'Отчет обрабатывается. Попробуйте позже.', reportId: reportRun.id });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};
