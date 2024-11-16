// CartItemsWithComments.js

import React from 'react';

const CartItemsWithComments = ({ t, cartItems, food_list, comments, onCommentChangeHandler }) => {
  return (
    <div className="cart-items">
      <div className="title t3 tac">{t('placeOrder.comment')}</div>
      {food_list.map((item) =>
        cartItems[item._id] > 0 ? (
          <div key={item._id} className="cart-item">
            <div className="item-details">
              <img src={`${item.image}`} alt="" className="item-image" />
              <div>
                <p>{item.name}</p>
                <p>
                  {cartItems[item._id]} x {item.price} zł
                </p>
              </div>
            </div>
            <textarea
              placeholder={t('placeOrder.commentPlaceholder')}
              value={comments[item._id] || ''}
              onChange={(e) => onCommentChangeHandler(item._id, e.target.value)}
            />
          </div>
        ) : null,
      )}
    </div>
  );
};

export default CartItemsWithComments;
