import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <div className="header">
      <div className="header-contents">
        <h2 className="t1">Zamów swoje ulubione fajki wodne tutaj</h2>
        <p className="t6">
          Odwiedź nas i skorzystaj z naszej nowej oferty fajek wodnych! Wybierz z różnorodnego menu,
          które oferuje bogaty wybór smaków fajek wodnych, przygotowanych z najlepszych składników.
          Zaspokój swoje pragnienia i podnieś swoje doświadczenie, jedna aromatyczna sesja za razem.
        </p>

        <a href="#explore-menu">
          <button className="buttonwl t3">Wyświetl menu</button>
        </a>
      </div>
    </div>
  );
};

export default Header;
