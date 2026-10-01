import { BackgroundThemeId } from '../types';

export interface ThemePreset {
  id: BackgroundThemeId;
  name: string;
  category: 'Cinematic' | 'Sci-Fi' | 'Liquid' | 'Minimalist';
  tagline: string;
  baseBg: string;
  accentGlow: string;
  previewColors: [string, string, string];
  orbs: {
    orb1: string; // CSS radial-gradient
    orb2: string;
    orb3: string;
    aurora: string; // Center liquid mesh
  };
}

export const BACKGROUND_THEMES: Record<BackgroundThemeId, ThemePreset> = {
  'ember-noir': {
    id: 'ember-noir',
    name: 'Ember Glow',
    category: 'Cinematic',
    tagline: 'Molten gold, amber warmth, and vibrant sunset ember glow.',
    baseBg: '#120c06',
    accentGlow: 'rgba(249, 115, 22, 0.35)',
    previewColors: ['#f97316', '#f59e0b', '#fbbf24'],
    orbs: {
      orb1: 'radial-gradient(circle, rgba(251, 146, 60, 0.75) 0%, rgba(234, 88, 12, 0.45) 45%, transparent 75%)',
      orb2: 'radial-gradient(circle, rgba(245, 158, 11, 0.68) 0%, rgba(217, 119, 6, 0.40) 50%, transparent 75%)',
      orb3: 'radial-gradient(circle, rgba(251, 191, 36, 0.60) 0%, rgba(245, 158, 11, 0.30) 60%, transparent 80%)',
      aurora: 'linear-gradient(135deg, rgba(249, 115, 22, 0.55), rgba(245, 158, 11, 0.45), rgba(251, 191, 36, 0.35))',
    },
  },
  'midnight-aurora': {
    id: 'midnight-aurora',
    name: 'Midnight Aurora',
    category: 'Sci-Fi',
    tagline: 'Vibrant Northern Lights with luminous emerald green, cyan, and ocean sapphire.',
    baseBg: '#06131c',
    accentGlow: 'rgba(6, 182, 212, 0.35)',
    previewColors: ['#10b981', '#06b6d4', '#3b82f6'],
    orbs: {
      orb1: 'radial-gradient(circle, rgba(16, 185, 129, 0.75) 0%, rgba(5, 150, 105, 0.45) 45%, transparent 75%)',
      orb2: 'radial-gradient(circle, rgba(6, 182, 212, 0.72) 0%, rgba(14, 116, 144, 0.45) 50%, transparent 75%)',
      orb3: 'radial-gradient(circle, rgba(59, 130, 246, 0.65) 0%, rgba(37, 99, 235, 0.35) 60%, transparent 80%)',
      aurora: 'linear-gradient(135deg, rgba(16, 185, 129, 0.50), rgba(6, 182, 212, 0.48), rgba(59, 130, 246, 0.38))',
    },
  },
  'cosmic-violet': {
    id: 'cosmic-violet',
    name: 'Cosmic Violet',
    category: 'Sci-Fi',
    tagline: 'Electric ultraviolet, neon fuchsia pink, and radiant deep space glow.',
    baseBg: '#10061e',
    accentGlow: 'rgba(217, 70, 239, 0.35)',
    previewColors: ['#a855f7', '#ec4899', '#6366f1'],
    orbs: {
      orb1: 'radial-gradient(circle, rgba(168, 85, 247, 0.75) 0%, rgba(126, 34, 206, 0.48) 45%, transparent 75%)',
      orb2: 'radial-gradient(circle, rgba(236, 72, 153, 0.70) 0%, rgba(190, 24, 93, 0.42) 50%, transparent 75%)',
      orb3: 'radial-gradient(circle, rgba(99, 102, 241, 0.65) 0%, rgba(79, 70, 229, 0.38) 60%, transparent 80%)',
      aurora: 'linear-gradient(135deg, rgba(168, 85, 247, 0.52), rgba(236, 72, 153, 0.46), rgba(99, 102, 241, 0.38))',
    },
  },
  'apple-liquid': {
    id: 'apple-liquid',
    name: 'Apple Liquid Glass',
    category: 'Liquid',
    tagline: 'Cupertino WWDC iridescent liquid wallpaper blending electric blue, magenta, and warm amber.',
    baseBg: '#0a0914',
    accentGlow: 'rgba(99, 102, 241, 0.38)',
    previewColors: ['#3b82f6', '#d946ef', '#f97316'],
    orbs: {
      orb1: 'radial-gradient(circle, rgba(59, 130, 246, 0.75) 0%, rgba(37, 99, 235, 0.48) 45%, transparent 75%)',
      orb2: 'radial-gradient(circle, rgba(217, 70, 239, 0.70) 0%, rgba(162, 28, 175, 0.45) 50%, transparent 75%)',
      orb3: 'radial-gradient(circle, rgba(249, 115, 22, 0.65) 0%, rgba(234, 88, 12, 0.40) 60%, transparent 80%)',
      aurora: 'linear-gradient(135deg, rgba(59, 130, 246, 0.50), rgba(217, 70, 239, 0.45), rgba(249, 115, 22, 0.40))',
    },
  },
  'solar-flare': {
    id: 'solar-flare',
    name: 'Solar Flare',
    category: 'Cinematic',
    tagline: 'Passionate crimson red, golden sun rays, and sunset warmth.',
    baseBg: '#140704',
    accentGlow: 'rgba(239, 68, 68, 0.35)',
    previewColors: ['#ef4444', '#f59e0b', '#fb923c'],
    orbs: {
      orb1: 'radial-gradient(circle, rgba(239, 68, 68, 0.72) 0%, rgba(185, 28, 28, 0.45) 45%, transparent 75%)',
      orb2: 'radial-gradient(circle, rgba(245, 158, 11, 0.70) 0%, rgba(217, 119, 6, 0.42) 50%, transparent 75%)',
      orb3: 'radial-gradient(circle, rgba(251, 146, 60, 0.65) 0%, rgba(234, 88, 12, 0.38) 60%, transparent 80%)',
      aurora: 'linear-gradient(135deg, rgba(239, 68, 68, 0.50), rgba(245, 158, 11, 0.45), rgba(251, 146, 60, 0.38))',
    },
  },
  'matrix-mono': {
    id: 'matrix-mono',
    name: 'Titanium Ice',
    category: 'Minimalist',
    tagline: 'Minimalist titanium silver, stealth slate, and cyan-ice glow.',
    baseBg: '#090d14',
    accentGlow: 'rgba(56, 189, 248, 0.30)',
    previewColors: ['#f8fafc', '#94a3b8', '#38bdf8'],
    orbs: {
      orb1: 'radial-gradient(circle, rgba(241, 245, 249, 0.55) 0%, rgba(148, 163, 184, 0.30) 45%, transparent 75%)',
      orb2: 'radial-gradient(circle, rgba(56, 189, 248, 0.62) 0%, rgba(14, 116, 144, 0.38) 50%, transparent 75%)',
      orb3: 'radial-gradient(circle, rgba(148, 163, 184, 0.55) 0%, rgba(100, 116, 139, 0.30) 60%, transparent 80%)',
      aurora: 'linear-gradient(135deg, rgba(241, 245, 249, 0.38), rgba(56, 189, 248, 0.38), rgba(100, 116, 139, 0.28))',
    },
  },
  'logicify-dark': {
    id: 'logicify-dark',
    name: 'Cinematic Black Blur',
    category: 'Cinematic',
    tagline: 'Pitch black cinematic foundation with soft floating ambient gold, violet & warm amber blur orbs.',
    baseBg: '#000000',
    accentGlow: 'rgba(245, 158, 11, 0.30)',
    previewColors: ['#000000', '#f59e0b', '#7c3aed'],
    orbs: {
      orb1: 'radial-gradient(circle, rgba(124, 58, 237, 0.50) 0%, rgba(79, 26, 214, 0.28) 45%, transparent 72%)',
      orb2: 'radial-gradient(circle, rgba(245, 158, 11, 0.42) 0%, rgba(217, 119, 6, 0.22) 50%, transparent 72%)',
      orb3: 'radial-gradient(circle, rgba(251, 191, 36, 0.32) 0%, rgba(168, 85, 247, 0.16) 55%, transparent 78%)',
      aurora: 'linear-gradient(135deg, rgba(124, 58, 237, 0.35), rgba(245, 158, 11, 0.28), rgba(99, 102, 241, 0.20))',
    },
  },
};


export const BLUR_INTENSITY_MAP: Record<string, { filter: string; label: string }> = {
  low: { filter: 'blur(50px)', label: 'Soft Blur (50px)' },
  medium: { filter: 'blur(80px)', label: 'Deep Blur (80px)' },
  high: { filter: 'blur(115px)', label: 'Heavy Blur (115px)' },
  ultra: { filter: 'blur(160px)', label: 'Ultra Silk Blur (160px)' },
};

export const SPEED_CLASS_MAP: Record<string, string> = {
  slow: 'anim-speed-slow',
  normal: '',
  fast: 'anim-speed-fast',
  static: 'anim-speed-static',
};
