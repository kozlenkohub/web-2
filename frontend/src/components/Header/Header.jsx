import React, { useEffect, useState } from 'react';
import './Header.css';

const Header = () => {
  const [headerContent, setHeaderContent] = useState({ new: '', description: '', button: '' });

  useEffect(() => {
    fetch('/api/headerContent')
      .then((res) => res.json())
      .then((data) => setHeaderContent(data));
  }, []);

  return (
    <div className="header">
      <div className="header-contents">
        <h2 className="t1">{headerContent.new}</h2>
        <p className="t3">{headerContent.description}</p>
        <a href="#explore-menu">
          <button className="buttonwl t3">{headerContent.button}</button>
        </a>
      </div>
    </div>
  );
};

export default Header;
