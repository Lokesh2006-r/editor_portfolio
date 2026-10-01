import React, { useState } from 'react';
import { Palette, Sparkles, Sliders, Image, Check, RefreshCw, Eye } from 'lucide-react';
import { SiteConfig, BackgroundThemeId } from '../../types';
import { BACKGROUND_THEMES, BLUR_INTENSITY_MAP } from '../../lib/backgroundThemes';
import { storage } from '../../lib/storage';

interface BackgroundThemeManagerProps {
  config: SiteConfig;
  onUpdateConfig: (updated: SiteConfig) => void;
  showNotification: (msg: string) => void;
}

export const BackgroundThemeManager: React.FC<BackgroundThemeManagerProps> = ({
  config,
  onUpdateConfig,
  showNotification,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<BackgroundThemeId>(
    config.bgTheme || 'ember-noir'
  );
  const [blurIntensity, setBlurIntensity] = useState<'low' | 'medium' | 'high' | 'ultra'>(
    config.bgBlurIntensity || 'high'
  );
  const [animSpeed, setAnimSpeed] = useState<'slow' | 'normal' | 'fast' | 'static'>(
    config.bgAnimationSpeed || 'normal'
  );
  const [customWallpaper, setCustomWallpaper] = useState(config.bgCustomWallpaperUrl || '');
  const [showParticles, setShowParticles] = useState(config.bgShowParticles ?? true);
  const [isSaving, setIsSaving] = useState(false);

  const handleApplyTheme = (themeId: BackgroundThemeId) => {
    setSelectedTheme(themeId);
    const updated: SiteConfig = {
      ...config,
      bgTheme: themeId,
      bgBlurIntensity: blurIntensity,
      bgAnimationSpeed: animSpeed,
      bgCustomWallpaperUrl: customWallpaper,
      bgShowParticles: showParticles,
    };
    storage.saveConfig(updated);
    onUpdateConfig(updated);
    showNotification(`✨ Background theme set to "${BACKGROUND_THEMES[themeId].name}"`);
  };

  const handleSaveAll = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    const updated: SiteConfig = {
      ...config,
      bgTheme: selectedTheme,
      bgBlurIntensity: blurIntensity,
      bgAnimationSpeed: animSpeed,
      bgCustomWallpaperUrl: customWallpaper.trim(),
      bgShowParticles: showParticles,
    };
    storage.saveConfig(updated);
    onUpdateConfig(updated);
    setIsSaving(false);
    showNotification('✅ Background wallpaper & theme settings saved!');
  };

  const themeList = Object.values(BACKGROUND_THEMES);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-orange-950/30 via-zinc-900/60 to-black/60 border border-orange-500/20 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-orange-400 mb-2">
              <Palette className="w-4 h-4 text-orange-500" />
              <span>Website Background & Blur Wallpaper</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Dynamic Wallpaper Gradient Themes
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-zinc-400 max-w-xl leading-relaxed">
              Customize the ambient animated gradient orbs, blurred wallpaper aesthetics, and liquid motion playing across the entire portfolio background.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleSaveAll()}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black font-semibold text-xs transition-all shadow-lg shadow-orange-500/20 cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Check className="w-4 h-4" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>

      {/* Preset Wallpaper Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Curated Gradient Wallpaper Themes</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Click any theme to activate it instantly. The changes reflect live across the public site.
            </p>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">6 Presets Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {themeList.map((t) => {
            const isSelected = selectedTheme === t.id;
            return (
              <div
                key={t.id}
                onClick={() => handleApplyTheme(t.id)}
                className={`group relative rounded-2xl p-4 cursor-pointer transition-all duration-300 border flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? 'bg-[#18120c] border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.25)] ring-2 ring-orange-500/40'
                    : 'bg-[#100c07]/80 hover:bg-[#140f09] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Mini Animated Gradient Sandbox Preview inside card */}
                <div 
                  className="relative h-28 w-full rounded-xl overflow-hidden mb-3 border border-white/10 transition-transform duration-500 group-hover:scale-[1.02]"
                  style={{ backgroundColor: t.baseBg }}
                >
                  {/* Floating Mini Orbs */}
                  <div className="absolute inset-0 filter blur-[20px] opacity-90">
                    <div 
                      className="absolute -top-3 -left-3 w-20 h-20 rounded-full animate-float-orb1 mix-blend-screen"
                      style={{ background: t.orbs.orb1 }} 
                    />
                    <div 
                      className="absolute -bottom-3 -right-3 w-24 h-24 rounded-full animate-float-orb2 mix-blend-screen"
                      style={{ background: t.orbs.orb2 }} 
                    />
                    <div 
                      className="absolute top-4 left-1/3 w-16 h-16 rounded-full animate-float-orb3 mix-blend-screen"
                      style={{ background: t.orbs.orb3 }} 
                    />
                  </div>

                  {/* Frosted Badge overlay in mini preview */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                    <div className="flex items-center gap-1.5">
                      {t.previewColors.map((color, idx) => (
                        <span
                          key={idx}
                          className="w-3 h-3 rounded-full border border-white/20 shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Active Indicator Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-black text-[10px] font-mono font-bold shadow-md">
                      <Check className="w-3 h-3" />
                      <span>ACTIVE</span>
                    </div>
                  )}
                </div>

                {/* Card Meta */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold font-display text-white group-hover:text-orange-400 transition-colors">
                      {t.name}
                    </h4>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/5">
                      {t.category}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {t.tagline}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced Wallpaper Settings: Blur, Animation Speed, Particles, Custom Image */}
      <form onSubmit={handleSaveAll} className="space-y-6 pt-4 border-t border-white/[0.08]">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-orange-400" />
            <span>Blur, Animation & Texture Controls</span>
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Fine-tune the blur intensity of the background canvas, orb motion pacing, and grid overlays.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Blur Intensity */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300">
              Blur Intensity
            </label>
            <p className="text-[11px] text-zinc-400">
              Controls the frosted backdrop-blur filter radius.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { id: 'low', label: 'Soft (60px)' },
                { id: 'medium', label: 'Deep (95px)' },
                { id: 'high', label: 'Heavy (135px)' },
                { id: 'ultra', label: 'Ultra Silk (180px)' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setBlurIntensity(opt.id as any)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                    blurIntensity === opt.id
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 font-bold'
                      : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Animation Speed */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300">
              Animation Motion Speed
            </label>
            <p className="text-[11px] text-zinc-400">
              Controls the floating frequency of the liquid orbs.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { id: 'slow', label: 'Dreamy (40s)' },
                { id: 'normal', label: 'Smooth (22s)' },
                { id: 'fast', label: 'Fast (12s)' },
                { id: 'static', label: 'Static (Pause)' },
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setAnimSpeed(opt.id as any)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all cursor-pointer ${
                    animSpeed === opt.id
                      ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 font-bold'
                      : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Texture Overlay & Interactive Spot */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
            <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300">
              Texture & Cursor Effects
            </label>
            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showParticles}
                  onChange={(e) => setShowParticles(e.target.checked)}
                  className="rounded border-white/20 bg-white/5 text-orange-500 focus:ring-orange-500"
                />
                <span className="text-xs text-zinc-300">Show Matrix Dots & Grid Pattern</span>
              </label>
              <p className="text-[11px] text-zinc-500 pl-6 leading-relaxed">
                Applies an aesthetic cinematic grid mesh over the blurred wallpaper.
              </p>
            </div>
          </div>
        </div>

        {/* Custom Background Image Wallpaper (Optional) */}
        <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-300">
            <Image className="w-4 h-4 text-orange-400" />
            <span>Custom Wallpaper Photo (Optional Overlay)</span>
          </div>
          <p className="text-xs text-zinc-400">
            Paste any photo URL or local asset image. It will be layered behind the animated blurred gradient with heavy frosted glass diffusion.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="e.g. /src/assets/images/hero_cinematic_director_1790323945101.jpg"
              value={customWallpaper}
              onChange={(e) => setCustomWallpaper(e.target.value)}
              className="flex-1 bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500/50"
            />
            {customWallpaper && (
              <button
                type="button"
                onClick={() => setCustomWallpaper('')}
                className="px-3 py-2 text-xs text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
              >
                Clear Photo
              </button>
            )}
          </div>
        </div>

        {/* Action Save Button */}
        <div className="flex items-center justify-between pt-3">
          <span className="text-xs text-zinc-500">
            Selected Theme: <strong className="text-orange-400">{BACKGROUND_THEMES[selectedTheme]?.name}</strong>
          </span>

          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl transition-all shadow-lg shadow-orange-500/25 cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Background Theme'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
