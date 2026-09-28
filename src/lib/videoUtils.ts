export type VideoProvider = 'youtube' | 'vimeo' | 'direct' | 'instagram' | 'unknown';

export interface ParsedVideo {
  provider: VideoProvider;
  embedUrl: string;
  originalUrl: string;
  id?: string;
}

export function parseVideoUrl(url: string | undefined): ParsedVideo {
  if (!url) return { provider: 'unknown', embedUrl: '', originalUrl: '' };

  const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const ytShortsRegex = /youtube\.com\/shorts\/([^"&?\/\s]{11})/i;
  
  let match = url.match(ytRegex) || url.match(ytShortsRegex);
  if (match && match[1]) {
    return {
      provider: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${match[1]}?enablejsapi=1&rel=0&showinfo=0&modestbranding=1`,
      originalUrl: url,
      id: match[1],
    };
  }

  const vimeoRegex = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i;
  match = url.match(vimeoRegex);
  if (match && match[1]) {
    return {
      provider: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${match[1]}?api=1&title=0&byline=0&portrait=0`,
      originalUrl: url,
      id: match[1],
    };
  }

  const igRegex = /(?:instagram\.com|instagr\.am)\/(?:p|reel|tv)\/([^\/?#&]+)/i;
  match = url.match(igRegex);
  if (match && match[1]) {
    return {
      provider: 'instagram',
      embedUrl: `https://www.instagram.com/p/${match[1]}/embed/?autoplay=0`,
      originalUrl: url,
      id: match[1],
    };
  }

  // Assuming direct MP4 or other native streams
  if (url.endsWith('.mp4') || url.includes('.mp4?') || url.startsWith('/') || url.startsWith('blob:') || url.startsWith('data:video/')) {
    return {
      provider: 'direct',
      embedUrl: url,
      originalUrl: url,
    };
  }

  return {
    provider: 'unknown',
    embedUrl: url,
    originalUrl: url,
  };
}
