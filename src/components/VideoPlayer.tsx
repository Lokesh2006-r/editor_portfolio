import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, AlertCircle } from 'lucide-react';
import { parseVideoUrl } from '../lib/videoUtils';

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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const [showPoster, setShowPoster] = useState(true);

  // Blob URLs are session-only — they become invalid after a page refresh.
  // Detect this upfront so we never try to play a dead blob URL.
  const isStaleBlobUrl = useMemo(() => {
    if (!videoUrl) return false;
    return videoUrl.startsWith('blob:');
  }, [videoUrl]);

  const parsedVideo = useMemo(() => parseVideoUrl(isStaleBlobUrl ? undefined : videoUrl), [videoUrl, isStaleBlobUrl]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (parsedVideo.provider === 'direct') {
      if (!videoRef.current) return;
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        setShowPoster(false);
        videoRef.current.play().catch(() => {});
      }
    } else {
      setShowPoster(false);
      setIsPlaying(true);
      if (iframeRef.current && iframeRef.current.contentWindow) {
        if (parsedVideo.provider === 'youtube') {
           iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'playVideo' }), '*');
        } else if (parsedVideo.provider === 'vimeo') {
           iframeRef.current.contentWindow.postMessage(JSON.stringify({ method: 'play' }), '*');
        }
      }
    }
  };

  const toggleMute = () => {
    if (parsedVideo.provider === 'direct') {
      if (!videoRef.current) return;
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    } else {
      setIsMuted(!isMuted);
      if (iframeRef.current && iframeRef.current.contentWindow) {
        if (parsedVideo.provider === 'youtube') {
           iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: isMuted ? 'unMute' : 'mute' }), '*');
        } else if (parsedVideo.provider === 'vimeo') {
           iframeRef.current.contentWindow.postMessage(JSON.stringify({ method: 'setVolume', value: isMuted ? 1 : 0 }), '*');
        }
      }
    }
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
    if (parsedVideo.provider !== 'direct') return;
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
    if (autoPlay) {
      setShowPoster(false);
      if (parsedVideo.provider === 'direct' && videoRef.current) {
        videoRef.current.play().catch(() => {});
      } else {
        setIsPlaying(true);
      }
    }
  }, [autoPlay, parsedVideo.provider]);

  // If autoPlay changes to false, pause
  useEffect(() => {
    if (!autoPlay && isPlaying) {
      if (parsedVideo.provider === 'direct' && videoRef.current) {
        videoRef.current.pause();
      } else if (iframeRef.current && iframeRef.current.contentWindow) {
        if (parsedVideo.provider === 'youtube') {
           iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: 'pauseVideo' }), '*');
        } else if (parsedVideo.provider === 'vimeo') {
           iframeRef.current.contentWindow.postMessage(JSON.stringify({ method: 'pause' }), '*');
        }
      }
      setIsPlaying(false);
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
      {/* Fallback Poster Image */}
      {showPoster && (
        <div className="absolute inset-0 z-10 w-full h-full cursor-pointer" onClick={togglePlay}>
          <img
            src={posterUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover bg-[#121216]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center transition-opacity hover:bg-black/25">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-amber-500 hover:text-black">
              <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
            </div>
          </div>
        </div>
      )}

      {/* Video Element — only rendered for valid, non-blob URLs */}
      {videoUrl && !hasError && !isStaleBlobUrl ? (
        parsedVideo.provider === 'direct' ? (
          <video
            ref={videoRef}
            src={parsedVideo.embedUrl}
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
            className="w-full h-full object-cover cursor-pointer bg-black"
          />
        ) : (
          <iframe
            ref={iframeRef}
            src={`${parsedVideo.embedUrl}${parsedVideo.embedUrl.includes('?') ? '&' : '?'}autoplay=${autoPlay || isPlaying ? 1 : 0}&mute=${isMuted ? 1 : 0}`}
            allow="autoplay; fullscreen; encrypted-media"
            className="w-full h-full object-cover border-0"
            onLoad={() => setIsLoading(false)}
            onError={() => setHasError(true)}
          />
        )
      ) : (
        /* Clean poster fallback — shown for: no URL, blob URL, or stream error */
        <div className="relative w-full h-full">
          <img
            src={posterUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'}
            alt={title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover bg-[#121216]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop';
            }}
          />
          {/* Only show error badge for real stream failures (not blob or missing URL) */}
          {hasError && !isStaleBlobUrl && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-4">
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-black/80 px-3 py-2 rounded border border-amber-500/20">
                <AlertCircle className="w-4 h-4" />
                <span>Stream unavailable · Displaying thumbnail</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Loading Spinner */}
      {isLoading && !showPoster && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none z-10">
          <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Bottom Control Bar - Only for direct videos since iframes have their own */}
      {parsedVideo.provider === 'direct' && (
        <div
          className={`absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-20 ${
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
      )}
    </div>
  );
};

