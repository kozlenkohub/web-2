import React, { useState } from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Allergens from '../Allergens/Allergens';

const Footer = () => {
  const { t } = useTranslation();
  const [isAllergensOpen, setIsAllergensOpen] = useState(false);

  const openAllergensModal = () => setIsAllergensOpen(true);
  const closeAllergensModal = () => setIsAllergensOpen(false);

  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img className="tomatologofooter" src={assets.logo} alt="Logo" />
          <p>{t('footer.intro')}</p>
        </div>
        <div className="footer-content-center">
          <h2>{t('footer.allergensTitle')}</h2>
          <button className="custom-button" onClick={openAllergensModal}>
            {t('footer.allergensLink')}
          </button>
        </div>
        <div className="footer-content-right">
          <h2>{t('footer.contactUs')}</h2>
          <ul>
            <li>
              <a href={`tel:${t('footer.phone')}`}>{t('footer.phone')}</a>
            </li>
            <li>
              <a href={`mailto:${t('footer.email')}`}>{t('footer.email')}</a>
            </li>
            <li>
              <a
                href={`https://maps.google.com/?q=${t('footer.address')}`}
                target="_blank"
                rel="noreferrer">
                {t('footer.address')}
              </a>
            </li>
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
      <Allergens isOpen={isAllergensOpen} onClose={closeAllergensModal} />
    </footer>
  );
};

export default Footer;
