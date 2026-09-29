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
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bgY     = useTransform(scrollYProgress, [0, 1], ['0%', '18%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.0, 1.12]);
  const textY   = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  const lines = (config.heroTagline ?? 'Every Frame,\nTells a Story.').split('\n');

  return (
    <section
      ref={containerRef}
      id="hero"
      className="cinema-force-dark relative min-h-screen flex items-end overflow-hidden bg-[#080604]"
    >
      {/* ── FULL-BLEED PHOTO (right-side portrait, parallax) ── */}
      <motion.div
        style={{ y: bgY, scale: bgScale }}
        className="absolute inset-0 z-0 will-change-transform"
      >
        <img
          src={config.heroPhoto || '/src/assets/images/hero_cinematic_director_1790323945101.jpg'}
          alt={config.editorName}
          className="w-full h-full object-cover object-[70%_20%]"
        />

        {/* ── LAYERED CINEMATIC SCRIMS ── */}
        {/* Left vignette — darkens left so text is legible */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080604] via-[#080604]/80 to-transparent" />
        {/* Bottom fade to brand name area */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080604] via-[#080604]/30 to-transparent" />
        {/* Top fade for nav area */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080604]/70 via-transparent to-transparent" />

        {/* ── EMBER GLOW — warm orange behind subject ── */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-orange-900/10 to-orange-800/20" />
        <div className="absolute bottom-0 right-[5%] w-[55%] h-[65%]
          bg-gradient-to-tl from-orange-700/20 via-amber-900/10 to-transparent
          blur-[110px] rounded-full" />
        <div className="absolute top-[10%] right-[20%] w-[30%] h-[40%]
          bg-orange-900/12 blur-[80px] rounded-full" />
      </motion.div>

      {/* ── CONTENT LAYER ── */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pb-28 sm:pb-36"
      >
        {/* ── SUPER-LABEL ── */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-8"
        >
          {config.availableForProjects && (
            <span className="flex items-center gap-2 px-3 py-1 rounded-full
              bg-emerald-500/10 border border-emerald-400/30
              text-[11px] font-mono tracking-widest uppercase text-emerald-300 font-semibold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
              </span>
              Available
            </span>
          )}
          <span className="text-[11px] font-mono tracking-widest uppercase text-orange-400/80 font-medium">
            {config.tagline}
          </span>
        </motion.div>

        {/* ── MAIN HEADLINE — cinematic serif style ── */}
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

        {/* ── SUPPORTING COPY + CTAs ── */}
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
            {/* Primary CTA */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onExploreWork}
              className="flex items-center gap-2.5 px-6 py-3 rounded-full
                bg-orange-500 hover:bg-orange-400
                text-black text-sm font-bold uppercase tracking-wider
                shadow-lg shadow-orange-600/30 transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              View Our Work
            </motion.button>

            {/* Secondary CTA */}
            <motion.button
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={onWatchReel}
              className="flex items-center gap-2 px-6 py-3 rounded-full
                bg-white/8 hover:bg-white/14 border border-white/20
                text-white text-sm font-semibold uppercase tracking-wider
                backdrop-blur-sm transition-all cursor-pointer"
            >
              Watch Showreel
              <ArrowUpRight className="w-3.5 h-3.5 text-orange-400" />
            </motion.button>

            {/* Ghost link */}
            <motion.button
              whileHover={{ x: 4 }}
              onClick={onContact}
              className="hidden sm:flex items-center gap-1.5 px-3 py-3
                text-xs font-mono text-zinc-400 hover:text-orange-400
                transition-colors cursor-pointer uppercase tracking-widest"
            >
              Let's Collaborate
              <ArrowUpRight className="w-3 h-3" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* ── LARGE WATERMARK BRAND NAME (bleeds from bottom, like Shadow®) ── */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-[-0.12em] left-0 right-0 z-20 overflow-hidden pointer-events-none select-none"
      >
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-[clamp(5rem,18vw,18rem)] font-display font-extrabold
            tracking-[-0.04em] leading-[0.85]
            text-transparent bg-clip-text
            bg-gradient-to-b from-white/10 via-white/5 to-transparent
            px-4 sm:px-8 lg:px-12 whitespace-nowrap"
        >
          {config.editorName}
        </motion.p>
      </motion.div>

      {/* ── STATS ROW — Groshev-style bottom data strip ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-6 right-6 sm:right-10 z-30
          flex flex-col gap-3 items-end"
      >
        {[
          { num: '50M+', label: 'Reel Views' },
          { num: '150+', label: 'Edits Delivered' },
          { num: '9:16', label: 'Mobile Mastered' },
        ].map((s) => (
          <div key={s.label} className="text-right">
            <span className="block text-lg sm:text-xl font-display font-bold text-white leading-none">
              {s.num}
            </span>
            <span className="block text-[9px] font-mono uppercase tracking-widest text-zinc-500">
              {s.label}
            </span>
          </div>
        ))}
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <motion.button
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
        onClick={onExploreWork}
        aria-label="Scroll to work"
        className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30
          flex flex-col items-center gap-1 cursor-pointer group"
      >
        <span className="text-[9px] font-mono tracking-widest uppercase text-zinc-500 group-hover:text-zinc-300 transition-colors">
          Scroll
        </span>
        <ArrowDown className="w-3.5 h-3.5 text-orange-500" />
      </motion.button>
    </section>
  );
};
