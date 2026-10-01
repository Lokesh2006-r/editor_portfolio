import React from 'react';
import { Play, ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  index?: number;
  onSelect: (project: Project, e: React.MouseEvent<HTMLElement>) => void;
  onPlayDirect: (project: Project, e: React.MouseEvent<HTMLElement>) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index = 0,
  onSelect,
  onPlayDirect,
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1], delay: (index % 8) * 0.04 } }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => onSelect(project, e)}
      className="group relative bg-white/[0.04] backdrop-blur-2xl border border-white/[0.14] hover:border-white/30 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.22),0_16px_36px_-10px_rgba(0,0,0,0.6)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.35),0_24px_48px_-12px_rgba(0,0,0,0.8)] flex flex-col focus-within:ring-2 focus-within:ring-violet-500"
    >
      {/* 9:16 Vertical Video Frame */}
      <div className="relative w-full aspect-[9/16] overflow-hidden bg-black">
        <img
          src={project.thumbnail}
          alt={project.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/40 opacity-90 group-hover:opacity-75 transition-opacity" />

        {/* Play Icon Centered with hover pulse */}
        <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayDirect(project, e);
            }}
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/20 hover:bg-violet-600 text-white hover:text-black backdrop-blur-xl border border-white/30 hover:border-orange-400 flex items-center justify-center shadow-xl transition-all cursor-pointer"
            aria-label={`Play vertical edit for ${project.title}`}
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current translate-x-0.5" />
          </motion.button>
        </div>

        {/* Duration badge at bottom right */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center gap-1 text-[10px] sm:text-xs font-mono tabular-nums text-zinc-200 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 shadow">
          <Clock className="w-3 h-3 text-violet-400" />
          <span>{project.duration}</span>
        </div>

        {/* Category top badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-violet-400 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-orange-600/20">
          {project.categoryLabel}
        </div>
      </div>

      {/* Info Section - Tailored for both 2-column mobile and desktop */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-gradient-to-b from-white/[0.02] via-black/25 to-black/50 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-zinc-400 mb-1">
            <span className="font-mono">{project.year}</span>
            {project.client && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-[100px] sm:max-w-[130px]">{project.client}</span>
              </>
            )}
          </div>

          <h3 className="text-sm sm:text-base font-bold font-display tracking-tight text-white group-hover:text-violet-400 transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="mt-1 text-[11px] sm:text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {project.overview}
          </p>
        </div>

        {/* View Edit CTA */}
        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] sm:text-xs">
          <span className="text-zinc-500 truncate text-[10px] sm:text-[11px]">{project.role}</span>
          <span className="text-violet-400 font-semibold group-hover:underline flex items-center gap-0.5 whitespace-nowrap">
            <span>View Edit</span>
            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};
