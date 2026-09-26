import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  });

  return (
    <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none h-1 bg-transparent">
      {/* Background track (subtle) */}
      <div className="absolute inset-0 bg-white/[0.04]" />
      
      {/* Dynamic Animated Progress Bar */}
      <motion.div
        className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 origin-left shadow-[0_0_12px_rgba(251,191,36,0.7)]"
        style={{ scaleX }}
      />
    </div>
  );
};
