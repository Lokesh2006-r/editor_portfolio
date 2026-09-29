import React, { useState, useEffect, useRef } from 'react';
import { Type, ChevronDown, Check } from 'lucide-react';
import { navFontManager, NAV_FONT_OPTIONS, NavFontKey, NavCasingKey } from '../lib/navFont';

interface NavFontPickerProps {
  variant?: 'button' | 'compact' | 'card';
  className?: string;
}

export const NavFontPicker: React.FC<NavFontPickerProps> = ({
  variant = 'button',
  className = '',
}) => {
  const [currentFont, setCurrentFont] = useState<NavFontKey>(navFontManager.getFont());
  const [currentCasing, setCurrentCasing] = useState<NavCasingKey>(navFontManager.getCasing());
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFontChange = (e: any) => {
      if (e.detail?.font) setCurrentFont(e.detail.font);
    };
    const handleCasingChange = (e: any) => {
      if (e.detail?.casing) setCurrentCasing(e.detail.casing);
    };

    window.addEventListener('navbar_font_changed', handleFontChange);
    window.addEventListener('navbar_casing_changed', handleCasingChange);

    return () => {
      window.removeEventListener('navbar_font_changed', handleFontChange);
      window.removeEventListener('navbar_casing_changed', handleCasingChange);
    };
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  const handleSelectFont = (key: NavFontKey) => {
    navFontManager.setFont(key);
    setCurrentFont(key);
    setMenuOpen(false);
  };

  const handleSelectCasing = (casing: NavCasingKey) => {
    navFontManager.setCasing(casing);
    setCurrentCasing(casing);
  };

  const activeOpt = NAV_FONT_OPTIONS.find((f) => f.id === currentFont) || NAV_FONT_OPTIONS[0];

  // Full settings card variant (for Settings tab in AdminPage)
  if (variant === 'card') {
    return (
      <div className={`p-5 rounded-2xl bg-black/40 border border-white/[0.08] space-y-4 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Type className="w-4 h-4 text-red-500" />
              <span>Navbar Font & Typography</span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select the typography family used for the portfolio navigation bar and menus.
            </p>
          </div>
          <span className={`text-xs text-red-500 ${activeOpt.cssClass} font-semibold px-2.5 py-1 rounded bg-red-500/10 border border-red-600/20 self-start sm:self-auto`}>
            Active: {activeOpt.name}
          </span>
        </div>

        {/* Font Family Selection Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {NAV_FONT_OPTIONS.map((opt) => {
            const isSelected = opt.id === currentFont;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelectFont(opt.id)}
                className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-red-500/15 border-red-500/40 text-red-500 shadow-md shadow-red-600/10'
                    : 'bg-[#120c0c] border-white/5 text-zinc-300 hover:text-white hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${opt.cssClass} font-semibold`}>
                    {opt.name}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-red-500" />}
                </div>
                <div className="text-[11px] text-zinc-400 mt-1">{opt.sub}</div>
                <div className={`text-xs mt-2 px-2 py-1 rounded bg-black/40 text-zinc-300 truncate ${opt.cssClass}`}>
                  Home &middot; Showreel &middot; Edits
                </div>
              </button>
            );
          })}
        </div>

        {/* Text Casing Options */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
          <div>
            <span className="text-xs font-semibold text-white block">Navbar Letter Casing</span>
            <span className="text-[11px] text-zinc-400">Choose between Title Case ("Home") or ALL CAPS ("HOME")</span>
          </div>

          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
            <button
              type="button"
              onClick={() => handleSelectCasing('normal')}
              className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer font-medium ${
                currentCasing === 'normal'
                  ? 'bg-red-500 text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Title Case
            </button>
            <button
              type="button"
              onClick={() => handleSelectCasing('uppercase')}
              className={`px-3 py-1.5 text-xs rounded transition-colors cursor-pointer font-medium uppercase tracking-wider ${
                currentCasing === 'uppercase'
                  ? 'bg-red-500 text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              ALL CAPS
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Top header button dropdown variant (matches user screenshot `[ T Space v ]`)
  return (
    <div className={`relative inline-flex items-center ${className}`} ref={menuRef}>
      <button
        type="button"
        onClick={() => setMenuOpen(!menuOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
          menuOpen
            ? 'bg-red-500/15 border-red-500/40 text-red-500 shadow-sm shadow-red-600/10'
            : 'bg-white/5 border-white/10 hover:border-red-500/40 text-zinc-300 hover:text-white'
        }`}
        title={`Change Navbar Font (Current: ${activeOpt.name})`}
        aria-label="Change Navbar Font"
      >
        <Type className="w-3.5 h-3.5 text-red-500" />
        <span className={`text-xs font-medium tracking-wide ${activeOpt.cssClass}`}>
          {activeOpt.name.split(' ')[0]}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${
            menuOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 rounded-xl bg-[#100b0b]/98 backdrop-blur-xl border border-white/10 shadow-2xl shadow-black/80 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3.5 py-1.5 border-b border-white/5 flex items-center justify-between">
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Type className="w-3 h-3 text-red-500" />
              Navbar Font
            </span>
            <span className="text-[10px] text-red-500/90 font-sans font-medium">Site Navbar</span>
          </div>

          <div className="p-1 space-y-0.5">
            {NAV_FONT_OPTIONS.map((opt) => {
              const isSelected = opt.id === currentFont;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectFont(opt.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-red-500/10 text-red-500 font-semibold border border-red-600/20'
                      : 'text-zinc-300 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex flex-col text-left">
                    <span className={`text-xs ${opt.cssClass} font-medium`}>{opt.name}</span>
                    <span className="text-[10px] text-zinc-500 font-sans">{opt.sub}</span>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-red-500 shrink-0 ml-2" />}
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-1.5 px-3 border-t border-white/5">
            <div className="text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Text Casing
            </div>
            <div className="grid grid-cols-2 gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
              <button
                type="button"
                onClick={() => handleSelectCasing('normal')}
                className={`py-1 text-[11px] rounded transition-colors cursor-pointer font-medium ${
                  currentCasing === 'normal'
                    ? 'bg-red-500 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Title Case
              </button>
              <button
                type="button"
                onClick={() => handleSelectCasing('uppercase')}
                className={`py-1 text-[11px] rounded transition-colors cursor-pointer font-medium uppercase tracking-wider ${
                  currentCasing === 'uppercase'
                    ? 'bg-red-500 text-black font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                ALL CAPS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
