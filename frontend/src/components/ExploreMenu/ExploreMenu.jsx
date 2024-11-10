import React, { useEffect, useState } from 'react';
import './ExploreMenu.css';
import { useTranslation } from 'react-i18next';

const ExploreMenu = ({ category, setCategory }) => {
  const { t } = useTranslation();
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    fetch('https://web-2-backend-wbs4.onrender.com/api/menu') // URL вашего API
      .then((response) => response.json())
      .then((data) => setMenuList(data))
      .catch((error) => console.error('Error fetching menu:', error));
  }, []);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1 className="h1e t2 logotext">{t('exploreMenu.title')}</h1>
      <div className="working-hours">
        <p>{t('exploreMenu.workingHours')}</p>
        <p>{t('exploreMenu.grillHours')}</p>
      </div>
      <div className="block-text">
        <p className="explore-menu-text t6 substext">{t('exploreMenu.streetFood')}</p>
      </div>
      <div className="explore-menu-list">
        {menuList.map((item, index) => (
          <div
            onClick={() =>
              setCategory((prev) => (prev === item.menu_name ? 'All' : item.menu_name))
            }
            key={index}
            className="explore-menu-list-item">
            <img
              className={category === item.menu_name ? 'active' : ''}
              src={item.menu_image}
              alt={item.menu_name}
            />
            <p className="item_menu t2 fz20">{item.menu_name}</p>
          </div>
        ))}
      </div>
      <hr />
    </div>
  );
};

export default ExploreMenu;
