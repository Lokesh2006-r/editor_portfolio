import React, { useState, useMemo } from 'react';
import { Search, Film, SlidersHorizontal, LayoutGrid, Grid3X3, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, ProjectCategory } from '../types';
import { VideoCard } from '../components/VideoCard';

interface VideoGalleryProps {
  projects: Project[];
  onSelectProject: (project: Project, e: React.MouseEvent<HTMLElement>) => void;
  onPlayDirect: (project: Project, e: React.MouseEvent<HTMLElement>) => void;
  autoplayOnScroll?: boolean;
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  projects,
  onSelectProject,
  onPlayDirect,
  autoplayOnScroll = true,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [layoutMode, setLayoutMode] = useState<'compact' | 'standard'>('compact');

  const filterTabs: { id: 'all' | ProjectCategory; label: string }[] = [
    { id: 'all', label: 'All Works' },
    { id: 'cinematic', label: 'Cinematic' },
    { id: 'travel', label: 'Travel' },
    { id: 'reels', label: 'Reels (9:16)' },
    { id: 'beat-sync', label: 'Beat Sync' },
    { id: 'transitions', label: 'Transitions' },
    { id: 'night-day', label: 'Night & Day' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'music-edits', label: 'Music Videos' },
  ];

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: projects.length };
    projects.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        if (activeFilter === 'all') return true;
        return p.category === activeFilter;
      })
      .filter((p) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.overview.toLowerCase().includes(q) ||
          (p.client && p.client.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => a.order - b.order);
  }, [projects, activeFilter, searchQuery]);

  return (
    <section id="edits" className="py-16 sm:py-24 bg-transparent relative overflow-hidden">
      {/* iOS Ambient Glow Spheres in background */}
      <div 
        className="absolute top-1/4 left-[-10%] w-[450px] h-[450px] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none" 
        aria-hidden="true" 
      />
      <div 
        className="absolute bottom-1/4 right-[-10%] w-[450px] h-[450px] rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with iOS-style subtle reveal */}
        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-10"
        >
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 text-xs font-mono uppercase tracking-widest text-violet-400 mb-3 shadow-sm">
              <Film className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              <span>Cinematic Portfolio</span>
              <span className="w-1 h-1 rounded-full bg-violet-600/50" />
              <span className="text-zinc-400 font-normal">{projects.length} Works</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white leading-tight">
              Selected Works & Reels.
            </h2>
            <p className="mt-2 text-xs sm:text-sm md:text-base text-zinc-400 leading-relaxed max-w-xl">
              Compact iOS-style preview cards. Tap any edit for high-fidelity playback, color grade breakdowns, and project specs.
            </p>
          </div>

          {/* Controls: Search Bar + Grid Density Switcher */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search Input with iOS Frosted Glass Capsule */}
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search edits, styles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-full pl-9 pr-8 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-orange-500/20 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* iOS Layout Density Switcher (Compact 4-col vs Showcase 3-col) */}
            <div className="hidden sm:flex items-center p-1 rounded-full bg-white/[0.04] backdrop-blur-xl border border-white/10 shadow-sm shrink-0">
              <button
                type="button"
                onClick={() => setLayoutMode('compact')}
                title="Compact Grid (Small iOS Cards)"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  layoutMode === 'compact'
                    ? 'bg-violet-600 text-black shadow-md font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Compact</span>
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('standard')}
                title="Showcase Grid (Larger Cards)"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  layoutMode === 'standard'
                    ? 'bg-violet-600 text-black shadow-md font-semibold'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Grid3X3 className="w-3.5 h-3.5" />
                <span>Showcase</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Category Filters (iOS Frosted Glass Segmented Control with Smooth Sliding Capsule) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-3 overflow-x-auto pb-3 mb-8 no-scrollbar border-b border-white/[0.06]"
        >
          <div className="flex items-center gap-1.5 p-1.5 bg-white/[0.03] backdrop-blur-2xl rounded-full border border-white/[0.10] shadow-lg shrink-0">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              const count = categoryCounts[tab.id] || 0;

              // Hide tab if it has 0 items (unless it's 'all')
              if (tab.id !== 'all' && count === 0) return null;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`relative px-3.5 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition-colors cursor-pointer whitespace-nowrap active:scale-95 z-10 flex items-center gap-1.5 ${
                    isActive ? 'text-black font-bold' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {/* Sliding iOS Liquid Pill Indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeFilterPill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 shadow-[0_2px_14px_rgba(249,115,22,0.45)] -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-sans transition-colors ${
                      isActive
                        ? 'bg-black/20 text-black font-bold'
                        : 'bg-white/[0.08] text-zinc-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Clear Search filter button */}
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-mono text-violet-400 hover:text-violet-300 hover:underline px-2 whitespace-nowrap cursor-pointer flex items-center gap-1"
            >
              <span>Clear search</span>
              <X className="w-3 h-3" />
            </button>
          )}

          {/* Live Result Count Pill */}
          <div className="ml-auto hidden lg:flex items-center text-xs font-mono text-zinc-500">
            <span>Showing {filteredProjects.length} {filteredProjects.length === 1 ? 'edit' : 'edits'}</span>
          </div>
        </motion.div>

        {/* Cinematic Grid with iOS Card Dimensions & Blur Scroll Animations */}
        {filteredProjects.length > 0 ? (
          <motion.div
            layout
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.05 } }}
            className={`grid ${
              layoutMode === 'compact'
                ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'
            }`}
          >
            {filteredProjects.map((project, idx) => (
              <VideoCard
                key={project.id}
                project={project}
                index={idx}
                layout={layoutMode}
                onSelect={onSelectProject}
                onPlayDirect={onPlayDirect}
                autoplayOnScroll={autoplayOnScroll}
              />
            ))}
          </motion.div>
        ) : (
          /* Empty Search / Filter State with iOS frosted card */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 px-6 bg-white/[0.02] backdrop-blur-xl rounded-3xl border border-white/10 max-w-md mx-auto shadow-2xl"
          >
            <div className="w-12 h-12 rounded-full bg-violet-600/10 border border-violet-500/20 text-violet-400 flex items-center justify-center mx-auto mb-3">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-1 font-display">
              No matching edits found
            </h3>
            <p className="text-xs text-zinc-400 mb-5 leading-relaxed">
              Try adjusting your search terms or clearing the current filter category to see all works.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="px-5 py-2.5 text-xs font-semibold text-black bg-gradient-to-r from-violet-600 to-indigo-500 hover:from-orange-400 hover:to-amber-400 rounded-full transition-all cursor-pointer shadow-lg shadow-violet-600/25 active:scale-95"
            >
              Reset All Filters
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
