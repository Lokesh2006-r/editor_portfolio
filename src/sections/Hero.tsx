import React, { useRef } from 'react';
import { ArrowDown, ArrowUpRight, Play } from 'lucide-react';
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
  const contentRef   = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.12]);
  const textY   = useTransform(scrollYProgress, [0, 0.6], ['0%', '25%']);
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);



  const lines = (config.heroTagline ?? 'Every Frame,\nTells a Story.').split('\n');

  return (
    <section
      ref={containerRef}
      id="hero"
      className="cinema-force-dark relative min-h-screen flex items-end overflow-hidden bg-transparent"
      style={{ isolation: 'isolate' }}
    >
      {/* ── FULL-BLEED PHOTO (parallax, z-0) ── */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0 will-change-transform pointer-events-none opacity-85"
      >
        <img
          src={config.heroPhoto || '/src/assets/images/hero_cinematic_director_1790323945101.jpg'}
          alt={config.editorName}
          className="w-full h-full object-cover object-[70%_20%]"
        />

        {/* Left vignette — text legibility with translucent gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        {/* Top nav fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Ember glow behind subject — now purple */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-violet-900/10 to-indigo-800/20 pointer-events-none" />
        <div className="absolute bottom-0 right-[5%] w-[55%] h-[65%]
          bg-gradient-to-tl from-violet-700/20 via-indigo-900/10 to-transparent
          blur-[110px] rounded-full pointer-events-none" />
        <div className="absolute top-[10%] right-[20%] w-[30%] h-[40%]
          bg-violet-900/12 blur-[80px] rounded-full pointer-events-none" />
      </motion.div>

      {/* ── MAIN CONTENT LAYER (z-10) ── */}
      <motion.div
        ref={contentRef}
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-24 sm:pb-32"
      >
        {/* Super-label */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-8"
        >
          {config.availableForProjects && (
            <span className="flex items-center gap-2 px-3 py-1 rounded-full
              bg-violet-500/10 border border-violet-400/30
              text-[11px] font-mono tracking-widest uppercase text-violet-300 font-semibold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Available
            </span>
          )}
          <span className="text-[11px] font-mono tracking-widest uppercase text-violet-400/80 font-medium">
            {config.tagline}
          </span>
        </motion.div>

        {/* Main Headline — cinematic left-aligned display */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {lines.map((line, i) => (
            <h1
              key={i}
              className={`block font-display leading-[0.95] tracking-[-0.03em] text-white
                text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem]
                ${i === lines.length - 1 ? 'text-gradient-ember' : ''}`}
            >
              {line}
            </h1>
          ))}
        </motion.div>

        {/* Supporting copy + CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 max-w-md"
        >
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed mb-8 font-medium">
            {config.heroSubcopy ?? config.shortBio}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onExploreWork}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full
                bg-violet-600 hover:bg-violet-500 active:scale-95
                text-white text-sm font-bold uppercase tracking-wider
                shadow-lg shadow-violet-700/40 transition-all cursor-pointer
                focus-visible:outline-2 focus-visible:outline-violet-400"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              View Our Work
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onWatchReel}
              className="flex items-center gap-2 px-6 py-3 rounded-full
                bg-white/8 hover:bg-violet-900/30 border border-white/20 hover:border-violet-500/40 active:scale-95
                text-white text-sm font-semibold uppercase tracking-wider
                backdrop-blur-sm transition-all cursor-pointer
                focus-visible:outline-2 focus-visible:outline-violet-400/40"
            >
              Watch Showreel
              <ArrowUpRight className="w-3.5 h-3.5 text-violet-400" />
            </motion.button>

            <motion.button
              whileHover={{ x: 4 }}
              onClick={onContact}
              className="hidden sm:flex items-center gap-1.5 px-3 py-3
                text-xs font-mono text-zinc-400 hover:text-violet-400
                transition-colors cursor-pointer uppercase tracking-widest"
            >
              Let's Collaborate
              <ArrowUpRight className="w-3 h-3" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* ── LARGE WATERMARK BRAND NAME (z-5, pointer-events-none) ── */}
      <div className="absolute bottom-0 left-0 right-0 z-[5] overflow-hidden pointer-events-none select-none">
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(5rem,18vw,18rem)] font-display font-extrabold
            tracking-[-0.04em] leading-[0.82]
            text-transparent bg-clip-text
            bg-gradient-to-b from-white/8 via-white/4 to-transparent
            px-4 sm:px-8 lg:px-12 whitespace-nowrap"
        >
          {config.editorName}
        </motion.p>
      </div>

      {/* ── STATS STRIP — bottom-right, iOS Glass Capsule Widget ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="hidden md:flex absolute bottom-16 right-6 sm:right-10 z-20
          p-3.5 sm:p-4 rounded-3xl bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12]
          shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.2),0_16px_36px_rgba(0,0,0,0.5)]
          flex-col gap-2.5 items-end pointer-events-none select-none min-w-[140px]"
      >
        {[
          { num: '50M+', label: 'Reel Views' },
          { num: '150+', label: 'Edits Delivered' },
          { num: '9:16', label: 'Mobile Mastered' },
        ].map((s, idx) => (
          <div key={s.label} className={`text-right w-full ${idx > 0 ? 'pt-2 border-t border-white/[0.06]' : ''}`}>
            <span className="block text-base sm:text-lg font-display font-bold text-white leading-none">
              {s.num}
            </span>
            <span className="block text-[9px] font-mono uppercase tracking-widest text-zinc-400 mt-0.5">
              {s.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── SCROLL INDICATOR (z-20, clickable) ── */}
      <motion.button
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        onClick={onExploreWork}
        aria-label="Scroll to work"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20
          flex flex-col items-center gap-1 cursor-pointer group
          focus-visible:outline-none"
      >
        <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">
          Scroll
        </span>
        <ArrowDown className="w-3.5 h-3.5 text-violet-500" />
      </motion.button>
    </section>
  );
};
