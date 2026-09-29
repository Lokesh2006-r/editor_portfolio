import React, { useEffect, useState } from 'react';
import { themeManager } from '../lib/theme';

export const AestheticBackground: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  useEffect(() => {
    themeManager.init();
  }, []);

  useEffect(() => {
    let animationFrameId: number;
    const handleMouseMove = (e: MouseEvent) => {
      animationFrameId = requestAnimationFrame(() => {
        const x = Math.round((e.clientX / window.innerWidth) * 100);
        const y = Math.round((e.clientY / window.innerHeight) * 100);
        setMousePos({ x, y });
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Night Theme Glowing Orbs & Ambient Mesh
  const orbStyles = {
    orb1: 'bg-gradient-to-r from-red-600/25 via-yellow-600/15 to-orange-600/20 shadow-[0_0_120px_rgba(245,158,11,0.35)]',
    orb2: 'bg-gradient-to-r from-zinc-800/40 via-amber-700/15 to-zinc-900/40 shadow-[0_0_140px_rgba(217,119,6,0.25)]',
    orb3: 'bg-gradient-to-r from-red-700/20 via-orange-500/20 to-yellow-500/15 shadow-[0_0_100px_rgba(245,158,11,0.2)]',
    accent: 'rgba(245, 158, 11, 0.12)',
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Base Canvas */}
      <div className="absolute inset-0 bg-[#050507] dark-canvas-theme" />

      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="absolute rounded-full blur-[140px] opacity-70 transition-all duration-300 ease-out"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          width: '55vw',
          height: '55vw',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${orbStyles.accent} 0%, transparent 70%)`,
        }}
      />

      {/* Floating Ambient Mesh Glow Orbs with CSS animations */}
      <div className="absolute inset-0 filter blur-[90px] sm:blur-[130px] opacity-80 transition-opacity duration-700">
        <div
          className={`absolute top-[-10%] left-[-5%] w-[60vw] sm:w-[45vw] h-[60vw] sm:h-[45vw] rounded-full animate-float-orb1 mix-blend-screen ${orbStyles.orb1}`}
        />
        <div
          className={`absolute bottom-[-10%] right-[-5%] w-[65vw] sm:w-[50vw] h-[65vw] sm:h-[50vw] rounded-full animate-float-orb2 mix-blend-screen ${orbStyles.orb2}`}
        />
        <div
          className={`absolute top-[35%] left-[25%] w-[45vw] sm:w-[35vw] h-[45vw] sm:h-[35vw] rounded-full animate-float-orb3 mix-blend-screen ${orbStyles.orb3}`}
        />
      </div>

      {/* Aesthetic Dot Grid & Line Matrix Pattern */}
      <div
        className="absolute inset-0 bg-dots-pattern opacity-[0.4] mix-blend-overlay"
        style={{
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
        }}
      />

      {/* Aesthetic Grid Lines Matrix */}
      <div
        className="absolute inset-0 bg-grid-pattern opacity-[0.18]"
        style={{
          maskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(circle at 50% 50%, black 30%, transparent 85%)',
        }}
      />

      {/* Ambient Vignette Gradient */}
      <div className="absolute inset-0 bg-radial-vignette opacity-80" />
    </div>
  );
};
