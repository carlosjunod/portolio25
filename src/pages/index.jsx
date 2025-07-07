import React, { useState, useEffect } from 'react';
import Head from 'next/head';
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
      <Head>
        <title>Carlos Junod | FrontEnd Developer</title>
        <meta name="description" content="The portfolio of Carlos Junod, a passionate FrontEnd Developer specializing in React, Next.js, and creating beautiful user experiences." />
        <meta name="keywords" content="Carlos Junod, Portfolio, FrontEnd Developer, React Developer, Next.js" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.carlosjunod.me/" />
        <meta property="og:title" content="Carlos Junod | FrontEnd Developer" />
        <meta property="og:description" content="The portfolio of Carlos Junod, a passionate FrontEnd Developer specializing in React, Next.js, and creating beautiful user experiences." />
        <meta property="og:image" content="https://www.carlosjunod.me/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.carlosjunod.me/" />
        <meta property="twitter:title" content="Carlos Junod | FrontEnd Developer" />
        <meta property="twitter:description" content="The portfolio of Carlos Junod, a passionate FrontEnd Developer specializing in React, Next.js, and creating beautiful user experiences." />
        <meta property="twitter:image" content="https://www.carlosjunod.me/og-image.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Carlos Junod",
              "url": "https://www.carlosjunod.me",
              "jobTitle": "FrontEnd Developer",
              "email": "hello@carlosjunod.me",
              "sameAs": [
                "https://www.linkedin.com/in/carlosjunod",
                "https://github.com/carlosjunod"
              ]
            })
          }}
        />
      </Head>
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
