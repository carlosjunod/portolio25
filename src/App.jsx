import React from 'react';
import ParticleBackground from './ParticleBackground.jsx';
import CardDeck from './CardFlipDeck.jsx';
import './CardFlipDeck.css';

const experiences = [
  {
    company: 'Company A',
    role: 'Frontend Developer',
    date: 'Jan 2020 - Dec 2021',
    bullets: ['Built UI components', 'Optimized performance'],
    techStack: ['React', 'Three.js']
  },
  {
    company: 'Company B',
    role: 'Senior Developer',
    date: 'Feb 2022 - Present',
    bullets: ['Led development team', 'Architected core systems'],
    techStack: ['Node.js', 'GraphQL']
  }
];

export default function App() {
  return (
    <>
      <ParticleBackground />
      <CardDeck experiences={experiences} />
    </>
  );
}
