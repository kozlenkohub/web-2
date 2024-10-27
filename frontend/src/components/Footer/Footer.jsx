import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import { useTranslation } from 'react-i18next'; // Импорт для перевода

const Footer = () => {
  const { t } = useTranslation(); // Подключаем хук для перевода

  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img className="tomatologofooter" src={assets.logo} alt="" />
          <p>{t('footer.intro')}</p> {/* Перевод для описания */}
          <div className="footer-social-icons">
            <a
              target="_blank"
              href="https://www.facebook.com/people/GastroFaza2024/61558257013251/">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a target="_blank" href="https://www.instagram.com/gastrofaza2024/">
              <img src={assets.inst_icon} alt="Instagram" />
            </a>
          </div>
        </div>
        <div className="footer-content-right">
          <h2>{t('footer.contactUs')}</h2> {/* Перевод для заголовка "Свяжитесь с нами" */}
          <ul>
            <li>{t('footer.phone')}</li>
            <li>{t('footer.email')}</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">{t('footer.rights')}</p> {/* Перевод для "Авторские права" */}
    </div>
  );
};

export default Footer;
