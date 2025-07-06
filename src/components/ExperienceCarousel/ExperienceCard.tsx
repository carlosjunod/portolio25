import React from 'react';
import styles from './ExperienceCarousel.module.css';
import CardHeader from './CardHeader';
import CardBody from './CardBody';

export interface Experience {
  id: string;
  companyLogo: string;
  alt: string;
  companyName: string;
  position: string;
  dateRange: string;
  responsibilities: string[];
  technologies: string[];
}

export interface ExperienceCardProps extends Experience {}

const ExperienceCard = React.forwardRef<HTMLDivElement, ExperienceCardProps>(
  ({ id, companyLogo, alt, companyName, position, dateRange, responsibilities, technologies }, ref) => {
    const techIconClasses: Record<string, string | null> = {
      React: 'fab fa-react',
      'React.js': 'fab fa-react',
      javascript: 'fab fa-js',
      JavaScript: 'fab fa-js',
      'Three.js': null,
      'Node.js': 'fab fa-node-js',
      HTML5: 'fab fa-html5',
      CSS3: 'fab fa-css3-alt',
      CSS: 'fab fa-css3-alt',
      'Spring Boot': 'fab fa-java',
      'Styled-components': 'fab fa-css3-alt',
      'Micro-frontends': null,
      WordPress: 'fab fa-wordpress',
      Ionic: 'fab fa-ionic',
      'UX Design': null,
      Storybook: 'fab fa-storybook',
      Tech: null,
    };
    return (
      <article role="group" className={styles.card} ref={ref as React.Ref<HTMLDivElement>}>
        <CardHeader
          companyLogo={companyLogo}
          alt={alt}
          companyName={companyName}
          position={position}
          dateRange={dateRange}
        />
        <CardBody responsibilities={responsibilities} />
        <div className={styles.techIcons}>
          {technologies.map((tech, idx) => {
            const cls = techIconClasses[tech];
            return cls ? (
              <i key={idx} className={`${cls} ${styles.techIcon}`} title={tech} aria-label={tech} />
            ) : (
              <span key={idx} className={styles.techPlaceholder}>{tech}</span>
            );
          })}
        </div>
      </article>
    );
  }
);

ExperienceCard.displayName = 'ExperienceCard';

export default ExperienceCard;