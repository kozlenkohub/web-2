import React, { useContext, useState } from 'react';
import './Cart.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
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
          <p>Proszę się zalogować, aby kontynuować zamówienie.</p>
        </div>
      )}
      <div className="cart-items">
        <div className="cart-items-title">
          <p className="t3 cart-items-title-item">Przedmioty</p>
          <p className="t3 cart-items-title-item">Nazwa</p>
          <p className="t3 cart-items-title-item">Cena</p>
          <p className="t3 cart-items-title-item">Ilość</p>
          <p className="t3 cart-items-title-item">Suma</p>
          <p className="t3 cart-items-title-item">Usuń</p>
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
          return null; // Dodane, aby uniknąć ostrzeżeń
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2 className="t3">Podsumowanie Koszyka</h2>
          <div>
            <div className="cart-total-details">
              <p className="t5">Suma częściowa</p>
              <p className="t5">{getTotalCartAmount()} zł</p>
            </div>
            <hr />
            {/* <div className="cart-total-details">
              <p className="t5">Opłata za dostawę</p>
              <p className="t5">{getTotalCartAmount() === 0 ? 0 : 8} zł</p>
            </div>
            <hr />
            <div className="cart-total-details ">
              <b className="t5">Suma</b>
              <b className="t5">{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 8} zł</b>
            </div> */}
          </div>
          <button className="t6" onClick={handleCheckout}>
            PRZEJDŹ DO KASY
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p className="promocodep t3">Jeśli masz kod promocyjny, wpisz go tutaj</p>
            <div className="cart-promocode-input">
              <input className="t6" type="text" placeholder="Kod promocyjny" />
              <button className="t6">Zatwierdź</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
