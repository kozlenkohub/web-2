// Header.js
import React, { useEffect, useState } from 'react';
import './Header.css';
import { useTranslation } from 'react-i18next';

const Header = () => {
  const { i18n } = useTranslation();
  const [headerContent, setHeaderContent] = useState({
    new: { en: '', ru: '', pl: '' },
    description: { en: '', ru: '', pl: '' },
    button: { en: '', ru: '', pl: '' },
  });

  useEffect(() => {
    fetch('/api/header')
      .then((res) => res.json())
      .then((data) => setHeaderContent(data));
  }, []);

  // Получаем текущий язык
  const currentLang = i18n.language;

  return (
    <div className="header">
      <div className="header-contents">
        <h2 className="t1">{headerContent.new[currentLang]}</h2>
        <p className="t3">{headerContent.description[currentLang]}</p>
        <a href="#explore-menu">
          <button className="buttonwl t3">{headerContent.button[currentLang]}</button>
        </a>
      </div>
    </div>
  );
};

export default Header;
