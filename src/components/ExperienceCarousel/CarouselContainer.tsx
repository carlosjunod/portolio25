import React from 'react';
import styles from './ExperienceCarousel.module.css';
import ExperienceCard, { Experience } from './ExperienceCard';

export interface CarouselContainerProps {
  experiences: Experience[];
}

const CarouselContainer: React.FC<CarouselContainerProps> = ({ experiences }) => (
  <section role="region" aria-label="Experiencia Profesional" className={styles.container}>
    <h2 className={styles.sectionTitle}>Work experience</h2>
    <div className={styles.cardsContainer}>
      {experiences.map((exp) => (
        <ExperienceCard key={exp.id} {...exp} />
      ))}
    </div>
  </section>
);

export default CarouselContainer;