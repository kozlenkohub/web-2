import React, { useState } from 'react';
import './PaymentsFetcher.css';
import axios from 'axios';

const PaymentsFetcher = ({ url }) => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportUrl, setReportUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setReportUrl(null);
    setError(null);

    try {
      const response = await axios.post(`${url}/api/stripe/reports/`, { month, year });
      if (response.status === 200) {
        setReportUrl(response.data.url);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка при получении отчета');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="PaymentsFetcher">
      <div>
        <form onSubmit={handleSubmit}>
          <label>
            Месяц:
            <input
              type="number"
              min="1"
              max="12"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              required
            />
          </label>
          <label>
            Год:
            <input
              type="number"
              min="2000"
              max="2100"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
            />
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Генерация...' : 'Сгенерировать отчет'}
          </button>
        </form>
        {reportUrl && (
          <p>
            Отчет готов!{' '}
            <a href={reportUrl} target="_blank" rel="noopener noreferrer">
              Скачать отчет
            </a>
          </p>
        )}
        {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}
      </div>
    </div>
  );
};

export default PaymentsFetcher;
