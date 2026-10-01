import React from 'react';
import { GitBranch, UploadCloud, FileSliders, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';

export const Workflow: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Share your vision',
      shortTitle: 'Footage & Audio Brief',
      description: 'Send your raw phone/camera footage, tone references, preferred trending audio, and editing goals.',
      icon: UploadCloud,
    },
    {
      number: '02',
      title: 'Plan the edit',
      shortTitle: 'Pacing & Timeline',
      description: 'Confirm the hook strategy, mobile safe-zones, aspect ratios, sound cues, and agreed delivery deadline.',
      icon: FileSliders,
    },
    {
      number: '03',
      title: 'Edit & refine',
      shortTitle: 'Rhythm, Color & SFX',
      description: 'Build the story arc, synchronize speed-ramps to the beat, grade colors for OLED screens, and design Foley sound.',
      icon: Sparkles,
    },
    {
      number: '04',
      title: 'Final delivery',
      shortTitle: 'Review & Master 9:16',
      description: 'Review the private preview link, complete requested revisions, and receive high-bitrate platform-ready vertical masters.',
      icon: CheckCircle2,
    },
  ];

  return (
    <section id="workflow" className="py-20 sm:py-28 bg-transparent relative border-t border-white/[0.06] overflow-hidden">
      {/* Ambient glow mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-14 sm:mb-20"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-400 mb-3.5">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Process & Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white leading-tight">
            How your video comes to life.
          </h2>
          <p className="mt-3.5 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            A fast, frictionless four-stage process designed for creators and brands with fast turnaround demands.
          </p>
        </motion.div>

        {/* Timeline Roadmap Container */}
        <div className="relative">
          {/* =========================================================================
             ROADMAP ANIMATED LINE — DESKTOP (Horizontal Line connecting step cards)
             ========================================================================= */}
          <div className="hidden lg:block absolute top-[2.25rem] left-[10%] right-[10%] h-[2px] z-0 pointer-events-none">
            {/* Background track line */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/40 via-orange-950/60 to-zinc-800/40" />

            {/* Glowing animated path line */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 bg-gradient-to-r from-orange-600/40 via-orange-500 to-amber-400/60 shadow-[0_0_12px_rgba(249,115,22,0.8)] origin-left"
            />

            {/* Traveling Laser Pulse Node across roadmap */}
            <motion.div
              animate={{
                x: ['0%', '100%'],
                opacity: [0.2, 1, 0.2],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -top-[5px] left-0 w-3.5 h-3.5 rounded-full bg-orange-400 shadow-[0_0_16px_#f97316,0_0_30px_#f97316] z-10"
            >
              <div className="w-full h-full rounded-full bg-white animate-ping opacity-75" />
            </motion.div>
          </div>

          {/* =========================================================================
             ROADMAP ANIMATED LINE — MOBILE & TABLET (Vertical Line along left side)
             ========================================================================= */}
          <div className="lg:hidden absolute top-8 bottom-8 left-[2.25rem] w-[2px] z-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-orange-600/30 via-orange-500/70 to-amber-400/30 shadow-[0_0_10px_rgba(249,115,22,0.6)]" />

            {/* Vertical Traveling Laser Node */}
            <motion.div
              animate={{
                y: ['0%', '100%'],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="absolute -left-[5px] top-0 w-3.5 h-3.5 rounded-full bg-orange-400 shadow-[0_0_16px_#f97316] z-10"
            >
              <div className="w-full h-full rounded-full bg-white animate-ping opacity-75" />
            </motion.div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.55, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -7, scale: 1.015 }}
                  className="relative rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col justify-between group bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] hover:border-violet-400/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_16px_36px_-10px_rgba(0,0,0,0.6)] hover:shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.28),0_24px_48px_-12px_rgba(0,0,0,0.8),0_0_30px_rgba(249,115,22,0.2)] overflow-hidden"
                >
                  {/* Subtle hover gradient background glow */}
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-orange-600/20 via-amber-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none" />

                  <div>
                    {/* Top Row: Icon & Step Number */}
                    <div className="flex items-center justify-between mb-4 relative z-10">
                      <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-violet-400 group-hover:scale-110 group-hover:bg-violet-600/25 group-hover:border-violet-400/50 group-hover:text-violet-300 transition-all duration-300 shadow-md">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-violet-400 group-hover:text-orange-400 transition-colors duration-300">
                        {step.number}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-base sm:text-lg font-bold font-display tracking-tight text-white mb-1 group-hover:text-violet-300 transition-colors">
                      {step.title}
                    </h3>
                    <div className="text-[11px] font-mono text-zinc-400 mb-2.5">
                      {step.shortTitle}
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="mt-6 pt-3.5 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono text-zinc-500 group-hover:text-zinc-400 transition-colors">
                    <span>Phase {step.number}</span>
                    <span className="text-zinc-400 group-hover:text-orange-400 transition-colors">
                      Step {idx + 1} of 4
                    </span>
                  </div>

                  {/* Pulsing corner accent dot on card focus */}
                  <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-orange-500/0 group-hover:bg-orange-500 shadow-[0_0_8px_#f97316] transition-all duration-300" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

