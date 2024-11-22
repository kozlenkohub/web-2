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
              href="https://www.facebook.com/people/GastroFaza2024/61558257013251/"
              rel="noreferrer">
              <img src={assets.facebook_icon} alt="Facebook" />
            </a>
            <a target="_blank" href="https://www.instagram.com/gastrofaza2024/" rel="noreferrer">
              <img src={assets.inst_icon} alt="Instagram" />
            </a>
          </div>
        </div>
        <div className="footer-content-right">
          <h2>{t('footer.contactUs')}</h2> {/* Перевод для заголовка "Свяжитесь с нами" */}
          <ul>
            <li>{t('footer.phone')}</li>
            <li>{t('footer.email')}</li>
            <li>{t('footer.address')}</li>
          </ul>
        </div>
      </div>
      <div className="footer-alergeny">
        <h2>{t('footer.allergensTitle')}</h2> {/* Заголовок раздела об аллергенах */}
        <a
          href="https://amrestcdn.azureedge.net/ph-web-ordering/Pizza_Hut_PL/promotion/W6_2024/PHPL%20Allergens%20PH%20ALL%20W6%20Stuffed%20Crust_i%20prosciutto.xls"
          target="_blank"
          rel="noreferrer">
          {t('footer.allergensLink')}
        </a>
        <h2>{t('footer.nutritionTitle')}</h2> {/* Заголовок раздела о питательных веществах */}
        <a
          href="https://amrestcdn.azureedge.net/ph-web-ordering/Pizza_Hut_PL/promotion/W6_2024/PHPL%20Nutrition%20W6%20Stuffed%20Crust%20i%20prosciutto%20crudo.pdf"
          target="_blank"
          rel="noreferrer">
          {t('footer.nutritionLink')}
        </a>
      </div>
      <hr />
      <p className="footer-copyright">{t('footer.rights')}</p> {/* Перевод для "Авторские права" */}
    </div>
  );
};

export default Footer;
