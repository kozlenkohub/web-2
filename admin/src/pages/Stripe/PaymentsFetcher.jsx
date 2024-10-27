import React, { useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import './PaymentsFetcher.css'; // Стили для компонента

const PaymentsFetcher = ({ url }) => {
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null); // Детали выбранной транзакции

  const fetchPayments = async () => {
    if (!month || !year) {
      setError('Пожалуйста, выберите месяц и год');
      return;
    }

    setLoading(true);
    setError('');
    setPaymentDetails(null); // Очищаем детали при новом запросе
    try {
      const response = await axios.get(`${url}/api/payments`, {
        params: { month, year },
      });

      if (response.data.success) {
        setPayments(response.data.data);
      } else {
        setError('Ошибка при получении платежей');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Произошла ошибка при получении данных');
    } finally {
      setLoading(false);
    }
  };

  // Функция для получения деталей транзакции
  const fetchPaymentDetails = async (paymentId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url}/api/payment/${paymentId}`);

      if (response.data.success) {
        setPaymentDetails(response.data.data); // Сохраняем детали транзакции
      } else {
        setError('Ошибка при получении деталей транзакции');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      setError('Произошла ошибка при получении данных');
    } finally {
      setLoading(false);
    }
  };

  // Функция для генерации и выгрузки инвойсов в PDF
  const downloadPdf = () => {
    const doc = new jsPDF();

    doc.text(`Инвойсы за ${month}/${year}`, 10, 10);

    payments.forEach((payment, index) => {
      doc.text(
        `ID: ${payment.id}, Сумма: ${
          payment.amount / 100
        } ${payment.currency.toUpperCase()}, Статус: ${payment.status}`,
        10,
        20 + index * 10,
      );
    });

    doc.save(`invoices_${month}_${year}.pdf`);
  };

  return (
    <div className="payments-fetcher">
      <h2>Получить успешные платежи за месяц</h2>
      <div>
        <label>
          Месяц:
          <select value={month} onChange={(e) => setMonth(e.target.value)}>
            <option value="">Выберите месяц</option>
            <option value="1">Январь</option>
            <option value="2">Февраль</option>
            <option value="3">Март</option>
            <option value="4">Апрель</option>
            <option value="5">Май</option>
            <option value="6">Июнь</option>
            <option value="7">Июль</option>
            <option value="8">Август</option>
            <option value="9">Сентябрь</option>
            <option value="10">Октябрь</option>
            <option value="11">Ноябрь</option>
            <option value="12">Декабрь</option>
          </select>
        </label>
        <label>
          Год:
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Выберите год</option>
            {Array.from(new Array(10), (v, i) => i + new Date().getFullYear() - 9).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <button onClick={fetchPayments} disabled={loading}>
          {loading ? 'Загрузка...' : 'Получить платежи'}
        </button>
      </div>

      {error && <p>{error}</p>}

      {payments.length > 0 && (
        <div>
          <h3>
            Платежи за {month}/{year}
          </h3>
          <ul>
            {payments.map((payment) => (
              <li key={payment.id} onClick={() => fetchPaymentDetails(payment.id)}>
                ID: {payment.id}, Сумма: {payment.amount / 100} {payment.currency.toUpperCase()},
                Статус: {payment.status}
              </li>
            ))}
          </ul>
          <button onClick={downloadPdf}>Выгрузить инвойс в PDF</button>
        </div>
      )}

      {paymentDetails && (
        <div className="details">
          <h3>Детали транзакции</h3>
          <p>ID: {paymentDetails.id}</p>
          <p>
            Сумма: {paymentDetails.amount / 100} {paymentDetails.currency.toUpperCase()}
          </p>
          <p>Статус: {paymentDetails.status}</p>
          <p>Описание: {paymentDetails.description || 'Нет описания'}</p>
          <p>
            Метод оплаты: {paymentDetails.payment_method_details.card.brand} ****
            {paymentDetails.payment_method_details.card.last4}
          </p>
          <p>Дата создания: {new Date(paymentDetails.created * 1000).toLocaleDateString()}</p>
        </div>
      )}
    </div>
  );
};

export default PaymentsFetcher;
