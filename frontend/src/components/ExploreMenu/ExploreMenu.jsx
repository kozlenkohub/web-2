import React from 'react';
import './ExploreMenu.css';
import { menu_list } from '../../assets/assets';
import { useTranslation } from 'react-i18next'; // Импортируем хук для перевода

const ExploreMenu = ({ category, setCategory }) => {
  const { t } = useTranslation(); // Подключаем хук для перевода

  return (
    <div className="explore-menu" id="explore-menu">
      <h1 className="h1e t2 logotext">{t('exploreMenu.title')}</h1> {/* Перевод заголовка */}
      <div className="working-hours">
        <p>{t('exploreMenu.workingHours')}</p> {/* Перевод для времени работы доставки */}
        <p>{t('exploreMenu.grillHours')}</p> {/* Перевод для времени работы гриля */}
      </div>
      <div className="block-text">
        <p className="explore-menu-text t6 substext">{t('exploreMenu.streetFood')}</p>{' '}
        {/* Перевод описания стритфуда */}
      </div>
      <div className="explore-menu-list">
        {menu_list.map((item, index) => {
          return (
            <div
              onClick={() =>
                setCategory((prev) => (prev === item.menu_name ? 'All' : item.menu_name))
              }
              key={index}
              className="explore-menu-list-item">
              <img
                className={category === item.menu_name ? 'active' : ''}
                src={item.menu_image}
                alt=""
              />
              <p className="item_menu t2 fz20">{item.menu_name}</p>
            </div>
          );
        })}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
