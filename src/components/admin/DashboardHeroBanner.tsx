import React, { useState, useRef } from 'react';
import { Camera, Sparkles, Edit3, Check, Upload, Image as ImageIcon, Eye, RefreshCw } from 'lucide-react';
import { SiteConfig } from '../../types';
import { storage } from '../../lib/storage';

interface DashboardHeroBannerProps {
  config: SiteConfig;
  onUpdateConfig: (updated: SiteConfig) => void;
  onViewSite: () => void;
  showNotification: (msg: string) => void;
}

const PRESET_HERO_PHOTOS = [
  { label: 'Director Portrait (Default)', path: '/src/assets/images/hero_cinematic_director_1790323945101.jpg' },
  { label: 'Cyberpunk Tokyo', path: '/src/assets/images/reel_cyberpunk_tokyo_1790324913367.jpg' },
  { label: 'Amalfi Coast Travel', path: '/src/assets/images/reel_travel_amalfi_1790324936716.jpg' },
  { label: 'Hypercar Commercial', path: '/src/assets/images/project_commercial_hypercar_1790323997509.jpg' },
  { label: 'Beat-Sync Dancer', path: '/src/assets/images/reel_beat_sync_dancer_1790324955727.jpg' },
  { label: 'Cinematic Cover 16:9', path: '/src/assets/images/showreel_cinematic_cover_1790323962781.jpg' },
];

export const DashboardHeroBanner: React.FC<DashboardHeroBannerProps> = ({
  config,
  onUpdateConfig,
  onViewSite,
  showNotification,
}) => {
  const [isEditingCopy, setIsEditingCopy] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [taglineInput, setTaglineInput] = useState(config.heroTagline ?? 'Every Frame,\nTells a Story.');
  const [subcopyInput, setSubcopyInput] = useState(config.heroSubcopy ?? config.shortBio);
  const [photoUrlInput, setPhotoUrlInput] = useState(config.heroPhoto ?? '');
  const [editorNameInput, setEditorNameInput] = useState(config.editorName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lines = (config.heroTagline ?? 'Every Frame,\nTells a Story.').split('\n');

  // Handle Photo Upload from file
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        const updated: SiteConfig = {
          ...config,
          heroPhoto: dataUrl,
        };
        storage.saveConfig(updated);
        onUpdateConfig(updated);
        setPhotoUrlInput(dataUrl);
        showNotification('✅ Hero photo updated live across portfolio!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Select Preset Photo
  const handleSelectPreset = (path: string) => {
    const updated: SiteConfig = {
      ...config,
      heroPhoto: path,
    };
    storage.saveConfig(updated);
    onUpdateConfig(updated);
    setPhotoUrlInput(path);
    setIsPickerOpen(false);
    showNotification('✅ Preset photo applied to hero banner!');
  };

  // Save Text Changes
  const handleSaveText = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SiteConfig = {
      ...config,
      editorName: editorNameInput.trim() || config.editorName,
      heroTagline: taglineInput.trim() || config.heroTagline,
      heroSubcopy: subcopyInput.trim() || config.heroSubcopy,
      heroPhoto: photoUrlInput.trim() || config.heroPhoto,
    };
    storage.saveConfig(updated);
    onUpdateConfig(updated);
    setIsEditingCopy(false);
    showNotification('✅ Hero banner text & photo updated successfully!');
  };

  // Toggle availability
  const toggleAvailability = () => {
    const updated: SiteConfig = {
      ...config,
      availableForProjects: !config.availableForProjects,
    };
    storage.saveConfig(updated);
    onUpdateConfig(updated);
    showNotification(updated.availableForProjects ? '🟢 Availability set to: Available' : '⚪ Availability set to: Booked out');
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-orange-500/25 bg-[#080604] shadow-2xl shadow-black/90 group transition-all duration-300">
      {/* ── PHOTO BACKGROUND (Shadow style right-aligned portrait) ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={config.heroPhoto || '/src/assets/images/hero_cinematic_director_1790323945101.jpg'}
          alt={config.editorName}
          className="w-full h-full object-cover object-[75%_20%] opacity-90 filter contrast-[1.04] brightness-[0.92]"
        />

        {/* 3 Scrim layers identical to hero template */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#080604] via-[#080604]/85 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080604] via-[#080604]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080604]/80 via-transparent to-transparent" />

        {/* Molten amber-orange atmospheric backlight glow */}
        <div className="absolute -bottom-10 right-[10%] w-[50%] h-[70%] bg-gradient-to-tl from-orange-600/25 via-amber-600/15 to-transparent blur-[90px] rounded-full pointer-events-none" />
      </div>

      {/* ── TOP ACTION BAR (Modify controls) ── */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 border-b border-white/[0.08] bg-black/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          <span className="text-xs font-mono font-bold tracking-wider uppercase text-orange-400">
            Live Cinematic Hero Template
          </span>
          <span className="hidden sm:inline text-[11px] font-mono text-zinc-400 ml-1">
            (Synced directly with public website)
          </span>
        </div>

        {/* Action Buttons to modify photo & copy */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Hidden File Picker */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />

          {/* Quick Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-600/25 transition-all cursor-pointer active:scale-95"
            title="Upload custom portrait photo from computer"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>

          {/* Choose Preset Button */}
          <button
            type="button"
            onClick={() => setIsPickerOpen(!isPickerOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-orange-400" />
            <span>Presets</span>
          </button>

          {/* Edit Copy Button */}
          <button
            type="button"
            onClick={() => setIsEditingCopy(!isEditingCopy)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
              isEditingCopy
                ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                : 'bg-white/10 hover:bg-white/15 border-white/10 text-zinc-200'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5 text-orange-400" />
            <span>{isEditingCopy ? 'Close Editor' : 'Edit Text'}</span>
          </button>

          {/* View Live on Website */}
          <button
            type="button"
            onClick={onViewSite}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
            title="View how this looks on public portfolio"
          >
            <Eye className="w-3.5 h-3.5 text-zinc-400" />
            <span className="hidden sm:inline">Preview Live</span>
          </button>
        </div>
      </div>

      {/* ── PRESET PICKER DROPDOWN ── */}
      {isPickerOpen && (
        <div className="relative z-20 p-4 bg-black/90 backdrop-blur-xl border-b border-orange-500/20 animate-in fade-in duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              Select Studio Visual Preset:
            </span>
            <button
              onClick={() => setIsPickerOpen(false)}
              className="text-xs text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {PRESET_HERO_PHOTOS.map((preset) => (
              <button
                key={preset.path}
                type="button"
                onClick={() => handleSelectPreset(preset.path)}
                className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-orange-500 text-left transition-all p-1 bg-white/5 cursor-pointer"
              >
                <img
                  src={preset.path}
                  alt={preset.label}
                  className="w-full h-16 object-cover rounded-lg group-hover:scale-105 transition-transform"
                />
                <span className="block text-[10px] font-mono text-zinc-300 truncate mt-1 px-1 group-hover:text-orange-400">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── INLINE TEXT & PHOTO URL EDITOR DRAWER ── */}
      {isEditingCopy && (
        <form
          onSubmit={handleSaveText}
          className="relative z-20 p-5 bg-[#0e0b05]/95 backdrop-blur-2xl border-b border-orange-500/20 space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-orange-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Customize Hero Banner Content
            </h4>
            <span className="text-[11px] font-mono text-zinc-400">
              Changes update immediately on public homepage
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">
                Headline Tagline (2 Lines, 2nd gets molten amber shimmer)
              </label>
              <textarea
                rows={2}
                value={taglineInput}
                onChange={(e) => setTaglineInput(e.target.value)}
                placeholder="Every Frame,&#10;Tells a Story."
                className="w-full bg-[#18181e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-orange-500 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">
                Supporting Subcopy
              </label>
              <textarea
                rows={2}
                value={subcopyInput}
                onChange={(e) => setSubcopyInput(e.target.value)}
                placeholder="Cinematic video editing built with depth, drama, and rhythm."
                className="w-full bg-[#18181e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">
                Creator / Brand Watermark Name
              </label>
              <input
                type="text"
                value={editorNameInput}
                onChange={(e) => setEditorNameInput(e.target.value)}
                className="w-full bg-[#18181e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-zinc-300 mb-1">
                Photo URL (Local path, blob, or https link)
              </label>
              <input
                type="text"
                value={photoUrlInput}
                onChange={(e) => setPhotoUrlInput(e.target.value)}
                placeholder="/src/assets/images/... or https://..."
                className="w-full bg-[#18181e] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:border-orange-500 outline-none font-mono"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-black text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md shadow-orange-600/20 active:scale-95"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply Changes Live</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditingCopy(false)}
              className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* ── BANNER VISUAL CANVAS (Shadow style layout) ── */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-12 py-10 sm:py-14 min-h-[360px] sm:min-h-[420px] flex flex-col justify-between">
        {/* Top Badges */}
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={toggleAvailability}
            title="Click to toggle availability status"
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-[11px] font-mono tracking-widest uppercase text-emerald-300 font-semibold cursor-pointer hover:bg-emerald-500/25 transition-all"
          >
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.availableForProjects ? 'bg-emerald-400' : 'bg-zinc-400'} opacity-75`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${config.availableForProjects ? 'bg-emerald-400' : 'bg-zinc-400'}`} />
            </span>
            <span>{config.availableForProjects ? 'Available for Projects' : 'Booked Out'}</span>
          </button>

          <span className="text-[11px] font-mono tracking-widest uppercase text-orange-400/90 font-medium">
            {config.location}
          </span>
        </div>

        {/* Cinematic Headline */}
        <div className="max-w-xl my-4">
          {lines.map((line, idx) => (
            <h2
              key={idx}
              className={`block font-display leading-[0.98] tracking-[-0.03em] text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold ${
                idx === lines.length - 1 ? 'text-gradient-ember' : ''
              }`}
            >
              {line}
            </h2>
          ))}

          <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium max-w-md">
            {config.heroSubcopy ?? config.shortBio}
          </p>
        </div>

        {/* Bottom Bar: Watermark + Quick Actions */}
        <div className="flex items-end justify-between pt-6 border-t border-white/[0.06]">
          {/* Watermark creator name in ghost font */}
          <span className="font-display font-black text-2xl sm:text-3xl uppercase tracking-wider text-white/20 select-none">
            {config.editorName}
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white border border-white/10 font-mono transition-colors cursor-pointer"
            >
              <Upload className="w-3 h-3 text-orange-400" />
              <span>Change Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditingCopy(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-xs text-orange-300 border border-orange-500/30 font-mono transition-colors cursor-pointer"
            >
              <Edit3 className="w-3 h-3 text-orange-400" />
              <span>Edit Text</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
