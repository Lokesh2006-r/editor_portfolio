import React, { useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { BACKGROUND_THEMES, BLUR_INTENSITY_MAP, SPEED_CLASS_MAP } from '../lib/backgroundThemes';
import { BackgroundThemeId, SiteConfig } from '../types';

interface AestheticBackgroundProps {
  config?: SiteConfig;
}

export const AestheticBackground: React.FC<AestheticBackgroundProps> = ({ config: propConfig }) => {
  const [config, setConfig] = useState<SiteConfig>(propConfig || storage.getConfig());
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });

  // Keep synced with prop and storage updates
  useEffect(() => {
    if (propConfig) {
      setConfig(propConfig);
    }
  }, [propConfig]);

  useEffect(() => {
    const handleConfigUpdate = () => {
      setConfig(storage.getConfig());
    };
    window.addEventListener('portfolio_config_updated', handleConfigUpdate);
    return () => {
      window.removeEventListener('portfolio_config_updated', handleConfigUpdate);
    };
  }, []);

  // Smooth mouse tracking for interactive cursor spotlight
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

  const activeThemeId: BackgroundThemeId = config.bgTheme || 'logicify-dark';
  const theme = BACKGROUND_THEMES[activeThemeId] || BACKGROUND_THEMES['logicify-dark'];

  const blurIntensity = config.bgBlurIntensity || 'high';
  const blurStyle = BLUR_INTENSITY_MAP[blurIntensity]?.filter || 'blur(130px)';

  const animSpeed = config.bgAnimationSpeed || 'normal';
  const speedClass = SPEED_CLASS_MAP[animSpeed] || '';

  const showParticles = config.bgShowParticles ?? true;
  const customWallpaper = config.bgCustomWallpaperUrl?.trim();

  /* LearnLogicify uses a characteristic extra small orb at the top-center */
  const isLogicifyTheme = activeThemeId === 'logicify-dark';

  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-1000"
      style={{ backgroundColor: theme.baseBg }}
    >
      {/* Optional Custom Background Wallpaper Image with Heavy Blur */}
      {customWallpaper && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img
            src={customWallpaper}
            alt="Custom Background Wallpaper"
            className="w-full h-full object-cover scale-110 opacity-30 filter blur-2xl transition-all duration-700"
          />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" />
        </div>
      )}

      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="absolute rounded-full opacity-60 transition-all duration-700 ease-out z-10 pointer-events-none"
        style={{
          left: `${mousePos.x}%`,
          top: `${mousePos.y}%`,
          width: '45vw',
          height: '45vw',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${theme.accentGlow} 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Liquid Animated Gradient Mesh */}
      <div
        className="absolute inset-0 z-[1] transition-all duration-700"
        style={{ filter: blurStyle }}
      >
        {/* Orb 1: Upper Left — primary purple anchor */}
        <div
          className={`absolute top-[-15%] left-[-10%] w-[65vw] sm:w-[50vw] h-[65vw] sm:h-[50vw] rounded-full animate-float-orb1 mix-blend-screen opacity-90 transition-all duration-1000 animate-blob-morph ${speedClass}`}
          style={{ background: theme.orbs.orb1 }}
        />

        {/* Orb 2: Lower Right — violet secondary */}
        <div
          className={`absolute bottom-[-18%] right-[-12%] w-[72vw] sm:w-[55vw] h-[72vw] sm:h-[55vw] rounded-full animate-float-orb2 mix-blend-screen opacity-82 transition-all duration-1000 ${speedClass}`}
          style={{ background: theme.orbs.orb2 }}
        />

        {/* Orb 3: Mid — indigo accent drift */}
        <div
          className={`absolute top-[35%] left-[25%] w-[50vw] sm:w-[38vw] h-[50vw] sm:h-[38vw] rounded-full animate-float-orb3 mix-blend-screen opacity-72 transition-all duration-1000 ${speedClass}`}
          style={{ background: theme.orbs.orb3 }}
        />

        {/* Orb 4: Center rotating aurora mesh */}
        <div
          className={`absolute top-[15%] right-[18%] w-[55vw] sm:w-[42vw] h-[55vw] sm:h-[42vw] rounded-full animate-rotate-mesh animate-pulse-breathe mix-blend-screen opacity-65 transition-all duration-1000 ${speedClass}`}
          style={{ background: theme.orbs.aurora }}
        />

        {/* Orb 5: LearnLogicify top-center signature glow (always visible) */}
        {isLogicifyTheme && (
          <div
            className={`absolute top-[-5%] left-[35%] w-[30vw] h-[30vw] rounded-full animate-float-orb1 mix-blend-screen opacity-55 transition-all duration-1000 ${speedClass}`}
            style={{
              background: 'radial-gradient(circle, rgba(245, 158, 11, 0.50) 0%, rgba(124, 58, 237, 0.30) 45%, transparent 72%)',
              animationDelay: '-8s',
            }}
          />
        )}
      </div>

      {/* LearnLogicify-style subtle grid line overlay */}
      {showParticles && (
        <>
          {/* Indigo dot matrix */}
          <div
            className="absolute inset-0 bg-dots-pattern opacity-[0.28] mix-blend-overlay z-20 pointer-events-none transition-opacity duration-500"
            style={{
              maskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)',
              WebkitMaskImage: 'radial-gradient(ellipse 90% 90% at 50% 50%, black 30%, transparent 100%)',
            }}
          />

          {/* Subtle grid lines */}
          <div
            className="absolute inset-0 bg-grid-pattern opacity-[0.22] z-20 pointer-events-none transition-opacity duration-500"
            style={{
              maskImage: 'radial-gradient(circle at 50% 45%, black 20%, transparent 75%)',
              WebkitMaskImage: 'radial-gradient(circle at 50% 45%, black 20%, transparent 75%)',
            }}
          />
        </>
      )}

      {/* Radial vignette — darkens edges so content pops */}
      <div className="absolute inset-0 z-25 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 120% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Bottom edge fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20 z-30 pointer-events-none" />
    </div>
  );
};
