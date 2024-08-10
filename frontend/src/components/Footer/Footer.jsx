import React from 'react';
import './Footer.css';
import { assets } from '../../assets/assets';

const Footer = () => {
  return (
    <div className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img className="tomatologofooter" src={assets.logo} alt="" />
          <p>GastroFaza.. Wpadaj do nas ze znajomymi na pysznego burgerka i smaczne przekąski...</p>
          <div className="footer-social-icons">
            <a
              target="_blank"
              href="https://www.facebook.com/people/GastroFaza2024/61558257013251/">
              {' '}
              <img src={assets.facebook_icon} alt="" />
            </a>
            <a target="_blank" href="https://www.instagram.com/gastrofaza2024/">
              {' '}
              <img src={assets.inst_icon} alt="" />
            </a>
          </div>
        </div>
        {/* <div className="footer-content-center">
          <h2>FIRMA</h2>
          <ul>
            <li>Strona główna</li>
            <li>O nas</li>
            <li>Dostawa</li>
            <li>Polityka prywatności</li>
          </ul>
        </div> */}
        <div className="footer-content-right">
          <h2>SKONTAKTUJ SIĘ Z NAMI</h2>
          <ul>
            <li>+48-511-781-179</li>
            <li>gastrofaza2024@gmail.com</li>
          </ul>
        </div>
      </div>
      <hr />
      <p className="footer-copyright">Copyright 2024 © GastroFaza - Wszelkie prawa zastrzeżone.</p>
    </div>
  );
};

export default Footer;
