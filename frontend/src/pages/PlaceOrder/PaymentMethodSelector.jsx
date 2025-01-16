// PaymentMethodSelector.js

import React from 'react';

const PaymentMethodSelector = ({ t, paymentMethod, handlePaymentMethodChange }) => {
  return (
    <div className="payment-methods">
      <label>
        <input
          type="radio"
          value="card"
          checked={paymentMethod === 'card'}
          onChange={handlePaymentMethodChange}
        />
        {t('placeOrder.paymentMethodCard')}
      </label>
      <label>
        <input
          type="radio"
          value="cash"
          checked={paymentMethod === 'cash'}
          onChange={handlePaymentMethodChange}
        />
        {t('placeOrder.paymentMethodCash')}
      </label>
    </div>
  );
};

export default PaymentMethodSelector;
