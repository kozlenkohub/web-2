import React, { useState, useEffect, useRef } from 'react';
import './Home.css';
import Header from '../../components/Header/Header';
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay';
import AppDownload from '../../components/AppDownload/AppDownload';
import { gsap } from 'gsap';

const Home = () => {
  const [category, setCategory] = useState('All');
  const homeRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Анимация появления всей страницы
    gsap.fromTo(
      homeRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
    );
  }, []);

  return (
    <div ref={homeRef}>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <AppDownload />
    </div>
  );
};

export default Home;
