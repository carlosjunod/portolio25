import React, { useState, useEffect } from 'react';
import { FullPageScroller } from '@carlosjunod/react-full-page-scroller';
import ParticleBackground from '../components/ParticleBackground';
import Hero from '../components/Hero';
import ExperienceCarousel from '../components/ExperienceCarousel';
import Contact from '../components/Contact';

function ClientOnlyFullPageScroller({ children }) {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!mounted) return;
    const update = () => setEnabled(window.innerWidth >= 1024);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [mounted]);
  if (!mounted) {
    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
          {children[0]}
        </div>
      </div>
    );
  }
  return <FullPageScroller enabled={enabled}>{children}</FullPageScroller>;
}

export default function Home() {
  return (
    <>
      <ParticleBackground />
      <ClientOnlyFullPageScroller>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
          }}
        >
          <Hero />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100vh',
            position: 'relative',
            zIndex: 1,
            pointerEvents: 'auto',
          }}
        >
          <ExperienceCarousel />
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '100vh',
            position: 'relative',
            zIndex: 1,
            pointerEvents: 'auto',
          }}
        >
          <Contact />
        </div>
      </ClientOnlyFullPageScroller>
    </>
  );
}
