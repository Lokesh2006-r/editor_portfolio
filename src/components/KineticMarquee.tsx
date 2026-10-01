import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Film, Disc, Flame } from 'lucide-react';

interface KineticMarqueeProps {
  speed?: number;
  direction?: 'left' | 'right';
  className?: string;
}

export const KineticMarquee: React.FC<KineticMarqueeProps> = ({
  speed = 28,
  direction = 'left',
  className = '',
}) => {
  const items = [
    { label: 'HIGH-RETENTION REELS', icon: Flame },
    { label: 'VERTICAL STORYTELLING (9:16)', icon: Film },
    { label: 'BEAT-SYNC CUTS & SPEED RAMPS', icon: Sparkles },
    { label: 'OLED COLOR GRADING', icon: Disc },
    { label: 'SUB-BASS FOLEY SOUND DESIGN', icon: Sparkles },
    { label: 'VIRAL HOOK EDITING', icon: Flame },
    { label: '4K 60FPS CINEMATIC FINISHING', icon: Film },
  ];

  return (
    <div
      className={`relative w-full overflow-hidden py-3 bg-black/25 backdrop-blur-md border-y border-white/[0.08] select-none ${className}`}
      aria-hidden="true"
    >
      {/* Edge gradient masks for smooth fade */}
      <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-28 bg-gradient-to-r from-black/40 to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-28 bg-gradient-to-l from-black/40 to-transparent z-10 pointer-events-none" />

      {/* Infinite Scrolling Track */}
      <motion.div
        className="flex whitespace-nowrap gap-8 items-center font-mono text-[11px] sm:text-xs uppercase tracking-widest text-zinc-400"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          repeatType: 'loop',
          duration: speed,
          ease: 'linear',
        }}
      >
        {/* Render twice for seamless loop */}
        {[...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <span key={idx} className="inline-flex items-center gap-2.5 shrink-0 group">
              <Icon className="w-3.5 h-3.5 text-violet-400/80 group-hover:text-violet-400 transition-colors" />
              <span className="group-hover:text-zinc-200 transition-colors">{item.label}</span>
              <span className="text-zinc-600">·</span>
            </span>
          );
        })}
      </motion.div>
    </div>
  );
};
