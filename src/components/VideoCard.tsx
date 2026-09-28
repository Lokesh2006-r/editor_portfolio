import React, { useRef, useState, useEffect } from 'react';
import { Play, ArrowUpRight, Clock, Film } from 'lucide-react';
import { motion } from 'motion/react';
import { Project } from '../types';
import { VideoPlayer } from './VideoPlayer';

interface VideoCardProps {
  project: Project;
  index?: number;
  onSelect: (project: Project, e: React.MouseEvent<HTMLElement>) => void;
  onPlayDirect: (project: Project, e: React.MouseEvent<HTMLElement>) => void;
  autoplayOnScroll?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  project,
  index = 0,
  onSelect,
  onPlayDirect,
  autoplayOnScroll = false,
}) => {
  const cardRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [shouldLoadPlayer, setShouldLoadPlayer] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setShouldLoadPlayer(true);
        } else {
          setIsInView(false);
        }
      },
      {
        rootMargin: '200px 0px', // preload when 200px near viewport
        threshold: 0.5, // 50% visible for autoplay
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const isVertical = project.aspectRatio === '9:16';
  const aspectClass = isVertical ? 'aspect-[9/16]' : (project.aspectRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-[16/9]');

  return (
    <motion.article
      ref={cardRef}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
      }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      onClick={(e) => onSelect(project, e)}
      className="group relative bg-[#121216] border border-white/[0.08] hover:border-amber-500/40 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-black/80 flex flex-col focus-within:ring-2 focus-within:ring-amber-500"
    >
      {/* Video Frame */}
      <div className={`relative w-full ${aspectClass} overflow-hidden bg-black`}>
        {shouldLoadPlayer && project.videoUrl ? (
          <div className="absolute inset-0 z-0 transition-transform duration-500 ease-out group-hover:scale-105 pointer-events-none">
             <VideoPlayer 
                videoUrl={project.videoUrl} 
                posterUrl={project.thumbnail} 
                title={project.title} 
                aspectRatio={project.aspectRatio || '16:9'}
                autoPlay={autoplayOnScroll && isInView}
              />
          </div>
        ) : (
          <img
            src={project.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'}
            alt={project.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover bg-[#121216] transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
            }}
          />
        )}

        {/* Gradient Scrim - hide if playing to show video clearly, but we use pointer-events-none on player so it stays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121216] via-black/10 to-black/40 opacity-90 group-hover:opacity-60 transition-opacity z-10 pointer-events-none" />

        {/* Play Icon Centered with hover pulse */}
        <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
          <motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayDirect(project, e);
            }}
            className="w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-amber-400 text-black flex items-center justify-center shadow-xl transition-all cursor-pointer pointer-events-auto"
            aria-label={`Play edit for ${project.title}`}
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-black translate-x-0.5" />
          </motion.button>
        </div>

        {/* Duration badge at bottom right */}
        <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 flex items-center gap-1 text-[10px] sm:text-xs font-mono tabular-nums text-zinc-200 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 shadow z-20 pointer-events-none">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{project.duration}</span>
        </div>

        {/* Category top badge */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-amber-500/20 z-20 pointer-events-none">
          {project.categoryLabel}
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between relative z-20 bg-[#121216]">
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

          <h3 className="text-sm sm:text-base font-bold font-display tracking-tight text-white group-hover:text-amber-300 transition-colors line-clamp-1">
            {project.title}
          </h3>

          <p className="mt-1 text-[11px] sm:text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {project.overview}
          </p>
        </div>

        {/* View Edit CTA */}
        <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] sm:text-xs">
          <span className="text-zinc-500 truncate text-[10px] sm:text-[11px]">{project.role}</span>
          <span className="text-amber-400 font-semibold group-hover:underline flex items-center gap-0.5 whitespace-nowrap">
            <span>View Edit</span>
            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </motion.article>
  );
};
