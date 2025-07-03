import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import Timeline from './Timeline';

// Mapping tech names to FontAwesome brand icon classes (or null for custom placeholders)
const techIconClasses = {
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
  Tech: null // placeholder
};

export function FlipCard({ experience }) {
  const [flipped, setFlipped] = useState(false);
  const toggleFlip = () => setFlipped(prev => !prev);

  return (
    <div className="card-container" onClick={toggleFlip}>
      <motion.div
        className="card"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ zIndex: flipped ? 2 : 1 }}
      >
        <div className="face front">{experience.company}</div>
        <div className="face back">
          <h3>{experience.role}</h3>
          <p className="company-name">{experience.company}</p>
          <Timeline startDate={experience.startDate} endDate={experience.endDate} />
          <ul>
            {experience.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          <div className="tech-icons">
            {experience.techStack.map((tech, i) => {
              const cls = techIconClasses[tech];
              return cls ? (
                <i key={i} className={`${cls} tech-icon`} title={tech} role="img" aria-label={tech} />
              ) : (
                <span key={i} className="tech-placeholder">{tech}</span>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CardDeck({ experiences }) {
  const trackRef = useRef(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const track = trackRef.current;
    if (track) {
      const single = track.scrollWidth / 3;
      setTrackWidth(single);
      x.set(-single);
    }
  }, [experiences, x]);

  const handleDragEnd = () => {
    let current = x.get();
    if (current > -trackWidth / 2) current -= trackWidth;
    else if (current < -trackWidth * 1.5) current += trackWidth;
    x.set(current);
  };

  const handlePrev = () => {
    let next = x.get() + trackWidth;
    if (next > -trackWidth / 2) next -= trackWidth;
    x.set(next);
  };
  const handleNext = () => {
    let next = x.get() - trackWidth;
    if (next < -trackWidth * 1.5) next += trackWidth;
    x.set(next);
  };

  return (
    <motion.section className="experience-section" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }}>
      <h2 className="experience-title">Experience</h2>
      <div className="carousel-container">
        <button className="arrow arrow-left" onClick={handlePrev} aria-label="Previous"><i className="fas fa-chevron-left" /></button>
        <motion.div className="carousel-track" ref={trackRef} style={{ x }} drag="x" dragConstraints={false} onDragEnd={handleDragEnd} whileTap={{ cursor: 'grabbing' }}>
          {[...experiences, ...experiences, ...experiences].map((exp, idx) => (
            <div className="carousel-item" key={idx}><FlipCard experience={exp} /></div>
          ))}
        </motion.div>
        <button className="arrow arrow-right" onClick={handleNext} aria-label="Next"><i className="fas fa-chevron-right" /></button>
      </div>
    </motion.section>
  );
}