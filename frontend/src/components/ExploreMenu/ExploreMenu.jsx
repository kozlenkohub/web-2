import React, { useEffect, useState, useRef } from 'react';
import './ExploreMenu.css';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';

const ExploreMenu = ({ category, setCategory }) => {
  const { t } = useTranslation();
  const [menuList, setMenuList] = useState([]);
  const menuRef = useRef(null);

  useEffect(() => {
    fetch('https://web-2-backend-wbs4.onrender.com/api/menu') // URL вашего API
      .then((response) => response.json())
      .then((data) => setMenuList(data))
      .catch((error) => console.error('Error fetching menu:', error));
  }, []);

  useEffect(() => {
    // Анимация появления меню
    const ctx = gsap.context(() => {
      gsap.fromTo(
        menuRef.current.children,
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2, // Анимация элементов поочередно
          ease: 'power3.out',
        },
      );
    }, menuRef);

    return () => ctx.revert(); // Очистка анимаций при размонтировании
  }, [menuList]);

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
      <div className="explore-menu-list" ref={menuRef}>
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
