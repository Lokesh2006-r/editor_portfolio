import React, { useEffect, useRef, useState } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Share2,
  Check,
  CheckCircle2,
  Wrench,
  Sparkles,
  Layers,
  Smartphone
} from 'lucide-react';
import { Project } from '../types';
import { VideoPlayer } from './VideoPlayer';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
  hasNext: boolean;
  hasPrev: boolean;
  onDiscussProject: (project: Project) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  onClose,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  onDiscussProject,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (!project) return;

    closeBtnRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev) onPrev();
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [project, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!project) return null;

  const handleShare = () => {
    const url = window.location.href.split('#')[0] + `#edits`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    if (diff > 60 && hasPrev) {
      onPrev();
    } else if (diff < -60 && hasNext) {
      onNext();
    }
    setTouchStartX(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vertical video viewer: ${project.title}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="cinema-force-dark fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/95 backdrop-blur-2xl overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      {/* Main Container */}
      <div
        ref={modalRef}
        className="relative z-10 w-full max-w-5xl bg-[#0f0f14] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[96vh] flex flex-col"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-white/[0.08] bg-[#09090c]">
          {/* Navigation Controls: Prev / Next / Title */}
          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className={`p-1.5 rounded-lg border border-white/10 text-zinc-300 transition-colors ${
                hasPrev ? 'hover:bg-white/10 hover:text-white cursor-pointer active:scale-90' : 'opacity-25 cursor-not-allowed'
              }`}
              aria-label="Previous edit"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={onNext}
              disabled={!hasNext}
              className={`p-1.5 rounded-lg border border-white/10 text-zinc-300 transition-colors ${
                hasNext ? 'hover:bg-white/10 hover:text-white cursor-pointer active:scale-90' : 'opacity-25 cursor-not-allowed'
              }`}
              aria-label="Next edit"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-zinc-500 ml-1 hidden sm:inline">
              Swipe or arrow keys to navigate
            </span>
          </div>

          {/* Share & Close Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-amber-400 text-xs font-mono transition-colors cursor-pointer"
              title="Share edit link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 text-[11px]">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline text-[11px]">Share</span>
                </>
              )}
            </button>

            <button
              ref={closeBtnRef}
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer focus-visible:outline-amber-500"
              aria-label="Close vertical video viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Vertical 9:16 Player + Details */}
        <div className="overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            {/* Centerpiece 9:16 Vertical Video Frame */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="w-full max-w-[320px] sm:max-w-[360px] bg-black rounded-2xl overflow-hidden border border-white/15 shadow-2xl ring-1 ring-white/5">
                <VideoPlayer
                  videoUrl={project.videoUrl}
                  posterUrl={project.thumbnail}
                  title={project.title}
                  aspectRatio="9:16"
                  autoPlay={true}
                />
              </div>
            </div>

            {/* Edit Breakdown & Narrative Specs (Right Column) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Category, Duration, Year */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-zinc-400 flex-wrap">
                  <span className="text-amber-400 font-semibold">{project.categoryLabel}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{project.year}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-zinc-300">{project.duration}</span>
                  {project.client && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-zinc-400">{project.client}</span>
                    </>
                  )}
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                  {project.title}
                </h2>

                <p className="text-sm text-zinc-300 leading-relaxed">
                  {project.overview}
                </p>
              </div>

              {/* Role & Creative Approach */}
              <div className="space-y-3 pt-3 border-t border-white/[0.08]">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 block mb-1">
                    Editorial Role
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-200 font-medium">
                    {project.role}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">
                    Creative Approach & Pacing
                  </span>
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                    {project.creativeApproach}
                  </p>
                </div>
              </div>

              {/* Techniques & Tools */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/[0.08]">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">
                    Key Techniques
                  </span>
                  <ul className="space-y-1.5 text-xs text-zinc-300">
                    {project.editingTechniques.map((tech, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{tech}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 block mb-2">
                    Editing Tools
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-xs font-mono text-zinc-300">
                    {project.toolsUsed.map((tool, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Master Deliverables & CTA */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-1">
                    Deliverables
                  </span>
                  <div className="text-xs text-zinc-300 flex flex-wrap gap-2">
                    {project.deliverables.map((item, i) => (
                      <span key={i} className="flex items-center gap-1">
                        <span className="w-1 h-1 rounded-full bg-amber-400" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onDiscussProject(project);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300 rounded-lg shadow-sm whitespace-nowrap cursor-pointer active:scale-95 transition-all"
                >
                  <span>Enquire about similar edit</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
