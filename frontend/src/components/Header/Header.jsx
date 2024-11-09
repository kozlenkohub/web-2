import React, { useContext } from 'react';
import './Header.css';
import { StoreContext } from '../../context/StoreContext';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const Header = () => {
  const { headerContent, isLoading } = useContext(StoreContext);
  const { i18n } = useTranslation();

  const currentLang = ['en', 'ru', 'pl'].includes(i18n.language) ? i18n.language : 'en';

  return (
    <div
      className="header"
      style={{
        backgroundImage: `url(${headerContent.image || 'https://i.imgur.com/kaSyxLZ.jpeg'})`,
      }}>
      <div className="header-contents">
        {/* Заголовок */}
        <h2 className="t1">
          {isLoading ? (
            <Skeleton width={300} height={50} style={{ marginBottom: '10px' }} /> // Скелетон для заголовка
          ) : (
            headerContent.new?.[currentLang] || 'Default Title'
          )}
        </h2>

        {/* Описание */}
        <p className="t3">
          {isLoading ? (
            <Skeleton count={3} width={600} height={15} style={{ marginBottom: '10px' }} /> // Скелетон для описания
          ) : (
            headerContent.description?.[currentLang] || 'Default Description'
          )}
        </p>

        {/* Кнопка */}
        <a href="#explore-menu">
          <button className="buttonwl t3">
            {isLoading ? (
              <Skeleton width={150} height={40} /> // Скелетон для кнопки
            ) : (
              headerContent.button?.[currentLang] || 'Default Button'
            )}
          </button>
        </a>
      </div>
    </div>
  );
};

export default Header;
