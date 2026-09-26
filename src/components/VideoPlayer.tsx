import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl?: string;
  posterUrl: string;
  title: string;
  aspectRatio?: '16:9' | '9:16' | '4:3';
  autoPlay?: boolean;
  onFullscreenToggle?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  posterUrl,
  title,
  aspectRatio = '16:9',
  autoPlay = false,
  onFullscreenToggle,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {
        // Autoplay policy or error fallback
      });
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleFullscreen = () => {
    if (onFullscreenToggle) {
      onFullscreenToggle();
      return;
    }
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (autoPlay && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [autoPlay]);

  const aspectClass =
    aspectRatio === '9:16'
      ? 'aspect-[9/16] max-h-[80vh] mx-auto'
      : aspectRatio === '4:3'
      ? 'aspect-[4/3]'
      : 'aspect-[16/9]';

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
      className={`relative w-full ${aspectClass} bg-black rounded-lg overflow-hidden group border border-white/10 select-none`}
    >
      {/* Video Element */}
      {videoUrl && !hasError ? (
        <video
          ref={videoRef}
          src={videoUrl}
          poster={posterUrl}
          playsInline
          muted={isMuted}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onWaiting={() => setIsLoading(true)}
          onPlaying={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          onClick={togglePlay}
          className="w-full h-full object-cover cursor-pointer"
        />
      ) : (
        /* Fallback Poster Image if no stream or error */
        <div className="relative w-full h-full">
          <img
            src={posterUrl}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {hasError && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4">
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-black/80 px-3 py-2 rounded border border-amber-500/20">
                <AlertCircle className="w-4 h-4" />
                <span>Media stream unavailable · Displaying cinematic master frame</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Big Play Overlay (when paused) */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 bg-black/35 flex items-center justify-center cursor-pointer transition-opacity group-hover:bg-black/25"
        >
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl transition-all duration-300 group-hover:scale-105 group-hover:bg-amber-500 group-hover:text-black">
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
          </div>
        </div>
      )}

      {/* Bottom Control Bar */}
      <div
        className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Scrubber */}
        <div className="mb-2">
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            aria-label="Video timeline scrubber"
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400 focus:outline-none"
          />
        </div>

        {/* Action buttons & Time */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-1 hover:text-amber-400 transition-colors focus-visible:outline-amber-500"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            <button
              onClick={toggleMute}
              className="p-1 hover:text-amber-400 transition-colors focus-visible:outline-amber-500"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            <span className="font-mono tabular-nums text-zinc-400">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden sm:inline-block text-zinc-400 truncate max-w-[200px]">
              {title}
            </span>
            <button
              onClick={handleFullscreen}
              className="p-1 hover:text-amber-400 transition-colors focus-visible:outline-amber-500"
              aria-label="Toggle Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
