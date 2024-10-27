import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useTranslation } from 'react-i18next'; // Импортируем хук для перевода

const LoginPopup = ({ setShowLogin }) => {
  const { t } = useTranslation(); // Подключаем i18n для перевода
  const { url, setToken } = useContext(StoreContext);

  const [currState, setCurrState] = useState('Login');
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === 'Login') {
      newUrl += '/api/user/login';
    } else {
      newUrl += '/api/user/register';
    }

    const response = await axios.post(newUrl, data);

    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem('token', response.data.token);
      setShowLogin(false);
    } else {
      alert(response.data.message);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState === 'Login' ? t('loginPopup.login') : t('loginPopup.signup')}</h2>{' '}
          {/* Перевод заголовка */}
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>
        <div className="login-popup-inputs">
          {currState === 'Login' ? null : (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder={t('loginPopup.namePlaceholder')}
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder={t('loginPopup.emailPlaceholder')}
            required
          />
          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder={t('loginPopup.passwordPlaceholder')}
            required
          />
        </div>
        <button type="submit">
          {currState === 'Sign Up' ? t('loginPopup.signupButton') : t('loginPopup.loginButton')}
        </button>
        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p className="continuee">{t('loginPopup.terms')}</p> {/* Перевод условий */}
        </div>
        {currState === 'Login' ? (
          <p>
            {t('loginPopup.createAccount')}{' '}
            <span onClick={() => setCurrState('Sign Up')}>{t('loginPopup.clickHere')}</span>
          </p>
        ) : (
          <p>
            {t('loginPopup.alreadyHaveAccount')}{' '}
            <span onClick={() => setCurrState('Login')}>{t('loginPopup.loginHere')}</span>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
