import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Film,
  Mail,
  Sliders,
  Database,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  RotateCcw,
  ExternalLink,
  Save,
  Check,
  LogOut,
  ArrowLeft,
  KeyRound,
  Sparkles,
  Smartphone,
  Compass,
  Video,
  Download,
  Upload,
  MessageSquare,
  Search,
  Star,
  Eye,
  ChevronUp,
  ChevronDown,
  Layers,
  MessageSquareQuote,
  ShieldAlert,
  Send,
  HelpCircle,
  Copy,
  Info
} from 'lucide-react';
import { Project, Inquiry, SiteConfig, ProjectCategory, Service, Testimonial, AdminSession } from '../../types';
import { storage } from '../../lib/storage';
import { auth, DEFAULT_ADMIN_CREDENTIALS } from '../../lib/auth';
import { checkApiStatus, projectsApi, servicesApi, testimonialsApi, inquiriesApi, configApi, type ApiStatus } from '../../lib/api';
import { AdminLogin } from './AdminLogin';
import { NavFontPicker } from '../../components/NavFontPicker';

interface AdminPageProps {
  onNavigateToHome: () => void;
}

// Available high-resolution image presets generated for this studio
const AVAILABLE_ASSET_PRESETS = [
  { label: 'Cyberpunk Tokyo Reel (9:16)', path: '/src/assets/images/reel_cyberpunk_tokyo_1790324913367.jpg' },
  { label: 'Amalfi Coast Travel (9:16)', path: '/src/assets/images/reel_travel_amalfi_1790324936716.jpg' },
  { label: 'Beat-Sync Dancer Reel (9:16)', path: '/src/assets/images/reel_beat_sync_dancer_1790324955727.jpg' },
  { label: 'Night & Day Split Reel (9:16)', path: '/src/assets/images/reel_night_day_split_1790324973916.jpg' },
  { label: 'Studio Hero Portrait (16:9)', path: '/src/assets/images/hero_cinematic_director_1790323945101.jpg' },
  { label: 'Showreel Film Cover (16:9)', path: '/src/assets/images/showreel_cinematic_cover_1790323962781.jpg' },
  { label: 'Iceland Travel Film (16:9)', path: '/src/assets/images/project_travel_iceland_1790323980688.jpg' },
  { label: 'Hypercar Commercial (16:9)', path: '/src/assets/images/project_commercial_hypercar_1790323997509.jpg' },
  { label: 'Wedding Highlights (16:9)', path: '/src/assets/images/project_wedding_highlights_1790324012801.jpg' },
];

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateToHome }) => {
  const [session, setSession] = useState<AdminSession | null>(auth.getSession());
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'inquiries' | 'services' | 'testimonials' | 'settings' | 'security' | 'data'>('overview');

  // State data
  const [projects, setProjects] = useState<Project[]>(storage.getProjects());
  const [inquiries, setInquiries] = useState<Inquiry[]>(storage.getInquiries());
  const [services, setServices] = useState<Service[]>(storage.getServices());
  const [testimonials, setTestimonials] = useState<Testimonial[]>(storage.getTestimonials());
  const [config, setConfig] = useState<SiteConfig>(storage.getConfig());

  // Notice toast
  const [notice, setNotice] = useState<string | null>(null);

  // Search & Filter
  const [projectSearch, setProjectSearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');
  const [inquirySearch, setInquirySearch] = useState('');

  // Modals & drawers for Editing
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isCreatingService, setIsCreatingService] = useState(false);

  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isCreatingTestimonial, setIsCreatingTestimonial] = useState(false);

  // Forms
  const [siteForm, setSiteForm] = useState<SiteConfig>(config);

  // Security Form (Change Password)
  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState(session?.email || DEFAULT_ADMIN_CREDENTIALS.email);
  const [newUsername, setNewUsername] = useState(session?.username || DEFAULT_ADMIN_CREDENTIALS.username);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [securityError, setSecurityError] = useState<string | null>(null);

  // Import JSON input
  const [importJsonText, setImportJsonText] = useState('');

  // MongoDB Atlas sync state
  const [mongoStatus, setMongoStatus] = useState<ApiStatus | null>(null);
  const [mongoSyncing, setMongoSyncing] = useState(false);
  const [mongoSyncLog, setMongoSyncLog] = useState<string[]>([]);
  const [mongoPulling, setMongoPulling] = useState(false);

  // Keep state synced with events
  useEffect(() => {
    const handleAuthChange = () => setSession(auth.getSession());
    const handleProjectsUpdate = () => setProjects(storage.getProjects());
    const handleInquiriesUpdate = () => setInquiries(storage.getInquiries());
    const handleServicesUpdate = () => setServices(storage.getServices());
    const handleTestimonialsUpdate = () => setTestimonials(storage.getTestimonials());
    const handleConfigUpdate = () => {
      const updated = storage.getConfig();
      setConfig(updated);
      setSiteForm(updated);
    };

    window.addEventListener('portfolio_auth_changed', handleAuthChange);
    window.addEventListener('portfolio_projects_updated', handleProjectsUpdate);
    window.addEventListener('portfolio_inquiries_updated', handleInquiriesUpdate);
    window.addEventListener('portfolio_services_updated', handleServicesUpdate);
    window.addEventListener('portfolio_testimonials_updated', handleTestimonialsUpdate);
    window.addEventListener('portfolio_config_updated', handleConfigUpdate);

    return () => {
      window.removeEventListener('portfolio_auth_changed', handleAuthChange);
      window.removeEventListener('portfolio_projects_updated', handleProjectsUpdate);
      window.removeEventListener('portfolio_inquiries_updated', handleInquiriesUpdate);
      window.removeEventListener('portfolio_services_updated', handleServicesUpdate);
      window.removeEventListener('portfolio_testimonials_updated', handleTestimonialsUpdate);
      window.removeEventListener('portfolio_config_updated', handleConfigUpdate);
    };
  }, []);

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // ── MongoDB Atlas Sync Functions ──────────────────────────────────────────

  const checkMongoStatus = async () => {
    const status = await checkApiStatus();
    setMongoStatus(status);
    return status;
  };

  // Push all localStorage data → MongoDB Atlas
  const handleSyncToMongo = async () => {
    setMongoSyncing(true);
    const log: string[] = [];
    try {
      const status = await checkMongoStatus();
      if (!status.online) {
        log.push('❌ API server offline. Start the server with: npm run server');
        setMongoSyncLog(log);
        setMongoSyncing(false);
        return;
      }
      if (status.db !== 'connected') {
        log.push('❌ MongoDB Atlas not connected. Check MONGODB_URI in .env');
        setMongoSyncLog(log);
        setMongoSyncing(false);
        return;
      }

      log.push('⬆️  Syncing projects...');
      setMongoSyncLog([...log]);
      const projResult = await projectsApi.bulkSync(storage.getProjects());
      log.push(`✅ Projects synced (${projResult.synced} records)`);

      log.push('⬆️  Syncing services...');
      setMongoSyncLog([...log]);
      const svcResult = await servicesApi.bulkSync(storage.getServices());
      log.push(`✅ Services synced (${svcResult.synced} records)`);

      log.push('⬆️  Syncing testimonials...');
      setMongoSyncLog([...log]);
      const tesResult = await testimonialsApi.bulkSync(storage.getTestimonials());
      log.push(`✅ Testimonials synced (${tesResult.synced} records)`);

      log.push('⬆️  Syncing inquiries...');
      setMongoSyncLog([...log]);
      const inqResult = await inquiriesApi.bulkSync(storage.getInquiries());
      log.push(`✅ Inquiries synced (${inqResult.synced} records)`);

      log.push('⬆️  Syncing site config...');
      setMongoSyncLog([...log]);
      await configApi.update(storage.getConfig());
      log.push('✅ Site config synced');

      log.push('🎉 All data pushed to MongoDB Atlas successfully!');
      showNotification('✅ All data synced to MongoDB Atlas');
    } catch (err: any) {
      log.push(`❌ Error: ${err.message}`);
      showNotification('Sync failed — check console');
    }
    setMongoSyncLog([...log]);
    setMongoSyncing(false);
  };

  // Pull all data from MongoDB Atlas → localStorage
  const handlePullFromMongo = async () => {
    if (!confirm('Pull all data from MongoDB Atlas? This will overwrite your local data.')) return;
    setMongoPulling(true);
    const log: string[] = [];
    try {
      const status = await checkMongoStatus();
      if (!status.online || status.db !== 'connected') {
        log.push('❌ Cannot pull — API server offline or MongoDB not connected');
        setMongoSyncLog([...log]);
        setMongoPulling(false);
        return;
      }

      log.push('⬇️  Fetching projects from Atlas...');
      setMongoSyncLog([...log]);
      const mongoProjects = await projectsApi.getAll();
      if (mongoProjects.length > 0) {
        storage.saveProjects(mongoProjects);
        setProjects(mongoProjects);
        log.push(`✅ Projects pulled (${mongoProjects.length} records)`);
      } else {
        log.push('ℹ️  No projects found in Atlas');
      }

      log.push('⬇️  Fetching services from Atlas...');
      setMongoSyncLog([...log]);
      const mongoServices = await servicesApi.getAll();
      if (mongoServices.length > 0) {
        storage.saveServices(mongoServices);
        setServices(mongoServices);
        log.push(`✅ Services pulled (${mongoServices.length} records)`);
      } else {
        log.push('ℹ️  No services found in Atlas');
      }

      log.push('⬇️  Fetching testimonials from Atlas...');
      setMongoSyncLog([...log]);
      const mongoTestimonials = await testimonialsApi.getAll();
      if (mongoTestimonials.length > 0) {
        storage.saveTestimonials(mongoTestimonials);
        setTestimonials(mongoTestimonials);
        log.push(`✅ Testimonials pulled (${mongoTestimonials.length} records)`);
      } else {
        log.push('ℹ️  No testimonials found in Atlas');
      }

      log.push('⬇️  Fetching site config from Atlas...');
      setMongoSyncLog([...log]);
      const mongoConfig = await configApi.get();
      if (mongoConfig) {
        storage.saveConfig(mongoConfig);
        setConfig(mongoConfig);
        setSiteForm(mongoConfig);
        log.push('✅ Site config pulled');
      } else {
        log.push('ℹ️  No config found in Atlas');
      }

      log.push('🎉 All data pulled from MongoDB Atlas!');
      showNotification('✅ Data pulled from MongoDB Atlas');
    } catch (err: any) {
      log.push(`❌ Pull error: ${err.message}`);
    }
    setMongoSyncLog([...log]);
    setMongoPulling(false);
  };

  // If not authenticated, render Login Page
  if (!session) {
    return (
      <AdminLogin
        onLoginSuccess={() => {
          setSession(auth.getSession());
          showNotification('Logged in successfully');
        }}
        onBackToSite={onNavigateToHome}
      />
    );
  }

  // Handle Logout
  const handleLogout = () => {
    if (confirm('Sign out of Studio Admin?')) {
      auth.logout();
      setSession(null);
    }
  };

  // Site Config Save
  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    storage.saveConfig(siteForm);
    setConfig(siteForm);
    showNotification('Brand & Site settings updated');
  };

  // Password / Credentials change
  const handleUpdateCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityError(null);

    if (newPassword && newPassword.length < 6) {
      setSecurityError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setSecurityError('New passwords do not match.');
      return;
    }

    const result = auth.updateCredentials(
      currentPassword,
      newEmail,
      newUsername,
      newPassword || undefined
    );

    if (result.success) {
      showNotification('Admin credentials updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSession(auth.getSession());
    } else {
      setSecurityError(result.error || 'Failed to update credentials.');
    }
  };

  // Reset to default credentials
  const handleResetCredentials = () => {
    if (confirm('Reset admin credentials back to default (admin@kaienvance.com / cinema@2025)?')) {
      auth.resetToDefaultCredentials();
      setNewEmail(DEFAULT_ADMIN_CREDENTIALS.email);
      setNewUsername(DEFAULT_ADMIN_CREDENTIALS.username);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showNotification('Credentials reset to defaults');
    }
  };

  // Projects CRUD
  const handleSaveProject = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const category = formData.get('category') as ProjectCategory;
    const techniquesStr = (formData.get('editingTechniques') as string) || '';
    const toolsStr = (formData.get('toolsUsed') as string) || '';
    const deliverablesStr = (formData.get('deliverables') as string) || '';

    const newProjectData: Project = {
      id: editingProject ? editingProject.id : `proj-${Date.now()}`,
      title: (formData.get('title') as string) || 'Untitled Edit',
      category: category || 'reels',
      categoryLabel: (formData.get('categoryLabel') as string) || 'Instagram Reel',
      year: (formData.get('year') as string) || new Date().getFullYear().toString(),
      client: (formData.get('client') as string) || undefined,
      duration: (formData.get('duration') as string) || '00:30',
      thumbnail: (formData.get('thumbnail') as string) || AVAILABLE_ASSET_PRESETS[0].path,
      videoUrl: (formData.get('videoUrl') as string) || undefined,
      aspectRatio: (formData.get('aspectRatio') as any) || '9:16',
      overview: (formData.get('overview') as string) || '',
      role: (formData.get('role') as string) || 'Lead Editor & Colorist',
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
    setProjects(updatedProjects);
    setEditingProject(null);
    setIsCreatingProject(false);
    showNotification(editingProject ? 'Project updated' : 'New project added');
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Delete this project edit from the portfolio?')) {
      const updated = projects.filter((p) => p.id !== id);
      storage.saveProjects(updated);
      setProjects(updated);
      showNotification('Project deleted');
    }
  };

  const handleToggleFeatured = (id: string) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p));
    storage.saveProjects(updated);
    setProjects(updated);
  };

  const handleMoveProject = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;
    const copy = [...projects];
    const temp = copy[index];
    copy[index] = copy[targetIndex];
    copy[targetIndex] = temp;
    storage.saveProjects(copy);
    setProjects(copy);
  };

  // Inquiries CRUD
  const handleUpdateInquiryStatus = (id: string, status: Inquiry['status']) => {
    storage.updateInquiryStatus(id, status);
  };

  const handleSaveInquiryNotes = (id: string, notes: string) => {
    storage.updateInquiryNotes(id, notes);
    showNotification('Inquiry notes saved');
  };

  const handleDeleteInquiry = (id: string) => {
    if (confirm('Delete this client inquiry record?')) {
      storage.deleteInquiry(id);
      showNotification('Inquiry removed');
    }
  };

  const handleExportInquiriesCSV = () => {
    if (inquiries.length === 0) {
      alert('No inquiries to export.');
      return;
    }
    const headers = ['ID', 'Date', 'Status', 'Name', 'Email', 'WhatsApp', 'Type', 'Budget', 'Delivery Date', 'Description', 'Reference'];
    const rows = inquiries.map((i) => [
      i.id,
      i.createdAt,
      i.status,
      `"${i.fullName.replace(/"/g, '""')}"`,
      `"${i.email}"`,
      `"${i.whatsappNumber || ''}"`,
      `"${i.projectType}"`,
      `"${i.estimatedBudget || ''}"`,
      `"${i.preferredDeliveryDate || ''}"`,
      `"${i.projectDescription.replace(/"/g, '""')}"`,
      `"${i.referenceLink || ''}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kaien_vance_inquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Services CRUD
  const handleSaveService = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const featuresStr = (formData.get('features') as string) || '';

    const newService: Service = {
      id: editingService ? editingService.id : `srv-${Date.now()}`,
      number: (formData.get('number') as string) || '01',
      title: (formData.get('title') as string) || 'New Service',
      shortDesc: (formData.get('shortDesc') as string) || '',
      features: featuresStr.split('\n').map((s) => s.trim()).filter(Boolean),
      icon: (formData.get('icon') as string) || 'Sparkles',
      deliverableTimeframe: (formData.get('deliverableTimeframe') as string) || '24-48 hours',
      pricingStartingAt: (formData.get('pricingStartingAt') as string) || undefined,
    };

    let updated: Service[];
    if (editingService) {
      updated = services.map((s) => (s.id === editingService.id ? newService : s));
    } else {
      updated = [...services, newService];
    }

    storage.saveServices(updated);
    setServices(updated);
    setEditingService(null);
    setIsCreatingService(false);
    showNotification(editingService ? 'Service updated' : 'New service created');
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Delete this service offering?')) {
      const updated = services.filter((s) => s.id !== id);
      storage.saveServices(updated);
      setServices(updated);
      showNotification('Service removed');
    }
  };

  // Testimonials CRUD
  const handleSaveTestimonial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newTest: Testimonial = {
      id: editingTestimonial ? editingTestimonial.id : `test-${Date.now()}`,
      clientName: (formData.get('clientName') as string) || 'Client',
      role: (formData.get('role') as string) || 'Creator',
      company: (formData.get('company') as string) || undefined,
      projectType: (formData.get('projectType') as string) || 'Instagram Reel',
      feedback: (formData.get('feedback') as string) || '',
      rating: Number(formData.get('rating')) || 5,
      isDemo: formData.get('isDemo') === 'on',
    };

    let updated: Testimonial[];
    if (editingTestimonial) {
      updated = testimonials.map((t) => (t.id === editingTestimonial.id ? newTest : t));
    } else {
      updated = [newTest, ...testimonials];
    }

    storage.saveTestimonials(updated);
    setTestimonials(updated);
    setEditingTestimonial(null);
    setIsCreatingTestimonial(false);
    showNotification(editingTestimonial ? 'Testimonial updated' : 'New testimonial added');
  };

  const handleDeleteTestimonial = (id: string) => {
    if (confirm('Delete this testimonial?')) {
      const updated = testimonials.filter((t) => t.id !== id);
      storage.saveTestimonials(updated);
      setTestimonials(updated);
      showNotification('Testimonial removed');
    }
  };

  // Data Export & Import
  const handleExportJSON = () => {
    const jsonStr = storage.exportAllData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showNotification('Backup JSON exported');
  };

  const handleImportJSON = () => {
    if (!importJsonText.trim()) return;
    const res = storage.importAllData(importJsonText);
    if (res.success) {
      showNotification('Data successfully restored!');
      setImportJsonText('');
      setProjects(storage.getProjects());
      setServices(storage.getServices());
      setTestimonials(storage.getTestimonials());
      setInquiries(storage.getInquiries());
      setConfig(storage.getConfig());
    } else {
      alert(`Import failed: ${res.error}`);
    }
  };

  const handleResetAllToDemo = () => {
    if (confirm('Reset entire portfolio database (projects, services, testimonials, settings) to sample demo defaults?')) {
      storage.resetAllData();
      showNotification('Reset all data to defaults');
    }
  };

  // Filtered lists
  const filteredProjects = projects.filter((p) => {
    const q = projectSearch.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q) || (p.client && p.client.toLowerCase().includes(q));
  });

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesStatus = inquiryStatusFilter === 'all' || inq.status === inquiryStatusFilter;
    const q = inquirySearch.toLowerCase();
    const matchesSearch = inq.fullName.toLowerCase().includes(q) || inq.email.toLowerCase().includes(q) || inq.projectType.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-[#f4f4f5] flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0f0f14]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateToHome}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Return to public portfolio"
          >
            <ArrowLeft className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Portfolio Site</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-display font-bold uppercase tracking-wider text-white text-sm sm:text-base">
              {config.editorName}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-500/20 font-semibold uppercase">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Right Session & Actions */}
        <div className="flex items-center gap-3">
          {notice && (
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              <span>{notice}</span>
            </div>
          )}

          {/* Navbar Font Switcher Button (Admin Only) */}
          <NavFontPicker variant="button" />

          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium text-white">{session.email}</div>
            <div className="text-[10px] font-mono text-zinc-500">Administrator</div>
          </div>

          <button
            onClick={onNavigateToHome}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">View Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-xs font-medium text-red-300 hover:text-red-200 transition-colors cursor-pointer"
            title="Sign out of Admin Portal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#0c0c10] border-b md:border-b-0 md:border-r border-white/[0.06] p-3 sm:p-4 shrink-0 overflow-x-auto md:overflow-x-visible">
          <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: null },
              { id: 'projects', label: 'Projects & Edits', icon: Film, badge: projects.length },
              { id: 'inquiries', label: 'Inquiries CRM', icon: Mail, badge: inquiries.filter((i) => i.status === 'new').length, badgeColor: 'bg-amber-400 text-black' },
              { id: 'services', label: 'Services', icon: Layers, badge: services.length },
              { id: 'testimonials', label: 'Testimonials', icon: MessageSquareQuote, badge: testimonials.length },
              { id: 'settings', label: 'Site & Brand', icon: Sliders, badge: null },
              { id: 'security', label: 'Login & Password', icon: KeyRound, badge: null },
              { id: 'data', label: 'Data & Backup', icon: Database, badge: null },
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
                    setEditingService(null);
                    setIsCreatingService(false);
                    setEditingTestimonial(null);
                    setIsCreatingTestimonial(false);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-400/15 text-amber-400 font-semibold border border-amber-500/20'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge !== null && tab.badge > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                        tab.badgeColor || 'bg-white/10 text-zinc-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Creator Info Card in Sidebar */}
          <div className="hidden md:block mt-8 p-3.5 rounded-xl bg-[#14141a] border border-white/[0.06] text-xs space-y-2">
            <div className="font-bold text-white flex items-center justify-between">
              <span>Status</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <p className="text-[11px] text-zinc-400">
              {config.availableForProjects ? 'Available for bookings' : 'Currently booked out'}
            </p>
            <div className="text-[10px] font-mono text-zinc-500 truncate">
              {config.contactEmail}
            </div>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl overflow-y-auto">
          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h1 className="text-2xl font-bold font-display tracking-tight text-white">
                  Studio Control Center
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Manage all aspects of your freelance video editing brand, video portfolio, client bookings, and services.
                </p>
              </div>

              {/* 4 Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] relative overflow-hidden">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Showcase Edits
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-display text-white tabular-nums">
                      {projects.length}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      ({projects.filter((p) => p.featured).length} featured)
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-400">
                    <Film className="w-3.5 h-3.5" />
                    <span>Vertical & 16:9</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] relative overflow-hidden">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    New Inquiries
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-display text-amber-400 tabular-nums">
                      {inquiries.filter((i) => i.status === 'new').length}
                    </span>
                    <span className="text-xs text-zinc-500 font-mono">
                      / {inquiries.length} total
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span>Active client briefs</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] relative overflow-hidden">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Active Services
                  </span>
                  <span className="text-3xl font-bold font-display text-white tabular-nums">
                    {services.length}
                  </span>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Turnarounds & packages</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] relative overflow-hidden">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Testimonials
                  </span>
                  <span className="text-3xl font-bold font-display text-white tabular-nums">
                    {testimonials.length}
                  </span>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                    <Star className="w-3.5 h-3.5 text-amber-400" />
                    <span>Client reviews</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-6 rounded-2xl bg-[#121217] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-white font-display">
                    Quick Management Actions
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Add new video projects, configure services, review client briefs, or update passwords.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    onClick={() => {
                      setActiveTab('projects');
                      setIsCreatingProject(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Project</span>
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('services');
                      setIsCreatingService(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Service</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('security')}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                    <span>Change Password</span>
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Backup</span>
                  </button>
                </div>
              </div>

              {/* Recent Inquiries Snippet */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    Recent Client Inquiries
                  </h3>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-amber-400 hover:underline cursor-pointer"
                  >
                    Manage Inquiries ({inquiries.length}) →
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="p-8 text-center bg-[#121217] rounded-xl border border-white/[0.08] text-xs text-zinc-400">
                    No client inquiries received yet. Submissions from the public contact form appear here.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {inquiries.slice(0, 4).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-xl bg-[#121217] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white text-sm">{inq.fullName}</div>
                          <div className="text-zinc-400 mt-0.5">
                            {inq.email} &middot; <span className="text-amber-400 font-medium">{inq.projectType}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                            className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-zinc-300 cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="archived">Archived</option>
                          </select>

                          {inq.whatsappNumber && (
                            <a
                              href={`https://wa.me/${inq.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${inq.fullName}, this is Kaien Vance following up on your ${inq.projectType} edit inquiry!`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-[11px] transition-colors"
                            >
                              WhatsApp
                            </a>
                          )}

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

          {/* TAB 2: PROJECTS & EDITS SHOWCASE */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              {!isCreatingProject && !editingProject ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold font-display text-white">
                        Portfolio Edits Showcase
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Manage video clips, 9:16 vertical Reels, 16:9 cinematic edits, thumbnails, and technical metadata.
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                        <input
                          type="text"
                          value={projectSearch}
                          onChange={(e) => setProjectSearch(e.target.value)}
                          placeholder="Search edits..."
                          className="bg-[#121217] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <button
                        onClick={() => setIsCreatingProject(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Edit</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredProjects.map((proj, idx) => (
                      <div
                        key={proj.id}
                        className="p-4 rounded-xl bg-[#121217] border border-white/[0.08] hover:border-white/20 transition-colors flex gap-4 items-start justify-between group"
                      >
                        <div className="flex gap-3.5 min-w-0">
                          <div className="relative w-20 h-28 bg-black rounded-lg overflow-hidden shrink-0 border border-white/10">
                            <img
                              src={proj.thumbnail}
                              alt={proj.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1 py-0.2 rounded bg-black/80 text-white">
                              {proj.aspectRatio || '9:16'}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-bold text-white truncate font-display">
                                {proj.title}
                              </h3>
                              {proj.featured && (
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 uppercase">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-amber-400 font-medium mt-0.5">
                              {proj.categoryLabel}
                            </div>
                            <div className="text-[11px] text-zinc-400 mt-0.5">
                              {proj.year} &middot; {proj.duration}
                              {proj.client && ` &middot; Client: ${proj.client}`}
                            </div>
                            <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
                              {proj.overview}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveProject(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move Up"
                            >
                              <ChevronUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveProject(idx, 'down')}
                              disabled={idx === projects.length - 1}
                              className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 cursor-pointer"
                              title="Move Down"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleFeatured(proj.id)}
                              className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                proj.featured
                                  ? 'bg-amber-400/10 border-amber-400/30 text-amber-400'
                                  : 'bg-white/5 border-white/5 text-zinc-500 hover:text-zinc-300'
                              }`}
                              title={proj.featured ? 'Remove from featured' : 'Mark as featured'}
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProject(proj)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-amber-400 transition-colors cursor-pointer"
                              title="Edit Project"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-zinc-300 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete Project"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Edit / Create Form */
                <form onSubmit={handleSaveProject} className="space-y-5 bg-[#121217] p-6 rounded-2xl border border-white/[0.08]">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
                    <h3 className="text-base font-bold text-white font-display">
                      {editingProject ? `Edit Edit: ${editingProject.title}` : 'Add New Video Project'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setIsCreatingProject(false);
                      }}
                      className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Title
                      </label>
                      <input
                        name="title"
                        defaultValue={editingProject?.title || ''}
                        required
                        placeholder="e.g. Neo Tokyo &middot; Fast Cuts Reel"
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Category
                      </label>
                      <select
                        name="category"
                        defaultValue={editingProject?.category || 'reels'}
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      >
                        <option value="reels">Instagram Reels & Short-Form</option>
                        <option value="cinematic">Cinematic</option>
                        <option value="travel">Travel & Lifestyle</option>
                        <option value="beat-sync">Beat Sync & Sound Design</option>
                        <option value="transitions">Aesthetic Transitions</option>
                        <option value="night-day">Night & Day Edits</option>
                        <option value="lifestyle">Lifestyle</option>
                        <option value="music-edits">Music & Experimental</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Category Label
                      </label>
                      <input
                        name="categoryLabel"
                        defaultValue={editingProject?.categoryLabel || 'Instagram Reel'}
                        required
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Aspect Ratio
                      </label>
                      <select
                        name="aspectRatio"
                        defaultValue={editingProject?.aspectRatio || '9:16'}
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      >
                        <option value="9:16">9:16 (Vertical Mobile Reel)</option>
                        <option value="16:9">16:9 (Cinematic Horizontal)</option>
                        <option value="4:3">4:3 (Editorial Academy)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Duration (mm:ss)
                      </label>
                      <input
                        name="duration"
                        defaultValue={editingProject?.duration || '00:30'}
                        required
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Client or Brand (Optional)
                      </label>
                      <input
                        name="client"
                        defaultValue={editingProject?.client || ''}
                        placeholder="e.g. Red Bull, Zara, Independent Creator"
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Role
                      </label>
                      <input
                        name="role"
                        defaultValue={editingProject?.role || 'Lead Mobile Video Editor & Colorist'}
                        required
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* Thumbnail & Quick Preset Picker */}
                  <div className="space-y-2">
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Thumbnail Image Path or URL
                    </label>
                    <input
                      id="project-thumbnail-input"
                      name="thumbnail"
                      defaultValue={editingProject?.thumbnail || AVAILABLE_ASSET_PRESETS[0].path}
                      required
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                    />

                    {/* 1-Click Preset Asset Selector */}
                    <div>
                      <span className="text-[11px] font-mono text-zinc-400 block mb-1">
                        Or pick from studio visual assets (1-click):
                      </span>
                      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {AVAILABLE_ASSET_PRESETS.map((asset) => (
                          <button
                            type="button"
                            key={asset.path}
                            onClick={() => {
                              const input = document.getElementById('project-thumbnail-input') as HTMLInputElement;
                              if (input) input.value = asset.path;
                            }}
                            className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-amber-400/20 border border-white/10 text-[10px] font-mono text-zinc-300 hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            {asset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                      Video Stream or MP4 URL (Optional)
                    </label>
                    <input
                      name="videoUrl"
                      defaultValue={editingProject?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                      placeholder="https://... direct .mp4 or stream"
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                      Story & Overview Description
                    </label>
                    <textarea
                      name="overview"
                      rows={2}
                      defaultValue={editingProject?.overview || ''}
                      required
                      placeholder="Explain the narrative concept, the opening hook, and how the edit creates retention..."
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                      Creative & Color Approach
                    </label>
                    <textarea
                      name="creativeApproach"
                      rows={2}
                      defaultValue={editingProject?.creativeApproach || ''}
                      required
                      placeholder="Color palette, match cuts, sound layers, and pacing..."
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Editing Techniques (comma separated)
                      </label>
                      <input
                        name="editingTechniques"
                        defaultValue={editingProject?.editingTechniques?.join(', ') || 'Beat sync, Speed ramp, Film grain'}
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Tools Used (comma separated)
                      </label>
                      <input
                        name="toolsUsed"
                        defaultValue={editingProject?.toolsUsed?.join(', ') || 'DaVinci Resolve, Premiere Pro, CapCut Pro'}
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Deliverables (comma separated)
                      </label>
                      <input
                        name="deliverables"
                        defaultValue={editingProject?.deliverables?.join(', ') || '1080x1920 Master, 4K Master, Clean Feed'}
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      defaultChecked={editingProject ? editingProject.featured : true}
                      className="rounded border-white/20 bg-white/5 text-amber-500 w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-xs text-zinc-300 cursor-pointer">
                      Feature prominently in top gallery
                    </label>
                  </div>

                  <div className="pt-3 flex items-center gap-3 border-t border-white/[0.08]">
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                    >
                      {editingProject ? 'Save Changes' : 'Create Edit'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProject(null);
                        setIsCreatingProject(false);
                      }}
                      className="px-4 py-2.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 3: INQUIRIES CRM */}
          {activeTab === 'inquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold font-display text-white">
                    Client Inquiries & Briefs
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Proposals, timelines, references, and client contact details submitted through your portfolio.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      placeholder="Search briefs..."
                      className="bg-[#121217] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <select
                    value={inquiryStatusFilter}
                    onChange={(e) => setInquiryStatusFilter(e.target.value)}
                    className="bg-[#121217] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-300 cursor-pointer"
                  >
                    <option value="all">All Statuses ({inquiries.length})</option>
                    <option value="new">New ({inquiries.filter((i) => i.status === 'new').length})</option>
                    <option value="contacted">Contacted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="archived">Archived</option>
                  </select>

                  <button
                    onClick={handleExportInquiriesCSV}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV Export</span>
                  </button>
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="p-12 text-center bg-[#121217] rounded-2xl border border-white/[0.08] text-sm text-zinc-400">
                  No inquiries match the current filter.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                        <div>
                          <span className="text-base font-bold text-white mr-2">{inq.fullName}</span>
                          <a
                            href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.projectType} Editing Project`)}`}
                            className="text-xs text-amber-400 hover:underline font-mono"
                          >
                            {inq.email}
                          </a>
                          {inq.whatsappNumber && (
                            <span className="text-xs text-emerald-400 font-mono ml-2">
                              WA: {inq.whatsappNumber}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2.5">
                          <select
                            value={inq.status}
                            onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                            className="bg-black/60 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-zinc-300 cursor-pointer"
                          >
                            <option value="new">Status: New</option>
                            <option value="contacted">Status: Contacted</option>
                            <option value="in_progress">Status: In Progress</option>
                            <option value="completed">Status: Completed</option>
                            <option value="archived">Status: Archived</option>
                          </select>

                          {inq.whatsappNumber && (
                            <a
                              href={`https://wa.me/${inq.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi ${inq.fullName}, this is Kaien Vance following up on your ${inq.projectType} edit inquiry!`)}`}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold transition-colors"
                            >
                              <Send className="w-3 h-3" />
                              <span>WhatsApp</span>
                            </a>
                          )}

                          <a
                            href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.projectType} Editing Project`)}`}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 text-xs transition-colors"
                          >
                            <Mail className="w-3 h-3" />
                            <span>Email</span>
                          </a>

                          <button
                            onClick={() => handleDeleteInquiry(inq.id)}
                            className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Brief Metadata */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-zinc-500 block mb-0.5">Project Type</span>
                          <span className="text-amber-400 font-semibold">{inq.projectType}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block mb-0.5">Estimated Budget</span>
                          <span className="text-zinc-200">{inq.estimatedBudget || 'Flexible'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block mb-0.5">Delivery Target</span>
                          <span className="text-zinc-200">{inq.preferredDeliveryDate || 'Flexible'}</span>
                        </div>
                        <div>
                          <span className="text-zinc-500 block mb-0.5">Submitted On</span>
                          <span className="text-zinc-400 font-mono text-[11px]">
                            {new Date(inq.createdAt).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Client Brief Body */}
                      <div className="text-xs sm:text-sm text-zinc-300 bg-black/40 p-3.5 rounded-xl border border-white/[0.04] leading-relaxed">
                        {inq.projectDescription}
                      </div>

                      {/* Reference link */}
                      {inq.referenceLink && (
                        <div className="text-xs flex items-center gap-2 text-zinc-400">
                          <span className="text-zinc-500">Reference:</span>
                          <a
                            href={inq.referenceLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-amber-400 hover:underline flex items-center gap-1 font-mono truncate max-w-lg"
                          >
                            <span>{inq.referenceLink}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      )}

                      {/* Admin Internal Notes */}
                      <div className="pt-2 border-t border-white/[0.04]">
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          Admin Internal Notes (Saved locally)
                        </label>
                        <textarea
                          rows={1}
                          defaultValue={inq.adminNotes || ''}
                          onBlur={(e) => handleSaveInquiryNotes(inq.id, e.target.value)}
                          placeholder="Jot notes regarding footage delivery, revisions, negotiation..."
                          className="w-full bg-[#181820] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 resize-y"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SERVICES MANAGEMENT */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              {!isCreatingService && !editingService ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold font-display text-white">
                        Services & Editing Packages
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Define the services visitors see in the "What I edit" homepage section.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsCreatingService(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-mono text-amber-400 font-bold">{srv.number}</span>
                            <h3 className="text-base font-bold font-display text-white mt-0.5">{srv.title}</h3>
                            {srv.pricingStartingAt && (
                              <span className="text-xs text-emerald-400 font-mono">From {srv.pricingStartingAt}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingService(srv)}
                              className="p-1.5 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                              title="Edit Service"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(srv.id)}
                              className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                              title="Delete Service"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {srv.shortDesc}
                        </p>

                        <div className="space-y-1 pt-2 border-t border-white/[0.06]">
                          {srv.features.map((feat, i) => (
                            <div key={i} className="text-xs text-zinc-300 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>

                        {srv.deliverableTimeframe && (
                          <div className="text-[11px] font-mono text-zinc-500 pt-1">
                            Turnaround: {srv.deliverableTimeframe}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Edit Service Form */
                <form onSubmit={handleSaveService} className="space-y-4 bg-[#121217] p-6 rounded-2xl border border-white/[0.08]">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <h3 className="text-base font-bold text-white font-display">
                      {editingService ? `Edit Service: ${editingService.title}` : 'Add New Service'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingService(null);
                        setIsCreatingService(false);
                      }}
                      className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                        Service Number
                      </label>
                      <input
                        name="number"
                        defaultValue={editingService?.number || `0${services.length + 1}`}
                        required
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                        Service Title
                      </label>
                      <input
                        name="title"
                        defaultValue={editingService?.title || ''}
                        required
                        placeholder="e.g. Cinematic Reels"
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                        Turnaround Timeframe
                      </label>
                      <input
                        name="deliverableTimeframe"
                        defaultValue={editingService?.deliverableTimeframe || '24-48 hours'}
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                        Starting Price (Optional)
                      </label>
                      <input
                        name="pricingStartingAt"
                        defaultValue={editingService?.pricingStartingAt || ''}
                        placeholder="e.g. $350 / reel"
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                      Short Description
                    </label>
                    <textarea
                      name="shortDesc"
                      rows={2}
                      defaultValue={editingService?.shortDesc || ''}
                      required
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-y"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                      Deliverables / Features (One per line)
                    </label>
                    <textarea
                      name="features"
                      rows={4}
                      defaultValue={editingService?.features?.join('\n') || ''}
                      required
                      placeholder="Story-driven narrative arc in under 60s&#10;Filmic color grading & print film emulation&#10;Sub-frame music synchronization"
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-y font-mono"
                    />
                  </div>

                  <div className="pt-3 flex items-center gap-3 border-t border-white/[0.08]">
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                    >
                      Save Service
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingService(null);
                        setIsCreatingService(false);
                      }}
                      className="px-4 py-2.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 5: TESTIMONIALS */}
          {activeTab === 'testimonials' && (
            <div className="space-y-6">
              {!isCreatingTestimonial && !editingTestimonial ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold font-display text-white">
                        Client Testimonials
                      </h2>
                      <p className="text-xs text-zinc-400 mt-0.5">
                        Manage client endorsements, ratings, and quotes displayed on the portfolio.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsCreatingTestimonial(true)}
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Testimonial</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map((test) => (
                      <div
                        key={test.id}
                        className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-white text-sm font-display">
                              {test.clientName}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingTestimonial(test)}
                                className="p-1.5 text-zinc-400 hover:text-amber-400 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTestimonial(test.id)}
                                className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs text-amber-400 mt-0.5">
                            {test.role} {test.company && `&middot; ${test.company}`}
                          </div>

                          <p className="text-xs sm:text-sm text-zinc-300 italic mt-3 leading-relaxed">
                            "{test.feedback}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                          <span className="text-zinc-500 font-mono">{test.projectType}</span>
                          {test.isDemo && (
                            <span className="text-[10px] font-mono text-amber-400/80 uppercase">
                              Demo Placeholder
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                /* Edit Testimonial Form */
                <form onSubmit={handleSaveTestimonial} className="space-y-4 bg-[#121217] p-6 rounded-2xl border border-white/[0.08]">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <h3 className="text-base font-bold text-white font-display">
                      {editingTestimonial ? `Edit Testimonial: ${editingTestimonial.clientName}` : 'Add Testimonial'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTestimonial(null);
                        setIsCreatingTestimonial(false);
                      }}
                      className="text-xs text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                        Client Name
                      </label>
                      <input
                        name="clientName"
                        defaultValue={editingTestimonial?.clientName || ''}
                        required
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                        Role / Title
                      </label>
                      <input
                        name="role"
                        defaultValue={editingTestimonial?.role || 'Creator & Director'}
                        required
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                        Company or Channel (Optional)
                      </label>
                      <input
                        name="company"
                        defaultValue={editingTestimonial?.company || ''}
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                        Project Type
                      </label>
                      <input
                        name="projectType"
                        defaultValue={editingTestimonial?.projectType || 'Instagram Reels Series'}
                        required
                        className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1">
                      Feedback / Review Quote
                    </label>
                    <textarea
                      name="feedback"
                      rows={3}
                      defaultValue={editingTestimonial?.feedback || ''}
                      required
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-y"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isDemo"
                      name="isDemo"
                      defaultChecked={editingTestimonial?.isDemo}
                      className="rounded border-white/20 bg-white/5 text-amber-500 w-4 h-4"
                    />
                    <label htmlFor="isDemo" className="text-xs text-zinc-300 cursor-pointer">
                      Mark as sample placeholder
                    </label>
                  </div>

                  <div className="pt-3 flex items-center gap-3 border-t border-white/[0.08]">
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer"
                    >
                      Save Testimonial
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingTestimonial(null);
                        setIsCreatingTestimonial(false);
                      }}
                      className="px-4 py-2.5 text-xs text-zinc-400 hover:text-white cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 6: SITE & BRAND SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveConfig} className="space-y-6 max-w-4xl bg-[#121217] p-6 sm:p-8 rounded-2xl border border-white/[0.08]">
              <div>
                <h2 className="text-xl font-bold font-display text-white">
                  Brand, Showreel & Contact Settings
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Update creator identity, availability status, showreel video stream, and contact channels.
                </p>
              </div>

              {/* Creator Name & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Editor Name
                  </label>
                  <input
                    value={siteForm.editorName}
                    onChange={(e) => setSiteForm({ ...siteForm, editorName: e.target.value })}
                    required
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Tagline
                  </label>
                  <input
                    value={siteForm.tagline}
                    onChange={(e) => setSiteForm({ ...siteForm, tagline: e.target.value })}
                    required
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Availability Toggle */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Availability Status</span>
                  <span className="text-[11px] text-zinc-400">Controls the pulsating green badge on the navbar</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteForm.availableForProjects}
                    onChange={(e) => setSiteForm({ ...siteForm, availableForProjects: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-400"></div>
                </label>
              </div>

              {/* Navbar Typography Settings */}
              <NavFontPicker variant="card" />

              {/* Biography & Philosophy */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                  Short Biography
                </label>
                <textarea
                  value={siteForm.shortBio}
                  onChange={(e) => setSiteForm({ ...siteForm, shortBio: e.target.value })}
                  rows={2}
                  className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white resize-y"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Creative Philosophy
                  </label>
                  <textarea
                    value={siteForm.aboutPhilosophy}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutPhilosophy: e.target.value })}
                    rows={2}
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white resize-y"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Editing Approach
                  </label>
                  <textarea
                    value={siteForm.aboutApproach}
                    onChange={(e) => setSiteForm({ ...siteForm, aboutApproach: e.target.value })}
                    rows={2}
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white resize-y"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={siteForm.contactEmail}
                    onChange={(e) => setSiteForm({ ...siteForm, contactEmail: e.target.value })}
                    required
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    WhatsApp Number (wa.me)
                  </label>
                  <input
                    value={siteForm.whatsappNumber}
                    onChange={(e) => setSiteForm({ ...siteForm, whatsappNumber: e.target.value })}
                    placeholder="+1 (555) 234-5678"
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Location
                  </label>
                  <input
                    value={siteForm.location}
                    onChange={(e) => setSiteForm({ ...siteForm, location: e.target.value })}
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Showreel Section Settings */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-4">
                <span className="text-xs font-bold font-mono uppercase text-amber-400 block">
                  Showreel Player Configuration
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Showreel Title</label>
                    <input
                      value={siteForm.showreelTitle}
                      onChange={(e) => setSiteForm({ ...siteForm, showreelTitle: e.target.value })}
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Duration</label>
                    <input
                      value={siteForm.showreelDuration}
                      onChange={(e) => setSiteForm({ ...siteForm, showreelDuration: e.target.value })}
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Video MP4 URL</label>
                  <input
                    value={siteForm.showreelVideoUrl}
                    onChange={(e) => setSiteForm({ ...siteForm, showreelVideoUrl: e.target.value })}
                    className="w-full bg-[#181820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-amber-500/10"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Brand Settings</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 7: SECURITY & CREDENTIALS (SEPARATE LOGIN & PASSWORD) */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold font-display text-white">
                  Admin Credentials & Password
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Update your dedicated admin login email, username, and password.
                </p>
              </div>

              {/* Current Credentials Overview */}
              <div className="p-5 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-zinc-400">Current Login Session</span>
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Authenticated</span>
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono text-zinc-300 bg-black/40 p-3.5 rounded-xl border border-white/[0.04]">
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Active User</span>
                    <span>{session.username}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase">Active Email</span>
                    <span>{session.email}</span>
                  </div>
                </div>
              </div>

              {/* Change Password Form */}
              <form onSubmit={handleUpdateCredentials} className="p-6 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white font-display">
                  Update Login Email & Password
                </h3>

                {securityError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs">
                    {securityError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                      Admin Email
                    </label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      required
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                      Username
                    </label>
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      required
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                      New Password (Optional)
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Leave blank to keep current"
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full bg-[#181820] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-amber-400 mb-1.5">
                    Current Password (Required for verification)
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter existing password to verify"
                    className="w-full bg-[#181820] border border-amber-500/30 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors cursor-pointer shadow-lg shadow-amber-500/10"
                  >
                    Update Admin Credentials
                  </button>

                  <button
                    type="button"
                    onClick={handleResetCredentials}
                    className="text-xs text-zinc-500 hover:text-zinc-300 underline cursor-pointer"
                  >
                    Reset to default credentials
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 8: DATA BACKUP & RESTORE + MONGODB ATLAS SYNC */}
          {activeTab === 'data' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <Database className="w-5 h-5 text-amber-400" />
                  MongoDB Atlas &amp; Data Management
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Sync your portfolio data with MongoDB Atlas, export JSON backups, or restore from a previous snapshot.
                </p>
              </div>

              {/* ── MongoDB Atlas Sync Card ── */}
              <div className="p-6 rounded-2xl bg-[#0d1117] border border-amber-500/20 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                    <Database className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">MongoDB Atlas Connection</h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">Configure MONGODB_URI in your .env file to enable cloud persistence.</p>
                  </div>
                  {/* Status indicator */}
                  <div className="ml-auto flex items-center gap-2">
                    {mongoStatus === null ? (
                      <span className="text-[11px] text-zinc-500 font-mono">Not checked</span>
                    ) : mongoStatus.online && mongoStatus.db === 'connected' ? (
                      <>
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 font-semibold">Atlas Connected</span>
                      </>
                    ) : mongoStatus.online ? (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
                        <span className="text-[11px] font-mono text-yellow-400">API Online · DB Offline</span>
                      </>
                    ) : (
                      <>
                        <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                        <span className="text-[11px] font-mono text-red-400">API Offline</span>
                      </>
                    )}
                    <button
                      onClick={checkMongoStatus}
                      className="px-3 py-1.5 text-[11px] font-mono bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 rounded-lg cursor-pointer transition-colors"
                    >
                      Check Status
                    </button>
                  </div>
                </div>

                {/* Setup instructions */}
                {(!mongoStatus || !mongoStatus.mongoConfigured) && (
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15 space-y-2">
                    <p className="text-xs font-semibold text-amber-300">📋 Setup Guide</p>
                    <ol className="text-[11px] text-zinc-400 space-y-1.5 list-decimal list-inside font-mono">
                      <li>Go to <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">cloud.mongodb.com</a> and create a free cluster</li>
                      <li>Create a database user and whitelist your IP address (or 0.0.0.0/0 for dev)</li>
                      <li>Click <strong>Connect → Connect your application</strong> and copy the connection string</li>
                      <li>Add it to your <code className="bg-white/10 px-1 rounded">.env</code> file: <code className="bg-white/10 px-1 rounded">MONGODB_URI=mongodb+srv://...</code></li>
                      <li>In a new terminal, run: <code className="bg-white/10 px-1 rounded">npm run server</code></li>
                      <li>Click <strong>Check Status</strong> above to verify the connection</li>
                    </ol>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={handleSyncToMongo}
                    disabled={mongoSyncing || mongoPulling}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black text-xs font-bold rounded-xl cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    {mongoSyncing ? 'Syncing to Atlas...' : 'Push to MongoDB Atlas'}
                  </button>
                  <button
                    onClick={handlePullFromMongo}
                    disabled={mongoSyncing || mongoPulling}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-40 text-white text-xs font-medium rounded-xl border border-white/10 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {mongoPulling ? 'Pulling from Atlas...' : 'Pull from MongoDB Atlas'}
                  </button>
                </div>

                {/* Sync log */}
                {mongoSyncLog.length > 0 && (
                  <div className="p-3 rounded-xl bg-black/40 border border-white/8 font-mono">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-500">Sync Log</span>
                      <button
                        onClick={() => setMongoSyncLog([])}
                        className="text-[10px] text-zinc-600 hover:text-zinc-300 cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                    <div className="space-y-1 max-h-40 overflow-y-auto">
                      {mongoSyncLog.map((line, i) => (
                        <p key={i} className="text-[11px] text-zinc-300 leading-relaxed">{line}</p>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Backup Card */}
              <div className="p-6 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">Export Portfolio Data</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Download a single JSON file containing all projects, services, testimonials, inquiries, and settings.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJSON}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-black text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>
              </div>

              {/* Restore Card */}
              <div className="p-6 rounded-2xl bg-[#121217] border border-white/[0.08] space-y-3">
                <h3 className="text-base font-bold text-white font-display">Restore from JSON</h3>
                <p className="text-xs text-zinc-400">
                  Paste a previously exported portfolio JSON payload to restore all data:
                </p>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste JSON content here..."
                  className="w-full bg-[#181820] border border-white/10 rounded-xl p-3 text-xs text-white font-mono resize-y"
                />
                <button
                  onClick={handleImportJSON}
                  disabled={!importJsonText.trim()}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 text-white text-xs font-medium rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Restore Data</span>
                </button>
              </div>

              {/* Reset to Demo Defaults */}
              <div className="p-6 rounded-2xl bg-red-950/20 border border-red-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-red-300">Reset All to Initial Demo Samples</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Restores demo video projects, services, testimonials, and sample data.
                    </p>
                  </div>
                  <button
                    onClick={handleResetAllToDemo}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                  >
                    Reset All Data
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
