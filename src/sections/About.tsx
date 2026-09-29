import React from 'react';
import { User, ArrowUpRight, Cpu, Compass, Film, Instagram, Youtube, Video, Sparkles, Music } from 'lucide-react';
import { motion } from 'motion/react';
import { SiteConfig } from '../types';

interface AboutProps {
  config: SiteConfig;
  onContact: () => void;
}

export const About: React.FC<AboutProps> = ({ config, onContact }) => {
  const tools = [
    { name: 'CapCut Pro Desktop & Mobile', role: 'Speed-ramping, kinetic captions & mobile safe-zone alignment' },
    { name: 'DaVinci Resolve Studio 19', role: 'Filmic color grading, photochemical print emulation & master finishing' },
    { name: 'Adobe Premiere Pro', role: 'Multi-cam synchronization, sub-frame beat timing & sound design' },
    { name: 'Dehancer Pro & FilmConvert', role: 'Kodak 35mm grain, bloom, and halation emulation' },
    { name: 'Adobe After Effects', role: 'Mask tracking, rotoscoping & clean whip transitions' },
    { name: 'VN Video Editor & Logic Pro', role: 'Fast on-the-go proxy trims & spatial Foley audio beds' },
  ];

  const creativeInterests = [
    { label: 'Neo-Tokyo Aesthetics', desc: 'Neon reflections, wet street rain, and anamorphic flares' },
    { label: 'Sub-Bass Foley', desc: 'Syncing physical impact to 808 bass slides and natural textures' },
    { label: 'Temporal Transitions', desc: 'Day-to-night and speed ramps that feel like continuous camera momentum' },
    { label: 'Vertical Storytelling', desc: 'Composing cinematic stories within 9:16 mobile constraints' },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#050505] relative overflow-hidden">
      {/* Subtle ambient light glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-red-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Split Layout: Portrait on Left, Story on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Portrait & Creator Card with scroll reveal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-5"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-black border border-white/10 shadow-2xl group">
              <img
                src="/src/assets/images/hero_cinematic_director_1790323945101.jpg"
                alt={`${config.editorName} - Mobile Video Editor`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover filter contrast-[1.05] brightness-[0.88] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/75 backdrop-blur-md border border-white/10 text-xs">
                <div className="flex items-center justify-between text-zinc-200 font-mono">
                  <span className="font-bold">{config.editorName}</span>
                  <span className="text-red-500">Mobile Video Creator</span>
                </div>
                <div className="text-[11px] text-zinc-400 mt-1 flex items-center justify-between">
                  <span>{config.location}</span>
                  <span className="text-emerald-400">Remote Worldwide</span>
                </div>
              </div>
            </div>

            {/* Social Profile Links */}
            <div className="p-4 rounded-xl bg-[#0f0a0a] border border-white/[0.08] flex items-center justify-between">
              <span className="text-xs font-mono text-zinc-400">Find me on social:</span>
              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-red-500 transition-colors"
                  aria-label="Instagram Profile"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-red-500 transition-colors"
                  aria-label="YouTube Shorts"
                >
                  <Youtube className="w-4 h-4" />
                </a>
                <a
                  href="https://vimeo.com"
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-red-500 transition-colors"
                  aria-label="Vimeo Portfolio"
                >
                  <Video className="w-4 h-4" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Bio, Philosophy, Tools, Interests with scroll reveal */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 space-y-8"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-500 mb-2 sm:mb-3">
                <User className="w-3.5 h-3.5" />
                <span>Behind The Edits</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white leading-tight">
                A creator behind the cuts.
              </h2>

              <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed font-normal">
                {config.shortBio}
              </p>
            </div>

            {/* Philosophy & Approach */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-3 border-t border-white/[0.08]">
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-red-500">
                  <Film className="w-3.5 h-3.5" />
                  <span>Editing Philosophy</span>
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {config.aboutPhilosophy}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-red-500">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Mobile Pacing Approach</span>
                </h4>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                  {config.aboutApproach}
                </p>
              </div>
            </div>

            {/* Creative Interests */}
            <div className="space-y-3 pt-3 border-t border-white/[0.08]">
              <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
                <Sparkles className="w-3.5 h-3.5 text-red-500" />
                <span>Creative Passions & Visual Obsessions</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {creativeInterests.map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 rounded-lg bg-[#0f0a0a] border border-white/[0.06] hover:border-red-600/20 text-xs transition-colors"
                  >
                    <span className="font-semibold text-white block mb-0.5">{item.label}</span>
                    <span className="text-zinc-400 text-[11px] leading-relaxed">{item.desc}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Post-Production Editing Suite */}
            <div className="space-y-3 pt-3 border-t border-white/[0.08]">
              <h4 className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400">
                <Cpu className="w-3.5 h-3.5 text-red-500" />
                <span>Post-Production Suite & Mobile Workflow</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tools.map((t, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 rounded-lg bg-[#0f0a0a] border border-white/[0.06] hover:border-red-600/20 flex flex-col justify-between transition-colors"
                  >
                    <span className="text-xs font-semibold text-white">{t.name}</span>
                    <span className="text-[11px] text-zinc-400 mt-1">{t.role}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onContact}
                className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-black bg-red-500 hover:bg-red-400 rounded-lg transition-colors cursor-pointer active:scale-95"
              >
                <span>Let's Create Together</span>
                <ArrowUpRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
