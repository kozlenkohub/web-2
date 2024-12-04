import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next'; // Импорт для перевода
import { StoreContext } from '../../context/StoreContext';
import {
  FiShoppingCart,
  FiUser,
  FiLogOut,
  FiHome,
  FiMenu,
  FiPhone,
  FiShoppingBag,
} from 'react-icons/fi';

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState('home');
  const [isCartFixed, setIsCartFixed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State for menu toggle
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

  const handleMenuClick = (menuName) => {
    setMenu(menuName);
    setIsMenuOpen(false); // Close the menu when an item is selected
  };

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = 'auto'; // Enable scrolling when menu is closed
    } else {
      document.body.style.overflow = 'hidden'; // Disable scrolling when menu is open
    }
  }, [isMenuOpen]);

  return (
    <div className="navbar">
      <Link to="/">
        <img src={assets.logo} alt="Logo" className="logo" />
      </Link>
      <button
        className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <FiMenu size={24} />
      </button>
      <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`}>
        <Link
          to="/"
          onClick={() => handleMenuClick('home')}
          className={menu === 'home' ? 'active t3' : 't3'}>
          {t('navbar.home')}
        </Link>
        <a
          href="#explore-menu"
          onClick={() => handleMenuClick('menu')}
          className={menu === 'menu' ? 'active t3' : 't3'}>
          {t('navbar.menu')}
        </a>
        <a
          href="#app-download"
          onClick={() => handleMenuClick('mobile-app')}
          className={menu === 'mobile-app' ? 'active t3' : 't3'}>
          {t('navbar.delivery')}
        </a>
        <a
          href="#footer"
          onClick={() => handleMenuClick('contact-us')}
          className={menu === 'contact-us' ? 'active t3' : 't3'}>
          {t('navbar.contact')}
        </a>
        {/* Новый раздел с Google картами */}
        <a
          href="https://www.google.com/maps?cid=10122389382842258008"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleMenuClick('google-maps')}
          className={menu === 'google-maps' ? 'active t3' : 't3'}>
          {t('navbar.googleMaps')} {/* Перевод для "Мы на Гугл картах" */}
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
            <FiShoppingCart size={24} className="icon" />
          </Link>
          <div className={getTotalCartAmount() === 0 ? '' : 'dot'}></div>
        </div>
        {!token ? (
          <button className="signbutton t5" onClick={() => setShowLogin(true)}>
            {t('loginPopup.login')} {/* Перевод для "Вход" */}
          </button>
        ) : (
          <div className="navbar-profile">
            <FiUser size={24} className="white-filter icon" alt="Profile" /> {/* Иконка профиля */}
            <ul className="nav-profile-dropdown">
              <li onClick={() => navigate('/myorders')}>
                <FiShoppingBag size={20} className="icon" alt="Orders" />{' '}
                {/* Иконка для "Заказов" */}
                <p className="t4">{t('navbar.orders')}</p> {/* Перевод для "Orders" */}
              </li>
              <hr />
              <li onClick={logout}>
                <FiLogOut size={20} className="icon" alt="Logout" /> {/* Иконка для "Выхода" */}
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
