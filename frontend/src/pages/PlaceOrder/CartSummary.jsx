// CartSummary.js

import React from 'react';
import CartItemsWithComments from './CartItemsWithComments';
import PaymentMethodSelector from './PaymentMethodSelector';

const CartSummary = ({
  t,
  getTotalCartAmount,
  deliveryCharge,
  packagingCharge,
  cartItems,
  food_list,
  comments,
  onCommentChangeHandler,
  paymentMethod,
  handlePaymentMethodChange,
}) => {
  return (
    <div className="cart-total">
      <h2 className="t3">{t('cart.title')}</h2>
      <div>
        <div className="cart-total-details">
          <p className="t5">{t('cart.subtotal')}</p>
          <p className="t3">{getTotalCartAmount()} zł</p>
        </div>
        <hr />
        {deliveryCharge !== null && (
          <>
            <div className="cart-total-details">
              <p className="t5">{t('placeOrder.deliveryFee')}</p>
              <p className="t3">
                {deliveryCharge === 0 ? t('placeOrder.freeDelivery') : `${deliveryCharge} zł`}
              </p>
            </div>
            <hr />
          </>
        )}
        <div className="cart-total-details">
          <p className="t5">{t('placeOrder.packagingFee')}</p>
          <p className="t3">{packagingCharge} zł</p>
        </div>
        <hr />
        <div className="cart-total-details">
          <b className="t5">{t('cart.total')}</b>
          <b className="t3">{getTotalCartAmount() + (deliveryCharge || 0) + packagingCharge} zł</b>
        </div>
        <hr />
        <CartItemsWithComments
          t={t}
          cartItems={cartItems}
          food_list={food_list}
          comments={comments}
          onCommentChangeHandler={onCommentChangeHandler}
        />
      </div>
      <PaymentMethodSelector
        t={t}
        paymentMethod={paymentMethod}
        handlePaymentMethodChange={handlePaymentMethodChange}
      />
    </div>
  );
};

export default CartSummary;
