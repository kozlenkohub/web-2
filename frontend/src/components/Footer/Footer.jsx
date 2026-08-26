import React, { useState, useEffect, useContext } from "react";
import "./Footer.css";
import { assets } from "../../assets/assets";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Allergens from "../Allergens/Allergens";
import { StoreContext } from "../../context/StoreContext";

const Footer = () => {
  const { t, i18n } = useTranslation();
  const { url } = useContext(StoreContext);
  const [isAllergensOpen, setIsAllergensOpen] = useState(false);
  const [contact, setContact] = useState(null);

  useEffect(() => {
    let isMounted = true;
    fetch(`${url}/api/contact`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data && data.success && data.data) {
          setContact(data.data);
        }
      })
      .catch(() => {
        // Если API недоступен — остаются значения из локалей
      });
    return () => {
      isMounted = false;
    };
  }, [url]);

  const lang = i18n.language || "pl";
  const contactUsTitle =
    contact?.contactUs?.[lang] || contact?.contactUs?.pl || t("footer.contactUs");
  const phone = contact?.phone || t("footer.phone");
  const email = contact?.email || t("footer.email");
  const address = contact?.address || t("footer.address");
  const mapUrl =
    contact?.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  const openAllergensModal = () => setIsAllergensOpen(true);
  const closeAllergensModal = () => setIsAllergensOpen(false);

  return (
    <footer className="footer" id="footer">
      <div className="footer-content">
        <div className="footer-content-left">
          <img className="tomatologofooter" src={assets.logo} alt="Logo" />
          <p>{t("footer.intro")}</p>
        </div>
        <div className="footer-content-center">
          <h2>{t("footer.allergensTitle")}</h2>
          <button className="custom-button" onClick={openAllergensModal}>
            {t("footer.allergensLink")}
          </button>
        </div>
        <div className="footer-content-right">
          <h2>{contactUsTitle}</h2>
          <ul>
            <li>
              <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
            </li>
            <li>
              <a href={`mailto:${email}`}>{email}</a>
            </li>
            <li>
              <a href={mapUrl} target="_blank" rel="noreferrer">
                {address}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-social-icons">
        <a
          href="https://www.facebook.com/people/GastroFaza2024/61558257013251/"
          target="_blank"
          rel="noreferrer"
        >
          <img src={assets.facebook_icon} alt="Facebook" />
        </a>
        <a
          href="https://www.instagram.com/gastrofaza2024/"
          target="_blank"
          rel="noreferrer"
        >
          <img src={assets.inst_icon} alt="Instagram" />
        </a>
      </div>
      <hr />
      <p className="footer-copyright">{t("footer.rights")}</p>
      <Allergens isOpen={isAllergensOpen} onClose={closeAllergensModal} />
    </footer>
  );
};

export default Footer;
