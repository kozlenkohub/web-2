import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; // Импортируем хук для перевода

const Cart = () => {
  const { t } = useTranslation(); // Подключаем хук для перевода
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, token } =
    useContext(StoreContext);
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState(false);

  const handleCheckout = () => {
    if (!token) {
      setShowNotification(true);
    } else {
      navigate('/order');
    }
  };

  return (
    <div className="cart">
      {showNotification && (
        <div className="notification">
          <p>{t('cart.notificationLogin')}</p> {/* Перевод сообщения уведомления */}
        </div>
      )}
      <div className="cart-items">
        <div className="cart-items-title">
          <p className="t3 cart-items-title-item">{t('cart.items')}</p>
          <p className="t3 cart-items-title-item">{t('cart.name')}</p>
          <p className="t3 cart-items-title-item">{t('cart.price')}</p>
          <p className="t3 cart-items-title-item">{t('cart.quantity')}</p>
          <p className="t3 cart-items-title-item">{t('cart.total')}</p>
          <p className="t3 cart-items-title-item">{t('cart.remove')}</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className="cart-items-title cart-items-item">
                  <img src={url + '/images/' + item.image} alt="" />
                  <p className="t3">{item.name}</p>
                  <p className="t3">{item.price} zł</p>
                  <p className="t3">{cartItems[item._id]}</p>
                  <p className="t3">{item.price * cartItems[item._id]} zł</p>
                  <p onClick={() => removeFromCart(item._id)} className="cross t3">
                    x
                  </p>
                </div>
                <hr />
              </div>
            );
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2 className="t3">{t('cart.title')}</h2>
          <div>
            <div className="cart-total-details">
              <p className="t5">{t('cart.subtotal')}</p>
              <p className="t5">{getTotalCartAmount()} zł</p>
            </div>
            <hr />
          </div>
          <button className="t6" onClick={handleCheckout}>
            {t('cart.proceed')}
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p className="promocodep t3">{t('cart.promoCodeText')}</p>
            <div className="cart-promocode-input">
              <input className="t6" type="text" placeholder={t('cart.promoCodePlaceholder')} />
              <button className="t6">{t('cart.applyButton')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
