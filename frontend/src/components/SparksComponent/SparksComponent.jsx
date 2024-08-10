import React, { useEffect } from 'react';
import { TweenLite, Linear, Back, Power1 } from 'gsap';
import './SparksComponent.css';

const SparksComponent = () => {
  useEffect(() => {
    const density = window.innerWidth > 768 ? 70 : 30; // Adjust density based on screen width
    const speed = 2;
    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth;
    const start = {
      yMin: 0,
      yMax: winHeight,
      xMin: 0,
      xMax: winWidth,
      scaleMin: 0.1,
      scaleMax: 0.25,
      scaleXMin: 0.1,
      scaleXMax: 1,
      scaleYMin: 1,
      scaleYMax: 2,
      opacityMin: 0.1,
      opacityMax: 0.4,
    };
    const mid = {
      yMin: winHeight * 0.4,
      yMax: winHeight * 0.9,
      xMin: winWidth * 0.1,
      xMax: winWidth * 0.9,
      scaleMin: 0.2,
      scaleMax: 0.8,
      opacityMin: 0.5,
      opacityMax: 1,
    };
    const end = {
      yMin: -180,
      yMax: -180,
      xMin: -100,
      xMax: winWidth + 180,
      scaleMin: 0.1,
      scaleMax: 1,
      opacityMin: 0.4,
      opacityMax: 0.7,
    };

    function range(map, prop) {
      const min = map[prop + 'Min'];
      const max = map[prop + 'Max'];
      return min + (max - min) * Math.random();
    }

    function randomEase(easeThis, easeThat) {
      return Math.random() < 0.5 ? easeThat : easeThis;
    }

    function spawn(particle) {
      const wholeDuration = (10 / speed) * (0.7 + Math.random() * 0.4);
      const delay = wholeDuration * Math.random();
      let partialDuration = (wholeDuration + 1) * (0.2 + Math.random() * 0.3);
      TweenLite.set(particle, {
        y: range(start, 'y'),
        x: range(start, 'x'),
        scaleX: range(start, 'scaleX'),
        scaleY: range(start, 'scaleY'),
        scale: range(start, 'scale'),
        opacity: range(start, 'opacity'),
        visibility: 'hidden',
      });
      TweenLite.to(particle, partialDuration, {
        delay: delay,
        y: range(mid, 'y'),
        ease: randomEase(Linear.easeOut, Back.easeInOut),
      });
      TweenLite.to(particle, wholeDuration - partialDuration, {
        delay: partialDuration + delay,
        y: range(end, 'y'),
        ease: Back.easeIn,
      });
      TweenLite.to(particle, partialDuration, {
        delay: delay,
        x: range(mid, 'x'),
        ease: Power1.easeOut,
      });
      TweenLite.to(particle, wholeDuration - partialDuration, {
        delay: partialDuration + delay,
        x: range(end, 'x'),
        ease: Power1.easeIn,
      });
      partialDuration = wholeDuration * (0.5 + Math.random() * 0.3);
      TweenLite.to(particle, partialDuration, {
        delay: delay,
        scale: range(mid, 'scale'),
        autoAlpha: range(mid, 'opacity'),
        ease: Linear.easeNone,
      });
      TweenLite.to(particle, wholeDuration - partialDuration, {
        delay: partialDuration + delay,
        scale: range(end, 'scale'),
        autoAlpha: range(end, 'opacity'),
        ease: Linear.easeNone,
        onComplete: spawn,
        onCompleteParams: [particle],
      });
    }

    function createParticle() {
      for (let i = 0; i < density; i += 1) {
        const particleSpark = document.createElement('div');
        particleSpark.classList.add('spark');
        document.getElementById('spark-container').appendChild(particleSpark);
        spawn(particleSpark);
      }
    }

    createParticle();

    return () => {
      document.querySelectorAll('.spark').forEach((spark) => spark.remove());
    };
  }, []);

  return <div id="spark-container" />;
};

export default SparksComponent;
