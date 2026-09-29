import React, { useRef } from 'react';
import { ArrowDown, ArrowUpRight, Play, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { SiteConfig } from '../types';

interface HeroProps {
  config: SiteConfig;
  onExploreWork: () => void;
  onContact: () => void;
  onWatchReel: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  config,
  onExploreWork,
  onContact,
  onWatchReel,
}) => {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Parallax background transform on scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1.02, 1.14]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="cinema-force-dark relative min-h-[92vh] sm:min-h-screen flex items-center justify-center pt-24 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Cinematic Background with Scroll Parallax & Scrim */}
      <motion.div
        style={{ y: backgroundY, scale: backgroundScale }}
        className="absolute inset-0 z-0 overflow-hidden will-change-transform"
      >
        <img
          src="/src/assets/images/hero_cinematic_director_1790323945101.jpg"
          alt="Cinematic mobile editing suite"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.12]"
        />
        {/* Gradients: top nav fade + deep bottom fade + radial dark vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080604]/85 via-[#080604]/40 to-[#080604]" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/50 to-black/90" />
        {/* EMBER NOIR glow — molten orange-amber sweep, #080604 → #B45309 → #F97316 */}
        <div className="absolute bottom-0 right-0 w-[65%] h-[60%] bg-gradient-to-tl from-orange-900/30 via-orange-950/12 to-transparent blur-[90px] rounded-full" />
        <div className="absolute top-0 left-0 w-[40%] h-[45%] bg-orange-950/12 blur-[80px] rounded-full" />
        <div className="absolute bottom-10 left-1/3 w-[30%] h-[30%] bg-amber-900/10 blur-[60px] rounded-full" />
      </motion.div>

      {/* Ambient drifting bokeh light (subtle organic movement) */}
      <motion.div
        animate={{
          x: [-20, 20, -20],
          y: [-15, 15, -15],
          opacity: [0.15, 0.28, 0.15],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full bg-orange-600/10 blur-3xl pointer-events-none z-0"
      />

      {/* Hero Content Container inside a Frosted White Fade Card */}
      <motion.div
        style={{ opacity: heroOpacity }}
        className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center bg-gradient-to-b from-white/[0.07] via-white/[0.04] to-white/[0.07] backdrop-blur-md border border-white/15 p-6 sm:p-10 md:p-12 rounded-3xl shadow-2xl shadow-black/80"
      >
        {/* Creator Label & Availability Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2 sm:gap-3 mb-5 flex-wrap justify-center"
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[11px] sm:text-xs font-mono tracking-widest uppercase text-orange-400 backdrop-blur-md font-semibold shadow-sm">
            <Sparkles className="w-3 h-3 text-orange-400" />
            <span>FREELANCE MOBILE VIDEO EDITOR</span>
          </span>
          <span aria-hidden="true" className="text-zinc-400 hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-mono text-zinc-200 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for select projects</span>
          </div>
        </motion.div>

        {/* Main Headline with stagger reveal */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white max-w-4xl leading-[1.08] mb-5 text-balance drop-shadow-md"
        >
          Your moments. My vision.{' '}
          <span className="block mt-1 sm:mt-2 text-gradient-ember drop-shadow-sm">
            One perfect edit.
          </span>
        </motion.h1>

        {/* Supporting Copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-sm sm:text-lg md:text-xl text-zinc-100 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-medium drop-shadow-sm"
        >
          Creating cinematic stories, one frame at a time. Specializing in high-retention Instagram Reels, aesthetic travel montages, beat-sync cuts, and dynamic short-form content.
        </motion.p>

        {/* Action CTAs with interactive hover movements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
        >
          {/* Primary CTA: Watch Showreel */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onWatchReel}
            className="w-full sm:w-auto px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-orange-500 via-orange-400 to-orange-600 hover:from-orange-400 hover:to-orange-500 transition-all rounded-xl shadow-xl shadow-orange-600/25 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full bg-black/20 flex items-center justify-center">
              <Play className="w-2.5 h-2.5 fill-black translate-x-0.5" />
            </div>
            <span>Watch My Showreel ({config.showreelDuration})</span>
          </motion.button>

          {/* Secondary CTA: Explore My Edits */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={onExploreWork}
            className="w-full sm:w-auto px-7 py-3.5 text-xs sm:text-sm font-semibold uppercase tracking-wider text-white bg-white/15 hover:bg-white/25 border border-white/20 rounded-xl transition-all flex items-center justify-center gap-2 backdrop-blur-md cursor-pointer shadow-md"
          >
            <span>Explore My Edits</span>
            <ArrowDown className="w-4 h-4 text-orange-500" />
          </motion.button>

          {/* Tertiary CTA: Contact */}
          <motion.button
            whileHover={{ x: 3 }}
            onClick={onContact}
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-3.5 text-xs font-semibold text-zinc-200 hover:text-orange-400 transition-colors cursor-pointer"
          >
            <span>Let's Collaborate</span>
            <ArrowUpRight className="w-4 h-4 text-orange-500" />
          </motion.button>
        </motion.div>

        {/* Mobile Editor Key Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 sm:mt-12 pt-6 sm:pt-8 border-t border-white/15 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 text-center w-full max-w-3xl"
        >
          <div className="p-2 sm:p-0">
            <span className="block text-xl sm:text-2xl md:text-3xl font-bold font-display text-white tabular-nums drop-shadow-sm">
              50M+
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-zinc-200 uppercase tracking-wider font-semibold">
              Organic Reel Views
            </span>
          </div>
          <div className="p-2 sm:p-0">
            <span className="block text-xl sm:text-2xl md:text-3xl font-bold font-display text-white tabular-nums drop-shadow-sm">
              150+
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-zinc-200 uppercase tracking-wider font-semibold">
              Vertical Cuts Delivered
            </span>
          </div>
          <div className="p-2 sm:p-0">
            <span className="block text-xl sm:text-2xl md:text-3xl font-bold font-display text-orange-400 tabular-nums drop-shadow-sm">
              9:16 Ultra HD
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-zinc-200 uppercase tracking-wider font-semibold">
              Mobile Safe Framing
            </span>
          </div>
          <div className="p-2 sm:p-0">
            <span className="block text-xl sm:text-2xl md:text-3xl font-bold font-display text-white drop-shadow-sm">
              CapCut / Resolve
            </span>
            <span className="text-[10px] sm:text-xs font-mono text-zinc-200 uppercase tracking-wider font-semibold">
              Fast Master Delivery
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Subtle Scroll Indicator with continuous gentle movement */}
      <motion.button
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        onClick={onExploreWork}
        className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-zinc-500 hover:text-white transition-colors cursor-pointer group"
        aria-label="Scroll to vertical edits gallery"
      >
        <span className="text-[9px] font-mono tracking-widest uppercase opacity-70">
          Scroll to Edits
        </span>
        <ArrowDown className="w-3.5 h-3.5 text-orange-500" />
      </motion.button>
    </section>
  );
};

