import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img className="tomatologofooter" src={assets.logo} alt="Logo" />
          <p>{t('footer.intro')}</p>
        </div>
        <div className="footer-content-center">
          <h2>{t('footer.allergensTitle')}</h2>
          <a
            href="https://amrestcdn.azureedge.net/ph-web-ordering/Pizza_Hut_PL/promotion/W6_2024/PHPL%20Allergens%20PH%20ALL%20W6%20Stuffed%20Crust_i%20prosciutto.xls"
            target="_blank"
            rel="noreferrer">
            {t('footer.allergensLink')}
          </a>
          <h2>{t('footer.nutritionTitle')}</h2>
          <a
            href="https://amrestcdn.azureedge.net/ph-web-ordering/Pizza_Hut_PL/promotion/W6_2024/PHPL%20Nutrition%20W6%20Stuffed%20Crust%20i%20prosciutto%20crudo.pdf"
            target="_blank"
            rel="noreferrer">
            {t('footer.nutritionLink')}
          </a>
        </div>
        <div className="footer-content-right">
          <h2>{t('footer.contactUs')}</h2>
          <ul>
            <li>{t('footer.phone')}</li>
            <li>{t('footer.email')}</li>
            <li>{t('footer.address')}</li>
          </ul>
        </div>
      </div>
      <div className="footer-social-icons">
        <a
          href="https://www.facebook.com/people/GastroFaza2024/61558257013251/"
          target="_blank"
          rel="noreferrer">
          <img src={assets.facebook_icon} alt="Facebook" />
        </a>
        <a href="https://www.instagram.com/gastrofaza2024/" target="_blank" rel="noreferrer">
          <img src={assets.inst_icon} alt="Instagram" />
        </a>
      </div>
      <hr />
      <p className="footer-copyright">{t('footer.rights')}</p>
    </footer>
  );
};

export default Footer;
