import React from 'react';
import { Film, Smartphone, Compass, Sparkles, Sliders, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Service } from '../types';

interface ServiceCardProps {
  service: Service;
  index?: number;
  onSelectService: (serviceTitle: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, index = 0, onSelectService }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Film':
        return <Film className="w-5 h-5 text-violet-400" />;
      case 'Smartphone':
        return <Smartphone className="w-5 h-5 text-violet-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-violet-400" />;
      case 'Sparkles':
      default:
        return <Sparkles className="w-5 h-5 text-violet-400" />;
    }
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="group relative rounded-2xl p-5 sm:p-7 flex flex-col justify-between bg-white/[0.04] backdrop-blur-2xl border border-white/[0.12] hover:border-violet-500/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18),0_16px_36px_-10px_rgba(0,0,0,0.5)] hover:shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.28),0_24px_48px_-12px_rgba(0,0,0,0.7),0_0_30px_rgba(249,115,22,0.15)] transition-all duration-300 overflow-hidden"
    >
      {/* iOS Ambient Blur Glow behind card on hover */}
      <div 
        className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-orange-600/20 via-amber-500/10 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none" 
        aria-hidden="true" 
      />

      <div>
        {/* Header with Editorial Numbering and Icon */}
        <div className="flex items-center justify-between mb-4 sm:mb-5">
          <span className="font-mono text-xs text-zinc-400 group-hover:text-violet-400 transition-colors">
            {service.number}
          </span>
          <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center group-hover:bg-violet-600/20 group-hover:border-violet-500/40 transition-all">
            {getIcon(service.icon)}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold font-display tracking-tight text-white mb-2 group-hover:text-violet-400 transition-colors">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-5">
          {service.shortDesc}
        </p>

        {/* Features bullet list */}
        <ul className="space-y-2 mb-6 border-t border-white/[0.06] pt-4">
          {service.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
              <span className="text-violet-400 mt-0.5">•</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action CTA */}
      <button
        type="button"
        onClick={() => onSelectService(service.title)}
        className="w-full pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-violet-400 hover:text-violet-400 transition-colors group/btn cursor-pointer"
      >
        <span>Enquire Now</span>
        <ArrowRight className="w-4 h-4 text-zinc-500 group-hover/btn:text-violet-400 group-hover/btn:translate-x-1.5 transition-all" />
      </button>
    </motion.div>
  );
};
