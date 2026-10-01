import React, { useRef, useState, useEffect } from 'react';
import { Play, ArrowUpRight, Clock, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { Project } from '../types';

interface VideoCardProps {
  project: Project;
  index?: number;
  layout?: 'compact' | 'standard';
  onSelect: (project: Project, e: React.MouseEvent<HTMLElement>) => void;
  onPlayDirect: (project: Project, e: React.MouseEvent<HTMLElement>) => void;
  autoplayOnScroll?: boolean;
}

export const VideoCard: React.FC<VideoCardProps> = ({
  project,
  index = 0,
  layout = 'compact',
  onSelect,
  onPlayDirect,
}) => {
  const cardRef = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // 3D Apple-style parallax tilt motion values
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 260, mass: 0.5 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(smoothMouseY, [0, 1], [6, -6]);
  const rotateY = useTransform(smoothMouseX, [0, 1], [-6, 6]);
  const glareX = useTransform(smoothMouseX, [0, 1], ['0%', '100%']);
  const glareY = useTransform(smoothMouseY, [0, 1], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const isVertical = project.aspectRatio === '9:16';
  
  // Calibrated iOS-proportional aspect ratios to keep cards compact & balanced
  const aspectClass = isVertical 
    ? (layout === 'compact' ? 'aspect-[9/13]' : 'aspect-[9/14]') 
    : (layout === 'compact' ? 'aspect-[16/10]' : 'aspect-video');

  const isDirectMp4 = project.videoUrl?.endsWith('.mp4') || (project.videoUrl?.includes('.mp4') ?? false);

  return (
    <motion.article
      ref={cardRef}
      layout
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
          delay: (index % 8) * 0.04,
        },
      }}
      style={{
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={(e) => onSelect(project, e)}
      className="group relative rounded-2xl cursor-pointer select-none transition-all duration-300 focus-within:ring-2 focus-within:ring-orange-500/70"
    >
      {/* iOS Ambient Blur Glow behind the card */}
      <div 
        className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-orange-600/25 via-amber-500/15 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 pointer-events-none"
        aria-hidden="true" 
      />

      {/* Main Glassmorphic Card Container */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white/[0.04] backdrop-blur-2xl border border-white/[0.14] group-hover:border-white/30 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.22),0_16px_36px_-10px_rgba(0,0,0,0.6)] group-hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.35),0_24px_48px_-12px_rgba(0,0,0,0.8)] flex flex-col transition-all duration-300">
        
        {/* iOS Dynamic Specular Light Glare following cursor */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-30 opacity-25 mix-blend-overlay transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle 180px at ${glareX} ${glareY}, rgba(255,255,255,0.6), transparent 75%)`,
            }}
          />
        )}

        {/* Diagonal Light Sheen Sweep on hover */}
        <div className="absolute inset-0 z-30 pointer-events-none overflow-hidden rounded-2xl">
          <div className="w-[200%] h-full -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-12" />
        </div>

        {/* Media Frame (Thumbnail / Hover Loop) */}
        <div className={`relative w-full ${aspectClass} overflow-hidden bg-black`}>
          {/* Direct MP4 hover preview (if available, muted, seamless loop) */}
          {isDirectMp4 && isHovered && project.videoUrl ? (
            <video
              src={project.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                videoLoaded ? 'opacity-100 scale-105' : 'opacity-0'
              }`}
            />
          ) : null}

          {/* High-fidelity Thumbnail with smooth Ken Burns zoom on hover */}
          <img
            src={project.thumbnail || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'}
            alt={project.title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
            }}
          />

          {/* Ambient Film Vignette Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 opacity-80 group-hover:opacity-55 transition-opacity duration-300 pointer-events-none z-10" />

          {/* Top Bar Badges - iOS Frosted Pills */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 pointer-events-none">
            {/* Category Pill with glowing dot */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wide text-zinc-200 bg-black/50 backdrop-blur-xl border border-white/15 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
              <span className="uppercase">{project.categoryLabel}</span>
            </div>

            {/* Duration Badge */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-mono tabular-nums text-zinc-200 bg-black/50 backdrop-blur-xl border border-white/15 shadow-sm">
              <Clock className="w-3 h-3 text-violet-400" />
              <span>{project.duration}</span>
            </div>
          </div>

          {/* Center iOS Frosted Glass Play Button */}
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.92 }}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlayDirect(project, e);
              }}
              className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-violet-600 text-white hover:text-black backdrop-blur-xl border border-white/30 hover:border-orange-400 flex items-center justify-center shadow-[0_8px_28px_rgba(0,0,0,0.5)] transition-all duration-300 cursor-pointer pointer-events-auto group-hover:shadow-[0_0_24px_rgba(249,115,22,0.6)]"
              aria-label={`Play edit for ${project.title}`}
            >
              <Play className="w-5 h-5 fill-current translate-x-0.5 transition-transform group-hover:scale-105" />
            </motion.button>
          </div>

          {/* Aspect format badge bottom-left */}
          {isVertical && (
            <div className="absolute bottom-2 left-2 z-20 pointer-events-none">
              <span className="px-1.5 py-0.5 text-[9px] font-mono uppercase tracking-wider text-violet-300/90 bg-orange-950/60 backdrop-blur-md rounded border border-violet-500/20">
                9:16 Reel
              </span>
            </div>
          )}
        </div>

        {/* iOS Frosted Glass Info Tray */}
        <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between relative z-20 bg-gradient-to-b from-white/[0.02] via-black/25 to-black/50 backdrop-blur-xl">
          <div>
            {/* Meta Row: Year & Client */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-zinc-400 mb-1">
              <span className="font-mono text-zinc-400">{project.year}</span>
              {project.client && (
                <>
                  <span className="text-zinc-600">·</span>
                  <span className="truncate max-w-[120px] text-zinc-400 font-medium">
                    {project.client.replace(' (Demo)', '')}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h3 className="text-xs sm:text-sm font-bold font-display tracking-tight text-white group-hover:text-violet-400 transition-colors line-clamp-1">
              {project.title}
            </h3>

            {/* Overview / Teaser */}
            <p className="mt-1 text-[11px] text-zinc-400/90 line-clamp-2 leading-relaxed">
              {project.overview}
            </p>
          </div>

          {/* Bottom Action Footer with iOS micro-capsule */}
          <div className="mt-2.5 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-zinc-500 truncate max-w-[120px] font-mono text-[9px] sm:text-[10px]">
              {project.role}
            </span>

            <span className="inline-flex items-center gap-1 font-semibold text-violet-400 group-hover:text-violet-300 transition-colors">
              <span>View</span>
              <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
};
