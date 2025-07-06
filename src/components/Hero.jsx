import React, { useState, useEffect } from 'react';
import styles from './Hero.module.css';

const roles = [
  "FrontEnd Developer",
  "Full Stack Developer",
  "React Developer",
  "Next.js Specialist"
];

export default function Hero() {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prevRotation => prevRotation - 90);
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div
        className="hero-content"
        style={{
          userSelect: 'none',
          msUserSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <div className="gradient-text hero-title">&lt;CarlosJunod /&gt;</div>
        <div className={styles.cubeContainer}>
          <div className={styles.cube} style={{ transform: `rotateX(${rotation}deg)` }}>
            <div className={`${styles.face} ${styles.face1}`}>{roles[0]}</div>
            <div className={`${styles.face} ${styles.face2}`}>{roles[1]}</div>
            <div className={`${styles.face} ${styles.face3}`}>{roles[2]}</div>
            <div className={`${styles.face} ${styles.face4}`}>{roles[3]}</div>
          </div>
        </div>
      </div>
    </>
  );
}
