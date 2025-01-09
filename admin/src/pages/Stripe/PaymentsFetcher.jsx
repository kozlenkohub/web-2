import React, { useState, useEffect } from 'react';
import './PaymentsFetcher.css';
import axios from 'axios';

const PaymentsFetcher = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amountValue, setAmountValue] = useState(null);
  const [upcomingPayouts, setUpcomingPayouts] = useState([]);
  const [month, setMonth] = useState('12');
  const [year, setYear] = useState('2024');
  const [reportUrl, setReportUrl] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(`${url}/api/stripe/reports`);
        setAmountValue(response.data.amount);
        setUpcomingPayouts(response.data.upcomingPayouts || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    setReportUrl(null);

    try {
      const response = await axios.post(`${url}/api/stripe/report-runs`, {
        month: parseInt(month, 10),
        year: parseInt(year, 10),
      });
      setReportUrl(response.data.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Произошла ошибка при генерации отчета');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="PaymentsFetcher">
      <div className="balance-section">
        <div className="balance">
          <strong>На балансе:</strong> {loading ? 'Генерация...' : `${amountValue} PLN`}
        </div>
        {error && <p className="error">Ошибка: {error}</p>}
      </div>

      <div className="upcoming-payouts">
        <h3>Предстоящие выплаты</h3>
        {upcomingPayouts.length > 0 ? (
          upcomingPayouts.map((payout) => (
            <div key={payout.id} className="payout">
              <span className="payout-date">{formatDate(payout.arrival_date)}</span>:{' '}
              <span className="payout-amount">{(payout.amount / 100).toFixed(2)} PLN</span>
            </div>
          ))
        ) : (
          <p className="success">Нет предстоящих выплат.</p>
        )}
      </div>

      <div className="report-runner">
        <label>
          Месяц:
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min="1"
            max="12"
          />
        </label>
        <label>
          Год:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="2020"
            max="2100"
          />
        </label>
        <button onClick={handleClick} disabled={loading}>
          Запустить отчет
        </button>
        {reportUrl && (
          <p className="report-url">
            Отчет сгенерирован:{' '}
            <a href={reportUrl} target="_blank" rel="noopener noreferrer">
              Скачать
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentsFetcher;
