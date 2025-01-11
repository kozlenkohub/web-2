import React, { useState, useEffect } from 'react';
import './PaymentsFetcher.css';
import axios from 'axios';

const PaymentsFetcher = ({ url }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [amountValue, setAmountValue] = useState(null);
  const [upcomingPayouts, setUpcomingPayouts] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.post(`${url}/api/stripe/payments`);
        console.log(response.data);

        setPayments(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Произошла ошибка');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, [url]);

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

  const onClick = () => {
    axios
      .post(`${url}/api/stripe/items`, {
        paymentIntentId: 'pm_1QflBxHpIlFhlJbK0hV7fyUX',
      })
      .then((response) => {
        console.log(response.data);
      });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const handlePaymentClick = (payment) => {
    axios.post(`${url}/api/stripe/items`, { paymentIntentId: payment.id }).then((response) => {
      setItems(response.data.items || []);
      setSelectedPayment(payment);
    });
  };

  const closeModal = () => {
    setSelectedPayment(null);
  };

  return (
    <div className="payments-fetcher">
      <div className="payments-fetcher__balance-section">
        <div className="payments-fetcher__balance">
          <strong>На балансе:</strong> {loading ? 'Генерация...' : `${amountValue} PLN`}
        </div>
        {error && <p className="payments-fetcher__error">Ошибка: {error}</p>}
      </div>

      <div className="payments-fetcher__upcoming-payouts">
        <h3 className="payments-fetcher__upcoming-payouts-title">Предстоящие выплаты</h3>
        {upcomingPayouts.length > 0 ? (
          upcomingPayouts.map((payout) => (
            <div key={payout.id} className="payments-fetcher__payout">
              <span className="payments-fetcher__payout-date">
                {formatDate(payout.arrival_date)}
              </span>
              :{' '}
              <span className="payments-fetcher__payout-amount">
                {(payout.amount / 100).toFixed(2)} PLN
              </span>
            </div>
          ))
        ) : (
          <p className="payments-fetcher__success">Нет предстоящих выплат.</p>
        )}
      </div>

      <div className="payments-fetcher__payments-section">
        <h3>Платежи</h3>
        {payments.length > 0 ? (
          payments.map((payment) => (
            <div
              key={payment.id}
              className="payments-fetcher__payment"
              onClick={() => handlePaymentClick(payment)}>
              <span className="payments-fetcher__payment-date">{formatDate(payment.created)}</span>:{' '}
              <span className="payments-fetcher__payment-amount">
                {(payment.amount / 100).toFixed(2)} PLN
              </span>
            </div>
          ))
        ) : (
          <p className="payments-fetcher__success">Нет платежей.</p>
        )}
      </div>
    </div>
  );
};

export default PaymentsFetcher;
