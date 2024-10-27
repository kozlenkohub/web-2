import React from 'react';
import './Header.css';
import { useTranslation } from 'react-i18next'; // Импорт для перевода

const Header = () => {
  const { t } = useTranslation(); // Подключаем хук для перевода

  return (
    <div className="header">
      <div className="header-contents">
        <h2 className="t1">{t('header.new')}</h2> {/* Перевод для заголовка */}
        <p className="t3">
          {t('header.description')}
          {/* Перевод для описания */}
        </p>
        <a href="#explore-menu">
          <button className="buttonwl t3">{t('header.button')}</button> {/* Перевод для кнопки */}
        </a>
      </div>
    </div>
  );
};

export default Header;
