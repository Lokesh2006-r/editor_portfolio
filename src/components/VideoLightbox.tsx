import React, { useEffect, useRef } from 'react';
import { X, Film } from 'lucide-react';
import { VideoPlayer } from './VideoPlayer';

interface VideoLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl?: string;
  posterUrl: string;
  title: string;
  categoryLabel?: string;
  duration?: string;
  client?: string;
  description?: string;
  triggerElement?: HTMLElement | null;
  aspectRatio?: '9:16' | '16:9' | '4:3';
}

export const VideoLightbox: React.FC<VideoLightboxProps> = ({
  isOpen,
  onClose,
  videoUrl,
  posterUrl,
  title,
  categoryLabel,
  duration,
  client,
  description,
  triggerElement,
  aspectRatio = '9:16',
}) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Focus close button on open
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Lock body scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      // Return focus to triggering element
      if (triggerElement) {
        triggerElement.focus();
      }
    };
  }, [isOpen, onClose, triggerElement]);

  if (!isOpen) return null;

  const isVertical = aspectRatio === '9:16';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Vertical video player: ${title}`}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-200"
    >
      {/* Backdrop click to dismiss */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Lightbox Container: Sleek for vertical videos */}
      <div className={`relative z-10 w-full ${isVertical ? 'max-w-[380px] sm:max-w-[420px]' : 'max-w-4xl'} flex flex-col gap-3 my-auto`}>
        {/* Header Bar */}
        <div className="flex items-center justify-between text-white border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Film className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-display tracking-tight text-white line-clamp-1">
                {title}
              </h3>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
                {categoryLabel && <span>{categoryLabel}</span>}
                {duration && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{duration}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer focus-visible:outline-amber-500 active:scale-90"
            aria-label="Close video player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Player Frame */}
        <div className="w-full bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
          <VideoPlayer
            videoUrl={videoUrl}
            posterUrl={posterUrl}
            title={title}
            aspectRatio={aspectRatio}
            autoPlay={true}
          />
        </div>

        {/* Description / Caption */}
        {description && (
          <div className="text-center px-2 text-[11px] sm:text-xs text-zinc-400 leading-normal line-clamp-2">
            {description}
          </div>
        )}
      </div>
    </div>
  );
};
