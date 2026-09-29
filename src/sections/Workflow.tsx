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
    <section id="workflow" className="py-20 sm:py-28 bg-[#080604] relative border-t border-white/[0.06] overflow-hidden">
      {/* Subtle ambient light glow */}
      <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-orange-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-orange-500 mb-3">
            <GitBranch className="w-3.5 h-3.5" />
            <span>Process & Timeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white leading-tight">
            How your video comes to life.
          </h2>
          <p className="mt-3 text-xs sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            A fast, frictionless four-stage process designed for creators and brands with fast turnaround demands.
          </p>
        </motion.div>

        {/* Timeline: Horizontal on Desktop, Vertical on Mobile */}
        <div className="relative">
          {/* Hairline connecting line on desktop with animated width reveal */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block absolute top-12 left-10 right-10 h-[1px] bg-gradient-to-r from-orange-600/20 via-orange-500/50 to-orange-600/20 z-0 origin-left"
          />

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.12,
                },
              },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative z-10"
          >
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 28 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                  }}
                  whileHover={{ y: -6 }}
                  className="bg-[#100c06] border border-white/[0.08] hover:border-orange-600/40 rounded-xl p-5 sm:p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/60 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Icon & Step Number */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-orange-500 group-hover:scale-105 group-hover:bg-orange-500/10 group-hover:border-orange-600/30 transition-all">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="font-mono text-xs font-bold text-orange-500">
                        {step.number}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h3 className="text-base sm:text-lg font-bold font-display tracking-tight text-white mb-1 group-hover:text-orange-400 transition-colors">
                      {step.title}
                    </h3>
                    <div className="text-[11px] font-mono text-zinc-500 mb-2.5">
                      {step.shortTitle}
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-zinc-500">
                    <span>Phase {step.number}</span>
                    <span className="text-zinc-400">Step {idx + 1} of 4</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
