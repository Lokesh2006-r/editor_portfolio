import React from 'react';
import { Play, Maximize, Film, Sparkles, Sliders, Volume2, CheckCircle2, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { SiteConfig } from '../types';
import { VideoPlayer } from '../components/VideoPlayer';

interface ShowreelProps {
  config: SiteConfig;
  onOpenLightbox: () => void;
  onExploreWork?: () => void;
}

export const Showreel: React.FC<ShowreelProps> = ({ config, onOpenLightbox, onExploreWork }) => {
  const editingStyles = [
    { title: 'Beat-Matched Speed Ramps', desc: 'Accelerating camera momentum into musical beat drops' },
    { title: 'Sub-Bass Foley Sound Design', desc: 'Custom risers, swooshes, footsteps, and spatial bass' },
    { title: 'Filmic 35mm Emulation', desc: 'Kodak 2383 tone curves, subtle halation, and organic grain' },
    { title: 'Day-to-Night Luma Blending', desc: 'Seamless time-dilation transitions across horizons' },
    { title: 'Kinetic Safe-Zone Typography', desc: 'Modern minimalist text motion tracking for mobile screens' },
  ];

  return (
    <section id="showreel" className="py-20 sm:py-28 bg-[#080604] relative border-t border-orange-950/20 overflow-hidden">
      {/* Cinematic red sweep background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[60%] h-[60%] rounded-full bg-orange-950/8 blur-[120px] animate-float-orb1" />
        <div className="absolute bottom-0 right-0 w-[50%] h-[50%] rounded-full bg-orange-600/6 blur-[100px] animate-float-orb2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-orange-900/5 blur-[80px]" />
      </div>
      {/* Subtle grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-orange-500 mb-3">
            <Film className="w-3.5 h-3.5" />
            <span>Featured Mobile Showreel</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white leading-tight">
            A few seconds. A whole story.
          </h2>
          <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            Engineered exclusively for vertical mobile viewports (9:16). A montage of high-retention travel edits,
            street fashion reels, and music sync cuts.
          </p>
        </motion.div>

        {/* Desktop Side-by-Side / Mobile Stacked Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Prominent Vertical 9:16 Video Player Container with tilt & entry motion */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 36 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="relative w-full max-w-[340px] sm:max-w-[380px] bg-[#100c06] rounded-2xl p-2.5 sm:p-3 border border-white/10 shadow-2xl shadow-black/80 ring-1 ring-white/5 transition-transform duration-500 hover:scale-[1.01]">
              {/* Phone Mockup Subtle Notch / Top Bar */}
              <div className="flex items-center justify-between px-3 py-1.5 mb-1.5 text-[10px] font-mono text-zinc-500">
                <span className="text-orange-500 font-semibold">9:16 REEL PREVIEW</span>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>4K 60FPS</span>
                </span>
              </div>

              {/* Vertical Player */}
              <div className="rounded-xl overflow-hidden bg-black shadow-inner">
                <VideoPlayer
                  videoUrl={config.showreelVideoUrl}
                  posterUrl={config.showreelCover}
                  title={config.showreelTitle}
                  aspectRatio="9:16"
                  onFullscreenToggle={onOpenLightbox}
                />
              </div>

              {/* Player Footer Bar */}
              <div className="mt-2 px-2 py-1 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>Duration: {config.showreelDuration}</span>
                <button
                  onClick={onOpenLightbox}
                  className="flex items-center gap-1 text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  <Maximize className="w-3.5 h-3.5" />
                  <span>Fullscreen</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Description & List of Editing Styles with staggered reveals */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-7"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-orange-500 block mb-1.5">
                Curated Vertical Montage
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                {config.showreelTitle}
              </h3>
              <p className="mt-3 text-sm text-zinc-300 leading-relaxed font-normal">
                {config.showreelSubtitle ||
                  'Designed to stop the thumb on Instagram, TikTok, and YouTube Shorts. Combining sub-second cadence with emotive cinematic color grading and spatial soundscapes.'}
              </p>
            </div>

            {/* List of Key Editing Styles */}
            <div className="space-y-3.5 pt-2 border-t border-white/[0.08]">
              <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-zinc-400">
                <Sliders className="w-3.5 h-3.5 text-orange-500" />
                <span>Featured Post-Production Techniques</span>
              </h4>

              <div className="space-y-2.5">
                {editingStyles.map((style, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.08 * idx }}
                    whileHover={{ x: 4 }}
                    className="p-3 rounded-xl bg-[#100c06] border border-white/[0.06] hover:border-orange-600/30 transition-all flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    <div>
                      <h5 className="text-xs font-semibold text-white">{style.title}</h5>
                      <p className="text-[11px] text-zinc-400 mt-0.5">{style.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTAs with hover scale */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenLightbox}
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black bg-orange-500 hover:bg-orange-400 rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Play className="w-3.5 h-3.5 fill-black" />
                <span>Play In Fullscreen Viewer</span>
              </motion.button>

              <motion.button
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (onExploreWork) {
                    onExploreWork();
                  } else {
                    document.getElementById('edits')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-5 py-3 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-center cursor-pointer active:scale-95"
              >
                <span>Browse All 8 Edits</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
