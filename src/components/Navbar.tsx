import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, ShieldCheck, Film, ChevronRight, Home as HomeIcon, Video, Sparkles, Layers, User, Mail } from 'lucide-react';
import { navFontManager, NAV_FONT_OPTIONS, NavFontKey, NavCasingKey } from '../lib/navFont';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  brandName: string;
  availableForProjects?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenAdmin,
  brandName,
  availableForProjects = true,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [navFont, setNavFont] = useState<NavFontKey>(navFontManager.getFont());
  const [navCasing, setNavCasing] = useState<NavCasingKey>(navFontManager.getCasing());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleFontChange = (e: any) => {
      if (e.detail?.font) setNavFont(e.detail.font);
    };
    const handleCasingChange = (e: any) => {
      if (e.detail?.casing) setNavCasing(e.detail.casing);
    };

    window.addEventListener('navbar_font_changed', handleFontChange);
    window.addEventListener('navbar_casing_changed', handleCasingChange);

    return () => {
      window.removeEventListener('navbar_font_changed', handleFontChange);
      window.removeEventListener('navbar_casing_changed', handleCasingChange);
    };
  }, []);

  const currentFontOpt = NAV_FONT_OPTIONS.find((f) => f.id === navFont) || NAV_FONT_OPTIONS[0];
  const navFontClass = currentFontOpt.cssClass;
  const navCasingClass = navCasing === 'uppercase' ? 'uppercase tracking-wider text-xs' : 'normal-case tracking-normal text-sm';

  const navLinks = [
    { id: 'hero', label: 'Home', icon: HomeIcon },
    { id: 'showreel', label: 'Showreel', icon: Video },
    { id: 'edits', label: 'My Edits', icon: Film },
    { id: 'services', label: 'Services', icon: Sparkles },
    { id: 'workflow', label: 'Workflow', icon: Layers },
    { id: 'about', label: 'About', icon: User },
    { id: 'contact', label: 'Contact', icon: Mail },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* =========================================================================
         DESKTOP TOP NAVIGATION BAR (Visible on PC / lg screens)
         ========================================================================= */}
      <div
        className={`hidden lg:flex items-center justify-between px-6 xl:px-10 py-3.5 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0d0a18]/92 backdrop-blur-2xl border-b border-white/15 shadow-2xl shadow-black/90'
            : 'bg-[#0d0a18]/75 backdrop-blur-xl border-b border-white/10'
        }`}
      >
        {/* PC Left: Brand Logo & Status */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="group flex items-center gap-3 cursor-pointer focus-visible:outline-amber-500 rounded-lg py-1 text-left"
          aria-label={`${brandName} Home`}
        >
          <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-black font-extrabold shadow-md shadow-amber-500/25 group-hover:scale-105 transition-transform">
            <Film className="w-4.5 h-4.5 text-black" />
          </div>

          <span className="font-display text-base xl:text-lg font-extrabold tracking-tight text-white uppercase group-hover:text-amber-300 transition-colors whitespace-nowrap drop-shadow-sm">
            {brandName}
          </span>

          {availableForProjects && (
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-[10.5px] font-sans font-semibold text-emerald-300 ml-1.5 whitespace-nowrap">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span>Available</span>
            </span>
          )}
        </button>

        {/* PC Center: Unboxed Plain Text Navigation Links */}
        <nav className={`flex items-center gap-6 xl:gap-8 ${navFontClass}`}>
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`relative py-1 transition-colors cursor-pointer whitespace-nowrap ${navCasingClass} ${
                  isActive
                    ? 'text-amber-400 font-extrabold drop-shadow-sm'
                    : 'text-zinc-300 hover:text-white font-semibold'
                }`}
              >
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.9)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* PC Right: Admin & Collaborate CTA */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAdmin}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs ${navFontClass} text-zinc-300 hover:text-amber-300 hover:bg-white/10 rounded-xl border border-white/10 transition-colors cursor-pointer font-medium`}
            title="Studio Admin Portal"
            aria-label="Studio Admin Portal"
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span className="text-[11px] uppercase tracking-wider font-semibold">Admin</span>
          </button>

          <button
            onClick={() => handleLinkClick('contact')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs ${navFontClass} font-bold uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300 transition-colors rounded-xl shadow-lg shadow-amber-500/20 whitespace-nowrap cursor-pointer transform hover:scale-[1.02] active:scale-95`}
          >
            <span>Collaborate</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* =========================================================================
         MOBILE TOP HEADER & SIDEBAR MENU (Visible on Mobile / < lg screens)
         ========================================================================= */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0d0a18]/92 backdrop-blur-xl border-b border-white/10">
        {/* Mobile Brand Logo */}
        <button
          onClick={() => handleLinkClick('hero')}
          className="flex items-center gap-2.5 cursor-pointer text-left"
          aria-label={`${brandName} Home`}
        >
          <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-black font-extrabold">
            <Film className="w-4 h-4 text-black" />
          </div>
          <span className="font-display text-base font-extrabold tracking-tight text-white uppercase">
            {brandName}
          </span>
        </button>

        {/* Mobile Hamburger Button to open Sidebar */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold uppercase tracking-wider text-amber-400 bg-white/5 border border-white/10 rounded-xl active:scale-90 transition-transform cursor-pointer"
          aria-label="Open Side Navigation Bar"
        >
          <Menu className="w-4 h-4" />
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-md z-50 animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Left Slide-In Sidebar Drawer */}
      <aside
        className={`lg:hidden fixed top-0 bottom-0 left-0 w-76 sm:w-80 bg-[#08070d]/98 backdrop-blur-3xl border-r border-white/15 z-50 flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ease-out ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Mobile Sidebar Top Header & Unboxed Links */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center text-black font-extrabold">
                <Film className="w-4 h-4 text-black" />
              </div>
              <div>
                <span className="font-display text-sm font-extrabold tracking-tight text-white uppercase block">
                  {brandName}
                </span>
                {availableForProjects && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Available</span>
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Side Navigation Bar"
            >
              <X className="w-5 h-5 text-amber-400" />
            </button>
          </div>

          {/* Unboxed Plain Text Navigation List */}
          <nav className="space-y-1 py-1">
            <div className="px-1 text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-3 pb-2 border-b border-white/10">
              Navigation Sidebar
            </div>

            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id)}
                  className={`w-full text-left py-2.5 px-1 transition-colors cursor-pointer flex items-center justify-between group ${navFontClass} ${navCasingClass}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-amber-400' : 'text-zinc-500 group-hover:text-amber-400'}`} />
                    <span className={`transition-colors ${isActive ? 'text-amber-400 font-extrabold' : 'text-zinc-300 font-medium hover:text-white'}`}>
                      {link.label}
                    </span>
                  </div>

                  {isActive ? (
                    <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-300 group-hover:translate-x-1 transition-all" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Mobile Sidebar Bottom Actions */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className={`w-full flex items-center justify-between py-2 px-1 text-xs ${navFontClass} text-zinc-400 hover:text-amber-400 cursor-pointer font-medium transition-colors`}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Studio Admin Portal</span>
            </div>
            <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">CMS</span>
          </button>

          <button
            onClick={() => handleLinkClick('contact')}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 text-xs ${navFontClass} font-bold uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300 rounded-xl cursor-pointer transition-colors active:scale-95`}
          >
            <span>Collaborate</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>
      </aside>
    </header>
  );
};
