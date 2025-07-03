import React, { useState, useEffect } from 'react';
import { FullPageScroller } from '@carlosjunod/react-full-page-scroller';
import ParticleBackground from '../components/ParticleBackground';
import Hero from '../components/Hero';
import CardDeck from '../components/CardFlipDeck';
import { experiences } from '../data/experiences';

function ClientOnlyFullPageScroller({ children }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) {
    return (
      <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0 }}>
          {children[0]}
        </div>
      </div>
    );
  }
  return <FullPageScroller>{children}</FullPageScroller>;
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
          }}
        >
          <CardDeck experiences={experiences} />
        </div>
      </ClientOnlyFullPageScroller>
    </>
  );
}