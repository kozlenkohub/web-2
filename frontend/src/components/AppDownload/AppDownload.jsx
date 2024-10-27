import React from 'react';
import './AppDownload.css';
import { assets } from '../../assets/assets';
import { useTranslation } from 'react-i18next'; // Импортируем хук для перевода

const AppDownload = () => {
  const { t } = useTranslation(); // Подключаем хук для перевода

  return (
    <div className="app-download" id="app-download">
      <p className="pforbetter t3 logotext uppercase">
        {t('appDownload.systemWorks')} <br />
        <span className="t1">{t('appDownload.areas')}</span>
      </p>
      <div className="app-download-platforms">
        <img src={assets.local} alt="" />
      </div>
    </div>
  );
};

export default AppDownload;
