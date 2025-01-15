import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';
import { useTranslation } from 'react-i18next';

const FoodDisplay = ({ category }) => {
  const { t, i18n } = useTranslation();
  const { food_list } = useContext(StoreContext);

  // Определяем "Бургер месяца"
  const burgerOfTheMonth = food_list.find((item) => item.name === 'BURGER MIESIĄCA');

  // Формируем список еды, начиная с "Бургера месяца", если он есть
  const sortedFoodList = burgerOfTheMonth
    ? [burgerOfTheMonth, ...food_list.filter((item) => item.name !== 'BURGER MIESIĄCA')]
    : food_list;

  return (
    <div className="food-display" id="food-display">
      <h2 className="h2we t3">{t('foodDisplay.title')}</h2>
      <div className="food-display-list">
        {sortedFoodList.map((item, index) => {
          if (category === 'All' || category === item.category) {
            // Выбираем описание в зависимости от текущего языка
            let description;
            switch (i18n.language) {
              case 'ru':
                description = item.description_ru.replace(/б/g, 'Б'); // Заменяем "б" на "Б" в русском описании
                break;
              case 'en':
                description = item.description_en;
                break;
              case 'pl':
                description = item.description; // Описание на польском
                break;
              default:
                description = item.description; // Описание по умолчанию
                break;
            }

            return (
              <FoodItem
                key={index}
                id={item._id}
                name={item.name}
                description={description} // Используем динамическое описание
                price={item.price}
                image={item.image}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default FoodDisplay;
