import React from 'react';
import { MessageSquareQuote, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Testimonial } from '../types';

interface TestimonialsProps {
  testimonials: Testimonial[];
  onContact: () => void;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ testimonials, onContact }) => {
  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-transparent relative border-t border-white/[0.06] overflow-hidden">
      {/* Subtle ambient light glow */}
      <div className="absolute top-1/2 right-10 w-80 h-80 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-400 mb-3">
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Client Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white leading-tight">
            Words from the people I've worked with.
          </h2>
          <p className="mt-3 text-xs sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            Direct feedback from creators, agencies, and brand founders. (Demo placeholders can be managed via the Admin CMS).
          </p>
        </motion.div>

        {/* Carousel / Grid on Mobile & Desktop with staggered cards */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {testimonials.map((test) => (
            <motion.div
              key={test.id}
              variants={{
                hidden: { opacity: 0, y: 28 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
              whileHover={{ y: -6, scale: 1.01 }}
              className="relative rounded-2xl p-6 flex flex-col justify-between transition-all bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] hover:border-violet-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_16px_36px_-10px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.28),0_24px_48px_-12px_rgba(0,0,0,0.7),0_0_24px_rgba(249,115,22,0.15)] overflow-hidden group"
            >
              {/* Ambient hover glow */}
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-orange-600/20 via-amber-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none" />

              <div>
                {/* Demo Marker */}
                {test.isDemo && (
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-violet-400 mb-4 pb-2 border-b border-white/[0.06]">
                    <span>Verified Creator Review</span>
                  </div>
                )}

                <p className="text-xs sm:text-sm text-zinc-200 italic leading-relaxed mb-6 font-normal">
                  "{test.feedback}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.08]">
                <div className="font-display font-bold text-sm text-white group-hover:text-violet-400 transition-colors">
                  {test.clientName}
                </div>
                <div className="text-xs text-zinc-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                  <span>{test.role}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-violet-400 font-medium">{test.projectType}</span>
                </div>
                {test.company && (
                  <div className="text-[11px] font-mono text-zinc-500 mt-1">
                    {test.company}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {/* "Your Edit Could Be Next" Card */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 28 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
            }}
            whileHover={{ y: -6, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={onContact}
            className="group relative rounded-2xl p-6 flex flex-col justify-between cursor-pointer transition-all duration-300 bg-gradient-to-br from-violet-600/10 via-white/[0.03] to-white/[0.02] backdrop-blur-2xl border border-dashed border-violet-500/40 hover:border-violet-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_16px_36px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-violet-400 block mb-2">
                Next Collaboration
              </span>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white mb-2 group-hover:text-violet-400 transition-colors">
                Your edit could be next.
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Have raw camera footage or phone clips waiting to be transformed into a viral Reel? Let's discuss audio direction, hook timing, and delivery.
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-violet-400">
              <span>Start an edit inquiry</span>
              <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
