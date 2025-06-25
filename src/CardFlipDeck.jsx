import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './CardFlipDeck.css';

export function FlipCard({ experience }) {
  const [flipped, setFlipped] = useState(false);
  const toggleFlip = () => setFlipped(prev => !prev);

  return (
    <div className="card-container" onClick={toggleFlip}>
      <motion.div
        className="card"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <div className="face front">
          {experience.company}
        </div>
        <div className="face back">
          <h3>{experience.role}</h3>
          <p><em>{experience.date}</em></p>
          <ul>
            {experience.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
          <p><strong>Tech:</strong> {experience.techStack.join(', ')}</p>
        </div>
      </motion.div>
    </div>
  );
}

export default function CardDeck({ experiences }) {
  return (
    <div className="deck">
      {experiences.map((exp, idx) => (
        <FlipCard key={idx} experience={exp} />
      ))}
    </div>
  );
}
