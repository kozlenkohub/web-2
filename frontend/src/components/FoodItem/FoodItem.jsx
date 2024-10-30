import React, { useContext } from 'react';
import './FoodItem.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

function FoodItem({ id, name, price, description, description_en, description_ru, image }) {
  const { cartItems, addToCart, removeFromCart, url, language } = useContext(StoreContext);

  // Проверка на наличие данных
  if (!id || !name || !price || !image || !url) {
    console.warn('FoodItem пропсы или контекст не заданы корректно');
    return null; // Возвращаем null, если данные не заданы
  }

  // Выбор описания в зависимости от языка
  let descriptionToDisplay = description; // По умолчанию — польское описание

  if (language === 'en' && description_en) {
    descriptionToDisplay = description_en;
  } else if (language === 'ru' && description_ru) {
    descriptionToDisplay = description_ru;
  }

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={image} alt={name} />
        {!cartItems[id] ? (
          <img
            className="add"
            onClick={() => addToCart(id)}
            src={assets.add_icon_white}
            alt="Add"
          />
        ) : (
          <div className="food-item-counter">
            <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
            <p className="cartitemsp">{cartItems[id]}</p>
            <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add more" />
          </div>
        )}
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p className="namewe t5">{name}</p>
          {/* <img className="ratingstars" src={assets.rating_starts} alt="" /> */}
        </div>
        <p className="food-item-desc t6">{descriptionToDisplay}</p>
        <p className="food-item-price t1">
          {price} <span>zł</span>
        </p>
      </div>
    </div>
  );
}

export default FoodItem;
