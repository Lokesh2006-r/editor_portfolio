import { Testimonial } from '../types';

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Julian Mercer',
    role: 'Creative Director',
    company: 'Vanguard Studios (Demo Placeholder)',
    projectType: 'Commercial Campaign',
    feedback: 'Sample review placeholder: The pacing and subtle sound design elevated raw camera dailies into an unforgettable brand film. Fast turnaround and immaculate timeline discipline.',
    isDemo: true
  },
  {
    id: 'test-2',
    clientName: 'Elena Rostova',
    role: 'Documentary Filmmaker',
    company: 'Horizon Expeditions (Demo Placeholder)',
    projectType: 'Travel Mini-Doc',
    feedback: 'Sample review placeholder: Exceptional ear for ambient texture and pacing. Took 40 hours of unorganized expedition footage and crafted a sharp, emotional 5-minute story arc.',
    isDemo: true
  },
  {
    id: 'test-3',
    clientName: 'Marcus & Sophia',
    role: 'Couples Film',
    company: 'Private Client (Demo Placeholder)',
    projectType: 'Tuscan Wedding Film',
    feedback: 'Sample review placeholder: We were brought to tears by how smoothly the vows were woven into the celebration footage. Not a single cliché cut.',
    isDemo: true
  }
];
