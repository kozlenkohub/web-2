// Header.js
import React, { useContext, useEffect, useRef } from 'react';
import './Header.css';
import { StoreContext } from '../../context/StoreContext';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { gsap } from 'gsap';

const Header = () => {
  const { headerContent, isLoading } = useContext(StoreContext);
  const { i18n } = useTranslation();

  const currentLang = ['en', 'ru', 'pl'].includes(i18n.language) ? i18n.language : 'en';

  // Создаем ссылки для элементов, которые будут анимироваться
  const headerRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!isLoading) {
      const ctx = gsap.context(() => {
        // Анимация заголовка
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: -50 },
          { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
        );

        // Анимация описания
        gsap.fromTo(
          descriptionRef.current,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, delay: 0.5, ease: 'power3.out' },
        );

        // Анимация кнопки
        gsap.fromTo(
          buttonRef.current,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.8, delay: 1, ease: 'elastic.out(1, 0.5)' },
        );
      }, headerRef);

      return () => ctx.revert(); // Удаляем анимации при размонтировании
    }
  }, [isLoading]);

  return (
    <div
      ref={headerRef} // Привязываем общий контейнер для GSAP Context
      className="header"
      style={{
        backgroundImage: `url(${headerContent.backgroundUrl || ''})`,
      }}
      aria-label="Header Background">
      <picture>
        <source media="(max-width: 750px)" srcSet={headerContent.backgroundUrlSmall || ''} />
        <source media="(max-width: 1050px)" srcSet={headerContent.backgroundUrlMedium || ''} />
        <img
          src={headerContent.backgroundUrl || ''}
          alt="Header Background"
          className="header-img"
        />
      </picture>
      <div className="header-contents">
        {/* Заголовок */}
        <h2 ref={titleRef} className="t1">
          {isLoading ? (
            <Skeleton width={300} height={50} style={{ marginBottom: '10px' }} />
          ) : (
            headerContent.new?.[currentLang] || 'GastroFaza'
          )}
        </h2>

        {/* Описание */}
        <p ref={descriptionRef} className="t3">
          {isLoading ? (
            <Skeleton count={3} width={600} height={15} style={{ marginBottom: '10px' }} />
          ) : (
            headerContent.description?.[currentLang] ||
            'Welcome to GastroFaza, where flavor meets quality! We’re passionate about crafting the perfect burger, made with fresh, locally-sourced ingredients and served with a side of good vibes.'
          )}
        </p>

        {/* Кнопка */}
        <a href="#explore-menu">
          <button ref={buttonRef} className="buttonwl t3">
            {isLoading ? (
              <Skeleton width={150} height={40} />
            ) : (
              headerContent.button?.[currentLang] || 'Default Button'
            )}
          </button>
        </a>
      </div>
    </div>
  );
};

export default Header;
