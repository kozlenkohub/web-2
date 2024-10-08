import React from 'react';
import './AppDownload.css';
import { assets } from '../../assets/assets';

const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <p className="pforbetter t3 logotext uppercase">
        System dostawy działa w trzech obszarach Maślice, Stabłowice i Kozanów <br />
        <span className="t1">Stabłowice i Maślice </span>
      </p>
      <div className="app-download-platforms">
        <img src={assets.local} alt="" />
      </div>
    </div>
  );
};

export default AppDownload;
