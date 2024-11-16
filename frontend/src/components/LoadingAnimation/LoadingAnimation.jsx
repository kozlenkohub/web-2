import React from 'react';
import './LoadingAnimation.css'; // Подключаем стили

const LoadingAnimation = () => {
  return (
    <div className="burger-loading">
      <div className="bun top"></div>
      <div className="lettuce"></div>
      <div className="cheese"></div>
      <div className="patty"></div>
      <div className="bun bottom"></div>
    </div>
  );
};

export default LoadingAnimation;
