import React, { useState, useMemo } from 'react';
import { Search, Film, SlidersHorizontal, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, ProjectCategory } from '../types';
import { ProjectCard } from '../components/ProjectCard';

interface FeaturedWorkProps {
  projects: Project[];
  onSelectProject: (project: Project, e: React.MouseEvent<HTMLElement>) => void;
  onPlayDirect: (project: Project, e: React.MouseEvent<HTMLElement>) => void;
}

export const FeaturedWork: React.FC<FeaturedWorkProps> = ({
  projects,
  onSelectProject,
  onPlayDirect,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | ProjectCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs: { id: 'all' | ProjectCategory; label: string }[] = [
    { id: 'all', label: 'All Edits' },
    { id: 'cinematic', label: 'Cinematic' },
    { id: 'travel', label: 'Travel' },
    { id: 'reels', label: 'Instagram Reels' },
    { id: 'beat-sync', label: 'Beat Sync' },
    { id: 'transitions', label: 'Transitions' },
    { id: 'night-day', label: 'Night & Day' },
    { id: 'lifestyle', label: 'Lifestyle' },
    { id: 'music-edits', label: 'Music Edits' },
  ];

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
    <section id="edits" className="py-20 sm:py-28 bg-transparent relative overflow-hidden">
      {/* Subtle ambient light glow */}
      <div className="absolute top-1/3 left-0 w-80 h-80 rounded-full bg-violet-600/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with scroll reveal */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12"
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-violet-400 mb-2 sm:mb-3">
              <Film className="w-3.5 h-3.5" />
              <span>Vertical Video Gallery (9:16)</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white leading-tight">
              A few seconds. A whole story.
            </h2>
            <p className="mt-2.5 text-xs sm:text-base text-zinc-400 leading-relaxed">
              Explore short-form mobile edits crafted for maximum retention, beat alignment, and cinematic punch.
              Tap any video to open the dedicated full-screen viewer.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search edits, styles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"
            />
          </div>
        </motion.div>

        {/* Category Filters (Mobile Scrollable Segmented Bar) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar border-b border-white/[0.06]"
        >
          <div className="flex items-center gap-1.5 p-1 bg-white/[0.04] backdrop-blur-2xl rounded-2xl border border-white/[0.12] shrink-0 shadow-[inset_0_1px_1px_rgba(255,255,255,0.18)]">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-mono uppercase tracking-wider rounded-xl transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                    isActive
                      ? 'bg-violet-600 text-black font-bold shadow-md'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-mono text-violet-400 hover:underline px-2 whitespace-nowrap cursor-pointer"
            >
              Clear search
            </button>
          )}
        </motion.div>

        {/* Vertical Edits Grid: 2 columns on mobile, 3-4 on desktop with staggered reveals */}
        {filteredProjects.length > 0 ? (
          <motion.div
            layout
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.06,
                  delayChildren: 0.05,
                },
              },
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6"
          >
            {filteredProjects.map((project, idx) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={idx}
                onSelect={onSelectProject}
                onPlayDirect={onPlayDirect}
              />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-16 bg-white/[0.04] backdrop-blur-2xl rounded-3xl border border-white/[0.12] p-6 shadow-[inset_0_1px_1.5px_rgba(255,255,255,0.18)]">
            <SlidersHorizontal className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
            <h3 className="text-sm sm:text-base font-bold text-white mb-1">No matching edits found</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Try switching your filter or clearing the search query.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 text-xs font-semibold text-black bg-violet-600 hover:bg-violet-500 rounded-md transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
