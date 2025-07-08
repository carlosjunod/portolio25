import React, { useState, useEffect } from 'react';
import styles from './ExperienceCarousel.module.css';
import ExperienceCard, { type Experience } from './ExperienceCard';

interface CarouselContainerProps {
  experiences: Experience[];
}

export default function CarouselContainer({ experiences }: CarouselContainerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [openCardId, setOpenCardId] = useState<string | null>(experiences[0]?.id ?? null);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const handleToggle = (id: string) => {
    if (isMobile) {
      setOpenCardId(openCardId === id ? null : id);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Work Experience</h2>
      <div className={styles.cardsContainer}>
        {experiences.map((experience) => (
          <ExperienceCard
            key={experience.id}
            {...experience}
            isOpen={!isMobile || openCardId === experience.id}
            onToggle={() => handleToggle(experience.id)}
          />
        ))}
      </div>
    </div>
  );
}
