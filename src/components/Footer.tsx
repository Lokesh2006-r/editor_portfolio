import React from 'react';
import { ArrowUp, Instagram, Video, Youtube, Mail, MessageSquare } from 'lucide-react';
import { SiteConfig } from '../types';

interface FooterProps {
  config: SiteConfig;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ config, onNavigate, onOpenAdmin }) => {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'showreel', label: 'Showreel' },
    { id: 'edits', label: 'My Edits' },
    { id: 'services', label: 'Services' },
    { id: 'workflow', label: 'Workflow' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <footer className="bg-[#050507] border-t border-white/[0.08] text-zinc-400 pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-10 pb-10 border-b border-white/[0.06]">
          {/* Brand & Creator Bio */}
          <div className="md:col-span-5 space-y-3.5">
            <span className="text-xl font-bold tracking-tight text-white font-display uppercase block">
              {config.editorName}
            </span>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed">
              {config.tagline}. Specializing in cinematic mobile video editing, high-retention Instagram Reels, aesthetic travel montages, and beat-sync sound design.
            </p>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500 pt-1">
              <span>{config.location}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400">Available for select projects</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs font-mono">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="hover:text-orange-500 transition-colors cursor-pointer text-left"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Direct Inquiries & Social */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="text-xs font-mono uppercase tracking-widest text-zinc-300">
              Direct Booking & Social
            </h4>
            <div className="space-y-2">
              <a
                href={`mailto:${config.contactEmail}`}
                className="flex items-center gap-2 text-xs sm:text-sm text-zinc-200 hover:text-orange-500 transition-colors"
              >
                <Mail className="w-4 h-4 text-orange-500" />
                <span>{config.contactEmail}</span>
              </a>
              <p className="text-[11px] text-zinc-500 leading-normal">
                WhatsApp inquiries & direct booking form available for swift turnarounds.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2.5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                aria-label="YouTube Shorts"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="https://vimeo.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
                aria-label="Vimeo Portfolio"
              >
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-zinc-500">
          <div className="flex items-center gap-3 flex-wrap">
            <span>&copy; {currentYear} {config.editorName}. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span>Mobile-First Freelance Video Editor</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={onOpenAdmin}
              className="text-zinc-500 hover:text-orange-500 transition-colors underline cursor-pointer"
            >
              Admin Portal
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors group cursor-pointer"
            aria-label="Back to top"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-zinc-400 group-hover:text-orange-500 transition-colors" />
          </button>
        </div>
      </div>
    </footer>
  );
};
