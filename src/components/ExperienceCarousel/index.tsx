import CarouselContainer from './CarouselContainer';
import type { Experience } from './ExperienceCard';

import { experiences as realExperiences } from '../../data/experiences';

const sampleExperiences: Experience[] = realExperiences.map((exp, idx) => {
  const slug = exp.company.toLowerCase().replace(/[^\w]+/g, '-').replace(/(^-|-$)/g, '');
  const end = exp.endDate ?? 'Present';
  return {
    id: String(idx + 1),
    companyLogo: `/logos/${slug}.png`,
    alt: `Logo de ${exp.company}`,
    companyName: exp.company,
    position: exp.role,
    dateRange: `${exp.startDate} - ${end}`,
    responsibilities: exp.bullets,
    technologies: exp.techStack,
  };
});

export { CarouselContainer };
export default function ExperienceCarousel() {
  return <CarouselContainer experiences={sampleExperiences} />;
}