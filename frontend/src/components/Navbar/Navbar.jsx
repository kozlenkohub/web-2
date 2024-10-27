import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next'; // Импорт для перевода
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState('home');
  const [isCartFixed, setIsCartFixed] = useState(false);
  const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
  const { t, i18n } = useTranslation(); // Подключаем i18n для смены языка
  const location = useLocation(); // Получаем текущий маршрут
  const navigate = useNavigate();

  // Функция для смены языка и сохранения его в localStorage
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang); // Сохраняем выбранный язык в localStorage
  };

  // При первом запуске считываем язык из localStorage
  useEffect(() => {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage) {
      i18n.changeLanguage(storedLanguage);
    }
  }, [i18n]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    navigate('/');
  };

  useEffect(() => {
    const toggle = document.getElementById('visual-toggle');

    // Function to apply the stored mode preference
    function applyModePreference() {
      const mode = localStorage.getItem('mode');
      if (mode === 'light') {
        toggle.checked = true;
        document.body.classList.add('lightcolors');
        document.getElementById('visual-toggle-button').classList.add('lightmode');
      } else {
        toggle.checked = false;
        document.body.classList.remove('lightcolors');
        document.getElementById('visual-toggle-button').classList.remove('lightmode');
      }
    }

    // Call the function to apply the mode preference on page load
    applyModePreference();

    toggle.addEventListener('change', function () {
      if (toggle.checked) {
        localStorage.setItem('mode', 'light');
        document.body.classList.add('lightcolors');
        document.getElementById('visual-toggle-button').classList.add('lightmode');
      } else {
        localStorage.setItem('mode', 'dark');
        document.body.classList.remove('lightcolors');
        document.getElementById('visual-toggle-button').classList.remove('lightmode');
      }
    });

    // Handle scroll to fix the cart at the bottom right corner only on the home page
    const handleScroll = () => {
      if (window.scrollY > 100 && location.pathname === '/') {
        setIsCartFixed(true);
      } else {
        setIsCartFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location.pathname]); // Следим за изменением маршрута

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>
      <ul className="navbar-menu">
        <Link
          to="/"
          onClick={() => setMenu('home')}
          className={menu === 'home' ? 'active t3' : 't3'}>
          {t('navbar.home')} {/* Перевод для "ГЛАВНАЯ" */}
        </Link>
        <a
          href="#explore-menu"
          onClick={() => setMenu('menu')}
          className={menu === 'menu' ? 'active t3' : 't3'}>
          {t('navbar.menu')} {/* Перевод для "МЕНЮ" */}
        </a>
        <a
          href="#app-download"
          onClick={() => setMenu('mobile-app')}
          className={menu === 'mobile-app' ? 'active t3' : 't3'}>
          {t('navbar.delivery')} {/* Перевод для "ДОСТАВКА" */}
        </a>
        <a
          href="#footer"
          onClick={() => setMenu('contact-us')}
          className={menu === 'contact-us' ? 'active t3' : 't3'}>
          {t('navbar.contact')} {/* Перевод для "КОНТАКТ" */}
        </a>
      </ul>

      <div className="navbar-right">
        {/* Language Selection Menu */}
        <div className="language-select">
          <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language}>
            <option value="en">English</option>
            <option value="pl">Polski</option>
            <option value="ru">Русский</option>
          </select>
        </div>

        <div className="navbar">
          <label htmlFor="visual-toggle" id="visual-toggle-button">
            {/* Ваш переключатель темы */}
            <input type="checkbox" className="visual-toggle" id="visual-toggle" />
          </label>
        </div>
        <div className={`navbar-search-icon ${isCartFixed ? 'fixed-cart' : ''}`}>
          <Link to="/cart">
            <img className="basketlogo" src={assets.basket_icon} alt="Cart" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? '' : 'dot'}></div>
        </div>
        {!token ? (
          <button className="signbutton t5" onClick={() => setShowLogin(true)}>
            {t('loginPopup.login')} {/* Перевод для "Вход" */}
          </button>
        ) : (
          <div className="navbar-profile">
            <img src={assets.profile_icon} className="white-filter" alt="Profile" />
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/myorders')}>
                <img src={assets.bag_icon} alt="Orders" />
                <p className="t4">{t('navbar.orders')}</p> {/* Перевод для "Orders" */}
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="Logout" />
                <p className="t4">{t('navbar.logout')}</p> {/* Перевод для "Logout" */}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
