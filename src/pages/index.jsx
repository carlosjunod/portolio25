import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { FullPageScroller } from '@carlosjunod/react-full-page-scroller';
import ParticleBackground from '../components/ParticleBackground';
import Hero from '../components/Hero';
import ExperienceCarousel from '../components/ExperienceCarousel';
import Contact from '../components/Contact';

// A simple wrapper for a page section
const Section = ({ children, isHero = false }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    minHeight: '100vh', // Use minHeight for mobile to allow content to expand
    position: 'relative',
    padding: '2rem 0', // Add some padding for mobile
    pointerEvents: isHero ? 'none' : 'auto',
  }}>
    {children}
  </div>
);

export default function Home() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Ensure window is defined (for SSR)
    if (typeof window !== 'undefined') {
      const update = () => setIsDesktop(window.innerWidth >= 1024);
      update(); // Set initial value
      window.addEventListener('resize', update);
      return () => window.removeEventListener('resize', update);
    }
  }, []);

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

      {isDesktop ? (
        <FullPageScroller>
          <Section isHero={true}><Hero /></Section>
          <Section><ExperienceCarousel /></Section>
          <Section><Contact /></Section>
        </FullPageScroller>
      ) : (
        <main>
          <Section isHero={true}><Hero /></Section>
          <Section><ExperienceCarousel /></Section>
          <Section><Contact /></Section>
        </main>
      )}
    </>
  );
}
