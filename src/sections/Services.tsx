import React from 'react';
import { Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Service } from '../types';
import { storage } from '../lib/storage';
import { ServiceCard } from '../components/ServiceCard';

interface ServicesProps {
  services?: Service[];
  onSelectService: (serviceTitle: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ services: propServices, onSelectService }) => {
  const services = propServices && propServices.length > 0 ? propServices : storage.getServices();

  return (
    <section id="services" className="py-20 sm:py-28 bg-[#080808] relative border-t border-b border-white/[0.06] overflow-hidden">
      {/* Subtle ambient light glow */}
      <div className="absolute top-1/2 right-1/4 w-80 h-80 rounded-full bg-red-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-12 sm:mb-16"
        >
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-red-500 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Short-Form Capabilities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white leading-tight">
            What I edit.
          </h2>
          <p className="mt-3 text-xs sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            Tailored post-production for vertical mobile formats. From thumb-stopping Instagram Reels
            to cinematic travel montages, beat-sync cuts, and dynamic visual storytelling.
          </p>
        </motion.div>

        {/* Dynamic Services Grid with staggered entry */}
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8"
        >
          {services.map((service, idx) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={idx}
              onSelectService={onSelectService}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};
