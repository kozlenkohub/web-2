import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2 className="t1">Nowość ‼️ Zestaw "GastroFaza"</h2>
        <p className="t6">
          Zestaw "GastroFaza" 🍔🍟🥤 to idealna opcja na szybkie i pyszne zaspokojenie głodu! W
          zestawie znajdziesz soczystego burgera, chrupiące frytki oraz orzeźwiający napój. "Zabij"
          swój głód w prosty i smaczny sposób! Zamów już teraz i poczuj pełnię smaku bez wychodzenia
          z domu!
        </p>

        <a href="#explore-menu">
          <button className="buttonwl t3">Wyświetl menu</button>
        </a>
      </div>
    </div>
  );
};

export default Header;
