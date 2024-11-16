import React from 'react';

const CartSummary = ({
  totalAmount,
  deliveryCharge,
  packagingCharge,
  paymentMethod,
  setPaymentMethod,
  outOfDeliveryZone,
}) => (
  <div className="cart-summary">
    <h3>Order Summary</h3>
    <p>Subtotal: {totalAmount} zł</p>
    <p>Delivery Fee: {deliveryCharge === null ? 'Unavailable' : `${deliveryCharge} zł`}</p>
    <p>Packaging Fee: {packagingCharge} zł</p>
    {outOfDeliveryZone && <p style={{ color: 'red' }}>Out of delivery zone</p>}
    <h4>Total: {totalAmount + (deliveryCharge || 0) + packagingCharge} zł</h4>
    <div>
      <label>
        <input
          type="radio"
          value="card"
          checked={paymentMethod === 'card'}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Pay with Card
      </label>
      <label>
        <input
          type="radio"
          value="cash"
          checked={paymentMethod === 'cash'}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />
        Pay with Cash
      </label>
    </div>
    <button type="submit" disabled={outOfDeliveryZone}>
      Place Order
    </button>
  </div>
);

export default CartSummary;
