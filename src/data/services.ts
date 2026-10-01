import { Service } from '../types';

export const servicesList: Service[] = [
  {
    id: 'cinematic-reels',
    number: '01',
    title: 'Cinematic Reels',
    shortDesc: 'Story-driven short-form edits with intentional pacing, filmic color grading, and cinematic transitions.',
    features: [
      'Story-driven narrative arc in under 60s',
      'Filmic color grading & print film emulation',
      'Sub-frame music synchronization',
      'Dynamic, invisible match cuts & speed ramps'
    ],
    icon: 'Film'
  },
  {
    id: 'travel-lifestyle',
    number: '02',
    title: 'Travel & Lifestyle',
    shortDesc: 'Immersive visual journeys combining aesthetic transitions, atmospheric soundscapes, and day-to-night magic.',
    features: [
      'Aesthetic travel montages & location pacing',
      'Day-to-night and seamless sky transitions',
      'Multi-layer environmental Foley sound design',
      'Drone & mobile phone footage color harmonization'
    ],
    icon: 'Compass'
  },
  {
    id: 'instagram-social',
    number: '03',
    title: 'Instagram & Social Media',
    shortDesc: 'High-retention vertical edits engineered for viral reach, instant hooks, and platform-ready crisp exports.',
    features: [
      'Thumb-stopping 0-3 second visual hooks',
      'Precision beat synchronization on trending audio',
      'Dynamic, modern kinetic captions & overlays',
      'Zero-compression 9:16 vertical exports'
    ],
    icon: 'Smartphone'
  },
  {
    id: 'personal-creative',
    number: '04',
    title: 'Personal & Creative Edits',
    shortDesc: 'Bespoke, avant-garde editing styles tailored for music artists, creative directors, and custom visual statements.',
    features: [
      'Custom rhythmic editing styles & sound beds',
      'Music-driven video pacing & glitch textures',
      'Experimental transitions & masking techniques',
      'Personalized visual storytelling for brand authority'
    ],
    icon: 'Sparkles'
  }
];
