import React, { useState } from 'react';
import {
  X,
  LayoutDashboard,
  Film,
  Mail,
  Sliders,
  Database,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  RotateCcw,
  ExternalLink,
  Save,
  Check
} from 'lucide-react';
import { Project, Inquiry, SiteConfig, ProjectCategory } from '../../types';
import { storage } from '../../lib/storage';
import { getFirebaseStatus } from '../../lib/firebase';
import { NavFontPicker } from '../../components/NavFontPicker';
import { MultiSelectTagInput } from '../../components/admin/MultiSelectTagInput';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  inquiries: Inquiry[];
  config: SiteConfig;
  onUpdateProjects: (projects: Project[]) => void;
  onUpdateConfig: (config: SiteConfig) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  projects,
  inquiries,
  config,
  onUpdateProjects,
  onUpdateConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'inquiries' | 'settings' | 'firebase'>('overview');
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [siteForm, setSiteForm] = useState<SiteConfig>(config);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const firebaseStatus = getFirebaseStatus();

  if (!isOpen) return null;

  const showNotice = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => setSaveSuccessNotice(null), 3000);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveConfig(siteForm);
    onUpdateConfig(siteForm);
    showNotice('Site settings updated successfully');
  };

  const handleUpdateInquiryStatus = (id: string, status: Inquiry['status']) => {
    storage.updateInquiryStatus(id, status);
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm('Delete this inquiry record?')) {
      storage.deleteInquiry(id);
    }
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to remove this project?')) {
      const updated = projects.filter((p) => p.id !== id);
      storage.saveProjects(updated);
      onUpdateProjects(updated);
      showNotice('Project removed');
    }
  };

  const handleSaveProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const category = formData.get('category') as ProjectCategory;

    const techniquesStr = (formData.get('editingTechniques') as string) || '';
    const toolsStr = (formData.get('toolsUsed') as string) || '';
    const deliverablesStr = (formData.get('deliverables') as string) || '';

    const newProjectData: Project = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      title: (formData.get('title') as string) || 'Untitled',
      category: category || 'cinematic',
      categoryLabel: (formData.get('categoryLabel') as string) || 'Cinematic Edit',
      year: (formData.get('year') as string) || new Date().getFullYear().toString(),
      client: (formData.get('client') as string) || undefined,
      duration: (formData.get('duration') as string) || '02:00',
      thumbnail: (formData.get('thumbnail') as string) || '/src/assets/images/hero_cinematic_director_1790323945101.jpg',
      videoUrl: (formData.get('videoUrl') as string) || undefined,
      aspectRatio: (formData.get('aspectRatio') as any) || '9:16',
      overview: (formData.get('overview') as string) || '',
      role: (formData.get('role') as string) || 'Lead Editor',
      creativeApproach: (formData.get('creativeApproach') as string) || '',
      editingTechniques: techniquesStr.split(',').map((s) => s.trim()).filter(Boolean),
      toolsUsed: toolsStr.split(',').map((s) => s.trim()).filter(Boolean),
      deliverables: deliverablesStr.split(',').map((s) => s.trim()).filter(Boolean),
      featured: formData.get('featured') === 'on',
      order: editingProject ? editingProject.order : projects.length + 1,
      isDemo: false,
    };

    let updatedProjects: Project[];
    if (editingProject) {
      updatedProjects = projects.map((p) => (p.id === editingProject.id ? newProjectData : p));
    } else {
      updatedProjects = [newProjectData, ...projects];
    }

    storage.saveProjects(updatedProjects);
    onUpdateProjects(updatedProjects);
    setEditingProject(null);
    setIsCreatingProject(false);
    showNotice(editingProject ? 'Project updated' : 'New project added');
  };

  const handleResetToDemo = () => {
    if (confirm('Reset portfolio to initial demo sample projects?')) {
      const reset = storage.resetProjects();
      onUpdateProjects(reset);
      showNotice('Reset to initial sample projects');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admin Dashboard"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 w-full max-w-6xl bg-[#0e0b05] border border-white/10 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#080604]">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold uppercase tracking-wider text-white text-base">
              Portfolio Studio Admin
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-600/20">
              CMS & Inquiries
            </span>
          </div>

          <div className="flex items-center gap-3">
            <NavFontPicker variant="button" />

            {saveSuccessNotice && (
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-3.5 h-3.5" />
                <span>{saveSuccessNotice}</span>
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Admin Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-white/[0.06] bg-[#0a0704] overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'inquiries', label: `Inquiries (${inquiries.length})`, icon: Mail },
            { id: 'projects', label: `Projects (${projects.length})`, icon: Film },
            { id: 'settings', label: 'Site Settings', icon: Sliders },
            { id: 'firebase', label: 'Backend / Cloud', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setEditingProject(null);
                  setIsCreatingProject(false);
                }}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'border-orange-500 text-orange-500'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#120d07] border border-white/[0.08]">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Total Projects
                  </span>
                  <span className="text-2xl font-bold font-display text-white tabular-nums">
                    {projects.length}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#120d07] border border-white/[0.08]">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    New Inquiries
                  </span>
                  <span className="text-2xl font-bold font-display text-orange-500 tabular-nums">
                    {inquiries.filter((i) => i.status === 'new').length}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#120d07] border border-white/[0.08]">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Active Services
                  </span>
                  <span className="text-2xl font-bold font-display text-white tabular-nums">
                    6
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-[#120d07] border border-white/[0.08]">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Backend Mode
                  </span>
                  <span className="text-sm font-semibold font-mono text-emerald-400 block mt-1">
                    {firebaseStatus.mode === 'firebase_live' ? 'Firebase Live' : 'Local Storage Mode'}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="p-5 rounded-xl bg-[#120d07] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Quick Management Actions</h4>
                  <p className="text-xs text-zinc-400">
                    Add new video work, review client proposals, or reset to original sample template.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setActiveTab('projects');
                      setIsCreatingProject(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded-md transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Project</span>
                  </button>
                  <button
                    onClick={handleResetToDemo}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-md transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Sample Data</span>
                  </button>
                </div>
              </div>

              {/* Recent Inquiries Snippet */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Recent Client Inquiries
                  </h4>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-orange-500 hover:underline cursor-pointer"
                  >
                    View All ({inquiries.length})
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="p-8 text-center bg-[#120d07] rounded-xl border border-white/[0.08] text-xs text-zinc-400">
                    No client inquiries recorded yet. Submissions from the homepage contact form will appear here.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {inquiries.slice(0, 3).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-3.5 rounded-lg bg-[#120d07] border border-white/[0.06] flex items-center justify-between gap-4 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white">{inq.fullName}</div>
                          <div className="text-zinc-400">{inq.email} · {inq.projectType}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${
                            inq.status === 'new'
                              ? 'bg-orange-600/20 text-orange-400'
                              : inq.status === 'contacted'
                              ? 'bg-blue-500/20 text-blue-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            {inq.status}
                          </span>
                          <span className="text-zinc-500 font-mono text-[11px]">
                            {new Date(inq.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold font-display text-white">Project Inquiries</h3>
                  <p className="text-xs text-zinc-400">
                    Inbound briefs received via your contact form.
                  </p>
                </div>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-12 text-center bg-[#120d07] rounded-xl border border-white/[0.08] text-sm text-zinc-400">
                  No inquiries received yet. Try filling out the contact form on the website!
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-xl bg-[#120d07] border border-white/[0.08] space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                        <div>
                          <span className="text-base font-bold text-white mr-2">{inq.fullName}</span>
                          <span className="text-xs text-zinc-400 font-mono">({inq.email})</span>
                          {inq.whatsappNumber && (
                            <span className="text-xs text-emerald-400 font-mono ml-2">
                              WA: {inq.whatsappNumber}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                            className="bg-black/60 border border-white/10 rounded px-2.5 py-1 text-xs text-zinc-300 focus:outline-none focus:border-orange-500 cursor-pointer"
                          >
                            <option value="new">Status: New</option>
                            <option value="contacted">Status: Contacted</option>
                            <option value="completed">Status: Completed</option>
                            <option value="archived">Status: Archived</option>
                          </select>

                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1 text-zinc-500 hover:text-orange-400 transition-colors cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-zinc-400">
                        <div>
                          <span className="text-zinc-500 block mb-0.5">Project Type</span>
                          <span className="text-orange-500 font-medium">{inq.projectType}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block mb-0.5">Estimated Budget</span>
                          <span className="text-zinc-200">{inq.estimatedBudget || 'Not specified'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block mb-0.5">Target Delivery Date</span>
                          <span className="text-zinc-200">{inq.preferredDeliveryDate || 'Flexible'}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="text-xs sm:text-sm text-zinc-300 bg-black/40 p-3 rounded-lg border border-white/[0.04] leading-relaxed">
                        {inq.projectDescription}
                      </div>

                      {inq.referenceLink && (
                        <div className="text-xs flex items-center gap-1.5 text-zinc-400">
                          <span className="text-zinc-500">Reference:</span>
                          <a
                            href={inq.referenceLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-orange-500 hover:underline flex items-center gap-1 truncate max-w-md"
                          >
                            <span>{inq.referenceLink}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {!isCreatingProject && !editingProject ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold font-display text-white">Project Showcase Manager</h3>
                      <p className="text-xs text-zinc-400">
                        Manage videos, titles, roles, thumbnails, and technical breakdowns.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsCreatingProject(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded-md transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add New Project</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl bg-[#120d07] border border-white/[0.08] flex gap-4 items-start justify-between"
                      >
                        <div className="flex gap-3">
                          <img
                            src={proj.thumbnail}
                            alt={proj.title}
                            className="w-20 h-14 object-cover rounded bg-black border border-white/10 shrink-0"
                          />
                          <div>
                            <h4 className="text-sm font-bold text-white">{proj.title}</h4>
                            <div className="text-xs text-zinc-400 mt-0.5">
                              {proj.categoryLabel} · {proj.year} · {proj.duration}
                            </div>
                            {proj.client && (
                              <div className="text-[11px] text-zinc-500 mt-0.5">
                                Client: {proj.client}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => setEditingProject(proj)}
                            className="p-1.5 text-zinc-400 hover:text-orange-500 transition-colors cursor-pointer"
                            title="Edit Project"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(proj.id)}
                            className="p-1.5 text-zinc-400 hover:text-orange-400 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Edit / Create Form */
                <form onSubmit={handleSaveProject} className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <h4 className="text-sm font-bold text-white">
                      {editingProject ? `Edit: ${editingProject.title}` : 'Add New Project'}
                    </h4>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setIsCreatingProject(false);
                      }}
                      className="text-xs text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">Title</label>
                      <input
                        name="title"
                        defaultValue={editingProject?.title || ''}
                        required
                        className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">Category</label>
                      <select
                        name="category"
                        defaultValue={editingProject?.category || 'reels'}
                        className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                      >
                        <option value="cinematic">Cinematic</option>
                        <option value="travel">Travel</option>
                        <option value="reels">Instagram Reels</option>
                        <option value="beat-sync">Beat Sync</option>
                        <option value="transitions">Transitions</option>
                        <option value="night-day">Night & Day</option>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="music-edits">Music Edits</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">Category Label</label>
                      <input
                        name="categoryLabel"
                        defaultValue={editingProject?.categoryLabel || 'Cinematic Film'}
                        required
                        className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">Year</label>
                      <input
                        name="year"
                        defaultValue={editingProject?.year || '2025'}
                        required
                        className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">Duration</label>
                      <input
                        name="duration"
                        defaultValue={editingProject?.duration || '02:30'}
                        required
                        className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">Client (Optional)</label>
                      <input
                        name="client"
                        defaultValue={editingProject?.client || ''}
                        className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">Role</label>
                      <input
                        name="role"
                        defaultValue={editingProject?.role || 'Lead Editor & Colorist'}
                        required
                        className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">Thumbnail Path, URL, or Upload</label>
                      <div className="flex gap-2">
                        <input
                          name="thumbnail"
                          id="thumbnail-input"
                          defaultValue={editingProject?.thumbnail || '/src/assets/images/hero_cinematic_director_1790323945101.jpg'}
                          required
                          className="flex-1 bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                        />
                        <label className="flex items-center justify-center px-3 py-2 bg-white/10 border border-white/10 hover:bg-white/20 hover:text-white rounded text-xs text-zinc-300 cursor-pointer transition-colors">
                          Upload
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                const input = document.getElementById('thumbnail-input') as HTMLInputElement;
                                if (input) input.value = url;
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">Video URL (YouTube, Vimeo, MP4) or Upload</label>
                      <div className="flex gap-2">
                        <input
                          name="videoUrl"
                          id="video-url-input"
                          defaultValue={editingProject?.videoUrl || 'https://www.youtube.com/watch?v=aqz-KE-bpKQ'}
                          className="flex-1 bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                        />
                        <label className="flex items-center justify-center px-3 py-2 bg-white/10 border border-white/10 hover:bg-white/20 hover:text-white rounded text-xs text-zinc-300 cursor-pointer transition-colors">
                          Upload
                          <input 
                            type="file" 
                            accept="video/*" 
                            className="hidden" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = URL.createObjectURL(file);
                                const input = document.getElementById('video-url-input') as HTMLInputElement;
                                if (input) input.value = url;
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-zinc-300 mb-1">Aspect Ratio</label>
                      <select
                        name="aspectRatio"
                        defaultValue={editingProject?.aspectRatio || '16:9'}
                        className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                      >
                        <option value="16:9">Horizontal (16:9)</option>
                        <option value="9:16">Vertical (9:16)</option>
                        <option value="4:3">Classic (4:3)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1">Overview Description</label>
                    <textarea
                      name="overview"
                      rows={2}
                      defaultValue={editingProject?.overview || ''}
                      required
                      className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1">Creative Approach</label>
                    <textarea
                      name="creativeApproach"
                      rows={2}
                      defaultValue={editingProject?.creativeApproach || ''}
                      required
                      className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <MultiSelectTagInput 
                      name="editingTechniques"
                      label="Editing Techniques"
                      initialTags={editingProject?.editingTechniques || ['Anamorphic framing', 'Pacing sync']}
                      suggestedTags={['Beat sync', 'Speed ramp', 'Sound design', 'Color grading', 'Anamorphic framing', 'Pacing sync', 'Motion graphics', 'VFX', 'Transitions', 'Film grain', 'Audio mixing']}
                    />
                    
                    <MultiSelectTagInput 
                      name="toolsUsed"
                      label="Tools Used"
                      initialTags={editingProject?.toolsUsed || ['DaVinci Resolve', 'Premiere Pro']}
                      suggestedTags={['DaVinci Resolve', 'Premiere Pro', 'After Effects', 'Final Cut Pro', 'CapCut Pro', 'Avid Media Composer', 'Audition', 'Logic Pro']}
                    />

                    <MultiSelectTagInput 
                      name="deliverables"
                      label="Deliverables"
                      initialTags={editingProject?.deliverables || ['4K Master', 'Web Export']}
                      suggestedTags={['4K Master', '1080x1920 Master', 'Clean Feed', 'Social Cut', 'Web Export', 'ProRes HQ', 'H.264', 'H.265']}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      defaultChecked={editingProject?.featured}
                      className="rounded border-white/20 bg-white/5 text-orange-600"
                    />
                    <label htmlFor="featured" className="text-xs text-zinc-300">
                      Feature on homepage
                    </label>
                  </div>

                  <div className="pt-3 flex items-center gap-3">
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded transition-colors cursor-pointer"
                    >
                      Save Project
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setIsCreatingProject(false);
                      }}
                      className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveConfig} className="space-y-5 max-w-3xl">
              <div>
                <h3 className="text-base font-bold font-display text-white">Brand & Content Settings</h3>
                <p className="text-xs text-zinc-400">
                  Update your personal name, hero copy, showreel metadata, and contact details.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Editor Name</label>
                  <input
                    value={siteForm.editorName}
                    onChange={(e) => setSiteForm({ ...siteForm, editorName: e.target.value })}
                    required
                    className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Tagline</label>
                  <input
                    value={siteForm.tagline}
                    onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
                    required
                    className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Navbar Font Selection */}
              <NavFontPicker variant="card" />

              <div>
                <label className="block text-xs font-mono text-zinc-300 mb-1">Short Biography</label>
                <textarea
                  value={siteForm.shortBio}
                  onChange={(e) => setSiteForm({ ...siteForm, shortBio: e.target.value })}
                  rows={2}
                  className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Creative Philosophy</label>
                  <textarea
                    value={siteForm.aboutPhilosophy}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutPhilosophy: e.target.value })}
                    rows={2}
                    className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white resize-y"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Editing Approach</label>
                  <textarea
                    value={siteForm.aboutApproach}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutApproach: e.target.value })}
                    rows={2}
                    className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white resize-y"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Contact Email</label>
                  <input
                    type="email"
                    value={siteForm.contactEmail}
                    onChange={(e) => setSiteForm({ ...siteForm, contactEmail: e.target.value })}
                    required
                    className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">WhatsApp Number</label>
                  <input
                    value={siteForm.whatsappNumber}
                    onChange={(e) => setSiteForm({ ...siteForm, whatsappNumber: e.target.value })}
                    className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Location</label>
                  <input
                    value={siteForm.location}
                    onChange={(e) => setSiteForm({ ...siteForm, location: e.target.value })}
                    className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Showreel Title</label>
                  <input
                    value={siteForm.showreelTitle}
                    onChange={(e) => setSiteForm({ ...siteForm, showreelTitle: e.target.value })}
                    className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1">Showreel Duration</label>
                  <input
                    value={siteForm.showreelDuration}
                    onChange={(e) => setSiteForm({ ...siteForm, showreelDuration: e.target.value })}
                    className="w-full bg-[#18181e] border border-white/10 rounded px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Site Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: FIREBASE / BACKEND STATUS */}
          {activeTab === 'firebase' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h3 className="text-base font-bold font-display text-white">Backend & Firebase Status</h3>
                <p className="text-xs text-zinc-400">
                  Information regarding Firestore database synchronization and fallback mode.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#120d07] border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${firebaseStatus.isConfigured ? 'bg-emerald-400' : 'bg-orange-500'}`} />
                  <span className="font-semibold text-white text-sm">
                    {firebaseStatus.isConfigured ? 'Firebase Cloud Connected' : 'Frontend-Only Local Storage Fallback (Active)'}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed">
                  {firebaseStatus.notice}
                </p>

                <div className="p-3.5 rounded-lg bg-black/50 border border-white/[0.06] text-xs font-mono text-zinc-400 space-y-1">
                  <div>Status: {firebaseStatus.mode}</div>
                  <div>Firestore Rules: ABAC Zero-Trust Ready</div>
                  <div>Stored Inquiries: {inquiries.length} records in local storage</div>
                  <div>Stored Projects: {projects.length} records in local storage</div>
                </div>

                <div className="text-xs text-zinc-400 leading-relaxed border-t border-white/[0.06] pt-3">
                  <p className="mb-2">
                    <strong>Note:</strong> When you connect your live Firebase project, set:
                  </p>
                  <pre className="bg-[#080604] p-3 rounded text-[11px] font-mono text-orange-400">
VITE_FIREBASE_PROJECT_ID="your-project-id"&#10;VITE_FIREBASE_API_KEY="your-api-key"
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
