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
import { MultiSelectTagInput } from '../../components/admin/MultiSelectTagInput';

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

  // Category dropdown
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>(
    editingProject?.category || 'reels'
  );

  // ── Video Upload Overlay State ──────────────────────────────────────────
  const [videoUploadOverlay, setVideoUploadOverlay] = useState<{
    active: boolean;
    progress: number;
    phase: 'uploading' | 'processing' | 'done' | 'idle';
    blobUrl: string;
    fileName: string;
    fileSize: string;
  }>({ active: false, progress: 0, phase: 'idle', blobUrl: '', fileName: '', fileSize: '' });

  // ── Thumbnail Frame Extractor State ────────────────────────────────────
  const [thumbFramePicker, setThumbFramePicker] = useState<{
    open: boolean;
    videoSrc: string;
    currentTime: number;
    duration: number;
    capturedFrame: string;
  }>({ open: false, videoSrc: '', currentTime: 0, duration: 0, capturedFrame: '' });

  const thumbVideoRef = React.useRef<HTMLVideoElement>(null);
  const thumbCanvasRef = React.useRef<HTMLCanvasElement>(null);

  // Simulate file upload progress for video
  const handleVideoFileUpload = (file: File) => {
    const blobUrl = URL.createObjectURL(file);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    setVideoUploadOverlay({ active: true, progress: 0, phase: 'uploading', blobUrl, fileName: file.name, fileSize: `${sizeMB} MB` });

    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 12 + 3;
      if (prog >= 90) {
        clearInterval(interval);
        setVideoUploadOverlay(prev => ({ ...prev, progress: 90, phase: 'processing' }));
        setTimeout(() => {
          setVideoUploadOverlay(prev => ({ ...prev, progress: 100, phase: 'done' }));
          applyUploadedVideoUrl(blobUrl);
        }, 1200);
        return;
      }
      setVideoUploadOverlay(prev => ({ ...prev, progress: Math.min(prog, 89) }));
    }, 180);
  };

  // Route the completed upload blob URL to the right input
  const applyUploadedVideoUrl = (blobUrl: string) => {
    if ((window as any).__showreelUpload) {
      delete (window as any).__showreelUpload;
      setSiteForm(prev => ({ ...prev, showreelVideoUrl: blobUrl }));
    } else {
      const input = document.getElementById('project-video-input') as HTMLInputElement;
      if (input) input.value = blobUrl;
    }
  };

  // Extract canvas frame from video scrubber
  const captureVideoFrame = () => {
    const video = thumbVideoRef.current;
    const canvas = thumbCanvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setThumbFramePicker(prev => ({ ...prev, capturedFrame: dataUrl }));
  };

  const applyFrameAsThumbnail = () => {
    const { capturedFrame } = thumbFramePicker;
    if (!capturedFrame) return;

    if ((window as any).__showreelFramePick) {
      // Route frame to showreel cover
      delete (window as any).__showreelFramePick;
      setSiteForm(prev => ({ ...prev, showreelCover: capturedFrame }));
      setThumbFramePicker(prev => ({ ...prev, open: false }));
      showNotification('✅ Video frame set as showreel cover!');
    } else {
      // Route frame to project thumbnail input
      const input = document.getElementById('project-thumbnail-input') as HTMLInputElement;
      if (input) input.value = capturedFrame;
      setThumbFramePicker(prev => ({ ...prev, open: false }));
      showNotification('✅ Video frame set as thumbnail!');
    }
  };

  const openFramePicker = (videoSrc: string) => {
    setThumbFramePicker({ open: true, videoSrc, currentTime: 0, duration: 0, capturedFrame: '' });
  };

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

  // Sync category dropdown when switching projects
  useEffect(() => {
    setSelectedCategory(editingProject?.category || 'reels');
    setCategoryDropdownOpen(false);
  }, [editingProject]);

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
    <div className="min-h-screen bg-[#080604] text-[#f4f4f5] flex flex-col font-sans selection:bg-orange-500 selection:text-black">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0e0b05]/95 backdrop-blur-xl border-b border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <button
            onClick={onNavigateToHome}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer"
            title="Return to public portfolio"
          >
            <ArrowLeft className="w-4 h-4 text-orange-500" />
            <span className="hidden sm:inline">Portfolio Site</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="flex items-center gap-2">
            <span className="font-display font-bold uppercase tracking-wider text-white text-sm sm:text-base">
              {config.editorName}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-500 border border-orange-600/20 font-semibold uppercase">
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
            <Eye className="w-3.5 h-3.5 text-orange-500" />
            <span className="hidden sm:inline">View Site</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-xs font-medium text-orange-300 hover:text-orange-200 transition-colors cursor-pointer"
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
        <aside className="w-full md:w-64 bg-[#0a0704] border-b md:border-b-0 md:border-r border-white/[0.06] p-3 sm:p-4 shrink-0 overflow-x-auto md:overflow-x-visible">
          <nav className="flex md:flex-col gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, badge: null },
              { id: 'projects', label: 'Projects & Edits', icon: Film, badge: projects.length },
              { id: 'inquiries', label: 'Inquiries CRM', icon: Mail, badge: inquiries.filter((i) => i.status === 'new').length, badgeColor: 'bg-orange-500 text-black' },
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
                      ? 'bg-orange-500/15 text-orange-500 font-semibold border border-orange-600/20'
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
          <div className="hidden md:block mt-8 p-3.5 rounded-xl bg-[#120d07] border border-white/[0.06] text-xs space-y-2">
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
                <div className="p-5 rounded-2xl bg-[#100c06] border border-white/[0.08] relative overflow-hidden">
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
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-orange-500">
                    <Film className="w-3.5 h-3.5" />
                    <span>Vertical & 16:9</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#100c06] border border-white/[0.08] relative overflow-hidden">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    New Inquiries
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold font-display text-orange-500 tabular-nums">
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

                <div className="p-5 rounded-2xl bg-[#100c06] border border-white/[0.08] relative overflow-hidden">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Active Services
                  </span>
                  <span className="text-3xl font-bold font-display text-white tabular-nums">
                    {services.length}
                  </span>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                    <Layers className="w-3.5 h-3.5 text-orange-500" />
                    <span>Turnarounds & packages</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-[#100c06] border border-white/[0.08] relative overflow-hidden">
                  <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider block mb-1">
                    Testimonials
                  </span>
                  <span className="text-3xl font-bold font-display text-white tabular-nums">
                    {testimonials.length}
                  </span>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-400">
                    <Star className="w-3.5 h-3.5 text-orange-500" />
                    <span>Client reviews</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="p-6 rounded-2xl bg-[#100c06] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
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
                    className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded-xl transition-colors cursor-pointer"
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
                    <KeyRound className="w-3.5 h-3.5 text-orange-500" />
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
                    className="text-xs text-orange-500 hover:underline cursor-pointer"
                  >
                    Manage Inquiries ({inquiries.length}) →
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="p-8 text-center bg-[#100c06] rounded-xl border border-white/[0.08] text-xs text-zinc-400">
                    No client inquiries received yet. Submissions from the public contact form appear here.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {inquiries.slice(0, 4).map((inq) => (
                      <div
                        key={inq.id}
                        className="p-4 rounded-xl bg-[#100c06] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div>
                          <div className="font-semibold text-white text-sm">{inq.fullName}</div>
                          <div className="text-zinc-400 mt-0.5">
                            {inq.email} &middot; <span className="text-orange-500 font-medium">{inq.projectType}</span>
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
                          className="bg-[#100c06] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <button
                        onClick={() => setIsCreatingProject(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded-xl transition-colors cursor-pointer shrink-0"
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
                        className="p-4 rounded-xl bg-[#100c06] border border-white/[0.08] hover:border-white/20 transition-colors flex gap-4 items-start justify-between group"
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
                                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-orange-500/20 text-orange-400 uppercase">
                                  Featured
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-orange-500 font-medium mt-0.5">
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
                                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-500'
                                  : 'bg-white/5 border-white/5 text-zinc-500 hover:text-zinc-300'
                              }`}
                              title={proj.featured ? 'Remove from featured' : 'Mark as featured'}
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingProject(proj)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-orange-500 transition-colors cursor-pointer"
                              title="Edit Project"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(proj.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-orange-500/20 text-zinc-300 hover:text-orange-400 transition-colors cursor-pointer"
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
                <form onSubmit={handleSaveProject} className="space-y-5 bg-[#100c06] p-6 rounded-2xl border border-white/[0.08]">
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Category
                      </label>
                      {/* Hidden input keeps form submission working */}
                      <input type="hidden" name="category" value={selectedCategory} />

                      {/* Trigger button */}
                      <button
                        type="button"
                        onClick={() => setCategoryDropdownOpen(prev => !prev)}
                        className="w-full flex items-center justify-between bg-[#141008] border border-white/10 hover:border-orange-500/40 rounded-xl px-3.5 py-2 text-xs text-white transition-all cursor-pointer"
                      >
                        <span className="truncate">
                          {[
                            { value: 'reels', label: 'Instagram Reels & Short-Form' },
                            { value: 'cinematic', label: 'Cinematic' },
                            { value: 'travel', label: 'Travel & Lifestyle' },
                            { value: 'beat-sync', label: 'Beat Sync & Sound Design' },
                            { value: 'transitions', label: 'Aesthetic Transitions' },
                            { value: 'night-day', label: 'Night & Day Edits' },
                            { value: 'lifestyle', label: 'Lifestyle' },
                            { value: 'music-edits', label: 'Music & Experimental' },
                          ].find(c => c.value === selectedCategory)?.label || 'Select category'}
                        </span>
                        <svg
                          className={`w-3.5 h-3.5 text-zinc-400 flex-shrink-0 ml-2 transition-transform duration-200 ${categoryDropdownOpen ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Dropdown panel */}
                      {categoryDropdownOpen && (
                        <>
                          {/* Backdrop */}
                          <div
                            className="fixed inset-0 z-40"
                            onClick={() => setCategoryDropdownOpen(false)}
                          />
                          <div
                            className="absolute z-50 top-full mt-1.5 left-0 right-0 bg-[#141418] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
                            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.7)' }}
                          >
                            {[
                              { value: 'reels', label: 'Instagram Reels & Short-Form', icon: '📱' },
                              { value: 'cinematic', label: 'Cinematic', icon: '🎬' },
                              { value: 'travel', label: 'Travel & Lifestyle', icon: '✈️' },
                              { value: 'beat-sync', label: 'Beat Sync & Sound Design', icon: '🎵' },
                              { value: 'transitions', label: 'Aesthetic Transitions', icon: '✨' },
                              { value: 'night-day', label: 'Night & Day Edits', icon: '🌓' },
                              { value: 'lifestyle', label: 'Lifestyle', icon: '🌿' },
                              { value: 'music-edits', label: 'Music & Experimental', icon: '🎸' },
                            ].map((cat) => {
                              const isSelected = selectedCategory === cat.value;
                              return (
                                <button
                                  key={cat.value}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCategory(cat.value);
                                    setCategoryDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left transition-all cursor-pointer ${
                                    isSelected
                                      ? 'bg-orange-500/10 text-orange-400'
                                      : 'text-zinc-300 hover:bg-white/[0.04] hover:text-white'
                                  }`}
                                >
                                  {/* Checkbox */}
                                  <span
                                    className={`flex-shrink-0 w-4 h-4 rounded flex items-center justify-center border transition-all ${
                                      isSelected
                                        ? 'bg-orange-500 border-orange-500'
                                        : 'border-white/25 bg-white/5'
                                    }`}
                                  >
                                    {isSelected && (
                                      <svg className="w-2.5 h-2.5 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </span>
                                  <span className="text-sm leading-none">{cat.icon}</span>
                                  <span className="flex-1 font-medium">{cat.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      )}
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                        Aspect Ratio
                      </label>
                      <select
                        name="aspectRatio"
                        defaultValue={editingProject?.aspectRatio || '9:16'}
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  {/* ═══════════════════════════════════════════════════════════
                      THUMBNAIL SECTION — Photo Upload + Video Frame Extractor
                  ═══════════════════════════════════════════════════════════ */}
                  <div className="space-y-3">
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300">
                      Thumbnail Image
                    </label>

                    {/* Path input + action buttons */}
                    <div className="flex gap-2">
                      <input
                        id="project-thumbnail-input"
                        name="thumbnail"
                        defaultValue={editingProject?.thumbnail || AVAILABLE_ASSET_PRESETS[0].path}
                        required
                        placeholder="/src/assets/images/... or blob: URL"
                        className="flex-1 bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                      />
                      {/* Upload Photo */}
                      <label className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/40 hover:text-orange-400 rounded-xl text-xs font-medium text-zinc-300 cursor-pointer transition-all">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              const input = document.getElementById('project-thumbnail-input') as HTMLInputElement;
                              if (input) input.value = url;
                              showNotification('✅ Photo set as thumbnail!');
                            }
                          }}
                        />
                      </label>
                      {/* Pick frame from video */}
                      <button
                        type="button"
                        title="Extract thumbnail from video timeline"
                        onClick={() => {
                          const videoInput = document.getElementById('project-video-input') as HTMLInputElement;
                          const videoSrc = videoInput?.value || editingProject?.videoUrl || '';
                          if (!videoSrc) {
                            showNotification('⚠️ Upload or enter a video URL first');
                            return;
                          }
                          openFramePicker(videoSrc);
                        }}
                        className="flex items-center gap-1.5 px-3 py-2 bg-white/10 border border-white/10 hover:bg-purple-500/20 hover:border-purple-400/40 hover:text-purple-300 rounded-xl text-xs font-medium text-zinc-300 cursor-pointer transition-all whitespace-nowrap"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.876V15.124a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                        From Video
                      </button>
                    </div>

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
                            className="px-2.5 py-1 rounded-lg bg-black/60 hover:bg-orange-500/20 border border-white/10 text-[10px] font-mono text-zinc-300 hover:text-orange-400 transition-colors whitespace-nowrap cursor-pointer"
                          >
                            {asset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* ═══════════════════════════════════════════════════════════
                      VIDEO UPLOAD SECTION — with Full-screen Overlay + Thumbnail Picker
                  ═══════════════════════════════════════════════════════════ */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                      Video Stream or MP4 URL (Optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="project-video-input"
                        name="videoUrl"
                        defaultValue={editingProject?.videoUrl || ''}
                        placeholder="https://... direct .mp4 or stream URL"
                        className="flex-1 bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                      />
                      <label className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-400 border border-orange-500/80 rounded-xl text-xs font-bold text-black cursor-pointer transition-all shadow-lg shadow-orange-500/20 whitespace-nowrap">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                        Upload Video
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleVideoFileUpload(file);
                          }}
                        />
                      </label>
                    </div>
                    {/* Quick hint */}
                    <p className="text-[10px] text-zinc-500 mt-1.5 font-mono">
                      Upload shows a full-screen progress overlay. After upload, use "From Video" above to set a thumbnail frame.
                    </p>
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
                      className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white resize-y"
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
                      className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white resize-y"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <MultiSelectTagInput 
                      name="editingTechniques"
                      label="Editing Techniques"
                      initialTags={editingProject?.editingTechniques || ['Beat sync', 'Speed ramp', 'Film grain']}
                      suggestedTags={['Beat sync', 'Speed ramp', 'Sound design', 'Color grading', 'Anamorphic framing', 'Pacing sync', 'Motion graphics', 'VFX', 'Transitions', 'Film grain', 'Audio mixing']}
                    />
                    
                    <MultiSelectTagInput 
                      name="toolsUsed"
                      label="Tools Used"
                      initialTags={editingProject?.toolsUsed || ['DaVinci Resolve', 'Premiere Pro', 'CapCut Pro']}
                      suggestedTags={['DaVinci Resolve', 'Premiere Pro', 'After Effects', 'Final Cut Pro', 'CapCut Pro', 'Avid Media Composer', 'Audition', 'Logic Pro']}
                    />

                    <MultiSelectTagInput 
                      name="deliverables"
                      label="Deliverables"
                      initialTags={editingProject?.deliverables || ['1080x1920 Master', '4K Master', 'Clean Feed']}
                      suggestedTags={['4K Master', '1080x1920 Master', 'Clean Feed', 'Social Cut', 'Web Export', 'ProRes HQ', 'H.264', 'H.265']}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      defaultChecked={editingProject ? editingProject.featured : true}
                      className="rounded border-white/20 bg-white/5 text-orange-600 w-4 h-4"
                    />
                    <label htmlFor="featured" className="text-xs text-zinc-300 cursor-pointer">
                      Feature prominently in top gallery
                    </label>
                  </div>

                  <div className="pt-3 flex items-center gap-3 border-t border-white/[0.08]">
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded-xl transition-colors cursor-pointer"
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
                      className="bg-[#100c06] border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <select
                    value={inquiryStatusFilter}
                    onChange={(e) => setInquiryStatusFilter(e.target.value)}
                    className="bg-[#100c06] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-300 cursor-pointer"
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
                <div className="p-12 text-center bg-[#100c06] rounded-2xl border border-white/[0.08] text-sm text-zinc-400">
                  No inquiries match the current filter.
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl bg-[#100c06] border border-white/[0.08] space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/[0.06] pb-3">
                        <div>
                          <span className="text-base font-bold text-white mr-2">{inq.fullName}</span>
                          <a
                            href={`mailto:${inq.email}?subject=${encodeURIComponent(`Re: ${inq.projectType} Editing Project`)}`}
                            className="text-xs text-orange-500 hover:underline font-mono"
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
                            className="p-1.5 text-zinc-500 hover:text-orange-400 transition-colors cursor-pointer"
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
                          <span className="text-orange-500 font-semibold">{inq.projectType}</span>
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
                            className="text-orange-500 hover:underline flex items-center gap-1 font-mono truncate max-w-lg"
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
                          className="w-full bg-[#141008] border border-white/5 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500 resize-y"
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
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded-xl transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Service</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map((srv) => (
                      <div
                        key={srv.id}
                        className="p-5 rounded-2xl bg-[#100c06] border border-white/[0.08] space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs font-mono text-orange-500 font-bold">{srv.number}</span>
                            <h3 className="text-base font-bold font-display text-white mt-0.5">{srv.title}</h3>
                            {srv.pricingStartingAt && (
                              <span className="text-xs text-emerald-400 font-mono">From {srv.pricingStartingAt}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => setEditingService(srv)}
                              className="p-1.5 text-zinc-400 hover:text-orange-500 transition-colors cursor-pointer"
                              title="Edit Service"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteService(srv.id)}
                              className="p-1.5 text-zinc-400 hover:text-orange-400 transition-colors cursor-pointer"
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
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
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
                <form onSubmit={handleSaveService} className="space-y-4 bg-[#100c06] p-6 rounded-2xl border border-white/[0.08]">
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
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
                      className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-y"
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
                      className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-y font-mono"
                    />
                  </div>

                  <div className="pt-3 flex items-center gap-3 border-t border-white/[0.08]">
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded-xl transition-colors cursor-pointer"
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
                      className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded-xl transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Testimonial</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {testimonials.map((test) => (
                      <div
                        key={test.id}
                        className="p-5 rounded-2xl bg-[#100c06] border border-white/[0.08] flex flex-col justify-between space-y-3"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-white text-sm font-display">
                              {test.clientName}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setEditingTestimonial(test)}
                                className="p-1.5 text-zinc-400 hover:text-orange-500 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTestimonial(test.id)}
                                className="p-1.5 text-zinc-400 hover:text-orange-400 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="text-xs text-orange-500 mt-0.5">
                            {test.role} {test.company && `&middot; ${test.company}`}
                          </div>

                          <p className="text-xs sm:text-sm text-zinc-300 italic mt-3 leading-relaxed">
                            "{test.feedback}"
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-xs">
                          <span className="text-zinc-500 font-mono">{test.projectType}</span>
                          {test.isDemo && (
                            <span className="text-[10px] font-mono text-orange-500/80 uppercase">
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
                <form onSubmit={handleSaveTestimonial} className="space-y-4 bg-[#100c06] p-6 rounded-2xl border border-white/[0.08]">
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
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
                        className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
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
                      className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-y"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="isDemo"
                      name="isDemo"
                      defaultChecked={editingTestimonial?.isDemo}
                      className="rounded border-white/20 bg-white/5 text-orange-600 w-4 h-4"
                    />
                    <label htmlFor="isDemo" className="text-xs text-zinc-300 cursor-pointer">
                      Mark as sample placeholder
                    </label>
                  </div>

                  <div className="pt-3 flex items-center gap-3 border-t border-white/[0.08]">
                    <button
                      type="submit"
                      className="px-6 py-2.5 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded-xl transition-colors cursor-pointer"
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
            <form onSubmit={handleSaveConfig} className="space-y-6 max-w-4xl bg-[#100c06] p-6 sm:p-8 rounded-2xl border border-white/[0.08]">
              <div>
                <h2 className="text-xl font-bold font-display text-white">
                  Brand, Showreel & Contact Settings
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Update creator identity, availability status, showreel video stream, and contact channels.
                </p>
              </div>

              {/* ── CINEMATIC HERO BANNER EDITOR ── */}
              <div className="p-5 rounded-2xl bg-black/50 border border-orange-500/15 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold font-mono uppercase text-orange-400">
                    🎬 Cinematic Hero Banner
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 ml-auto">Shadow-style full-bleed portrait</span>
                </div>

                {/* Live mini preview */}
                {siteForm.heroPhoto && (
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-white/10 group">
                    <img
                      src={siteForm.heroPhoto}
                      alt="Hero preview"
                      className="w-full h-full object-cover object-[70%_20%] brightness-50"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                    <div className="absolute inset-0 flex items-end p-4">
                      <div>
                        <p className="text-white font-display font-bold text-xl leading-tight drop-shadow">
                          {(siteForm.heroTagline || 'Every Frame,\nTells a Story.').split('\n')[0]}
                        </p>
                        <p className="text-orange-400 font-display font-bold text-xl leading-tight drop-shadow">
                          {(siteForm.heroTagline || 'Every Frame,\nTells a Story.').split('\n')[1] || ''}
                        </p>
                        <p className="text-zinc-300 text-[10px] mt-1 font-mono line-clamp-1 opacity-80">
                          {siteForm.heroSubcopy || siteForm.shortBio}
                        </p>
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 text-[9px] font-mono uppercase text-zinc-500 bg-black/60 px-2 py-0.5 rounded">
                      Preview
                    </div>
                  </div>
                )}

                {/* Hero Photo URL + Upload */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Hero Portrait Photo</label>
                  <div className="flex gap-2">
                    <input
                      id="hero-photo-input"
                      value={siteForm.heroPhoto || ''}
                      onChange={(e) => setSiteForm(prev => ({ ...prev, heroPhoto: e.target.value }))}
                      placeholder="/src/assets/images/... or https://..."
                      className="flex-1 bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                    <label className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 hover:bg-orange-400 rounded-xl text-xs font-bold text-black cursor-pointer transition-all whitespace-nowrap shadow-lg shadow-orange-600/20">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setSiteForm(prev => ({ ...prev, heroPhoto: url }));
                            showNotification('✅ Hero photo updated! Save to apply.');
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-zinc-600 mt-1 font-mono">
                    Best: high-contrast portrait with subject on the right half.
                  </p>
                </div>

                {/* Hero Tagline — supports two lines via \n */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">
                    Headline Tagline <span className="text-zinc-600">(use new line for 2nd line in amber gradient)</span>
                  </label>
                  <textarea
                    rows={2}
                    value={siteForm.heroTagline || ''}
                    onChange={(e) => setSiteForm(prev => ({ ...prev, heroTagline: e.target.value }))}
                    placeholder={'Every Frame,\nTells a Story.'}
                    className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono resize-none"
                  />
                </div>

                {/* Hero Subcopy */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Supporting Copy</label>
                  <textarea
                    rows={2}
                    value={siteForm.heroSubcopy || ''}
                    onChange={(e) => setSiteForm(prev => ({ ...prev, heroSubcopy: e.target.value }))}
                    placeholder="Cinematic video editing built with depth, drama, and emotion."
                    className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white resize-none"
                  />
                </div>
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
                    className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
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
                    className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
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
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
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
                  className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white resize-y"
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
                    className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white resize-y"
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
                    className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white resize-y"
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
                    className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
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
                    className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-300 mb-1.5">
                    Location
                  </label>
                  <input
                    value={siteForm.location}
                    onChange={(e) => setSiteForm({ ...siteForm, location: e.target.value })}
                    className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              {/* Showreel Section Settings */}
              <div className="p-4 rounded-xl bg-black/40 border border-white/[0.06] space-y-4">
                <span className="text-xs font-bold font-mono uppercase text-orange-500 block">
                  Showreel Player Configuration
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Showreel Title</label>
                    <input
                      value={siteForm.showreelTitle}
                      onChange={(e) => setSiteForm({ ...siteForm, showreelTitle: e.target.value })}
                      className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-1">Duration</label>
                    <input
                      value={siteForm.showreelDuration}
                      onChange={(e) => setSiteForm({ ...siteForm, showreelDuration: e.target.value })}
                      className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>

                {/* ── Video URL + Upload ── */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Showreel Video URL or Upload</label>
                  <div className="flex gap-2">
                    <input
                      id="showreel-video-input"
                      value={siteForm.showreelVideoUrl}
                      onChange={(e) => setSiteForm({ ...siteForm, showreelVideoUrl: e.target.value })}
                      placeholder="https://youtube.com/... or https://vimeo.com/... or .mp4 URL"
                      className="flex-1 bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                    {/* Upload local video */}
                    <label className="flex items-center gap-1.5 px-3 py-2 bg-orange-500 hover:bg-orange-400 border border-orange-500/80 rounded-xl text-xs font-bold text-black cursor-pointer transition-all shadow-lg shadow-orange-500/20 whitespace-nowrap">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                      Upload
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleVideoFileUpload(file);
                            // After upload completes, the overlay will set project-video-input
                            // We also need to watch for the showreel case — use a flag
                            (window as any).__showreelUpload = true;
                          }
                        }}
                      />
                    </label>
                  </div>
                  <p className="text-[10px] text-zinc-500 mt-1 font-mono">
                    Paste a YouTube / Vimeo link for persistent playback, or upload a local MP4 (session-only).
                  </p>
                </div>

                {/* ── Cover Image + Upload + From Video ── */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Showreel Cover / Poster</label>
                  <div className="flex gap-2 items-start">
                    {/* Live cover preview */}
                    {siteForm.showreelCover && (
                      <img
                        src={siteForm.showreelCover}
                        alt="Showreel cover"
                        className="w-16 h-10 object-cover rounded-lg border border-white/10 flex-shrink-0"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                    )}
                    <div className="flex-1 flex gap-2">
                      <input
                        id="showreel-cover-input"
                        value={siteForm.showreelCover}
                        onChange={(e) => setSiteForm({ ...siteForm, showreelCover: e.target.value })}
                        placeholder="/src/assets/images/... or URL"
                        className="flex-1 bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                      {/* Upload photo */}
                      <label className="flex items-center gap-1 px-3 py-2 bg-white/10 border border-white/10 hover:bg-orange-500/20 hover:border-orange-500/40 hover:text-orange-400 rounded-xl text-xs font-medium text-zinc-300 cursor-pointer transition-all whitespace-nowrap">
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                        Photo
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setSiteForm(prev => ({ ...prev, showreelCover: url }));
                              showNotification('✅ Showreel cover updated!');
                            }
                          }}
                        />
                      </label>
                      {/* Pick frame from showreel video */}
                      <button
                        type="button"
                        title="Extract cover from showreel video timeline"
                        onClick={() => {
                          const videoSrc = siteForm.showreelVideoUrl;
                          if (!videoSrc) {
                            showNotification('⚠️ Enter or upload the showreel video first');
                            return;
                          }
                          // Custom frame picker for showreel — set a flag so applyFrame goes to showreelCover
                          (window as any).__showreelFramePick = true;
                          openFramePicker(videoSrc);
                        }}
                        className="flex items-center gap-1 px-3 py-2 bg-white/10 border border-white/10 hover:bg-purple-500/20 hover:border-purple-400/40 hover:text-purple-300 rounded-xl text-xs font-medium text-zinc-300 cursor-pointer transition-all whitespace-nowrap"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.876V15.124a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>
                        Frame
                      </button>
                    </div>
                  </div>
                </div>

                {/* ── Subtitle ── */}
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Showreel Subtitle (optional)</label>
                  <input
                    value={siteForm.showreelSubtitle || ''}
                    onChange={(e) => setSiteForm({ ...siteForm, showreelSubtitle: e.target.value })}
                    placeholder="e.g. A few seconds. A whole story. Mastered for mobile screens."
                    className="w-full bg-[#141008] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>


              <div>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded-xl flex items-center gap-2 cursor-pointer transition-colors shadow-lg shadow-orange-600/10"
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
              <div className="p-5 rounded-2xl bg-[#100c06] border border-white/[0.08] space-y-3">
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
              <form onSubmit={handleUpdateCredentials} className="p-6 rounded-2xl bg-[#100c06] border border-white/[0.08] space-y-4">
                <h3 className="text-sm font-bold text-white font-display">
                  Update Login Email & Password
                </h3>

                {securityError && (
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs">
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
                      className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
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
                      className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white"
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
                      className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
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
                      className="w-full bg-[#141008] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-orange-500 mb-1.5">
                    Current Password (Required for verification)
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter existing password to verify"
                    className="w-full bg-[#141008] border border-orange-600/30 rounded-xl px-3.5 py-2 text-xs text-white font-mono"
                  />
                </div>

                <div className="pt-3 flex items-center justify-between">
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-xs font-semibold text-black bg-orange-500 hover:bg-orange-400 rounded-xl transition-colors cursor-pointer shadow-lg shadow-orange-600/10"
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
                  <Database className="w-5 h-5 text-orange-500" />
                  MongoDB Atlas &amp; Data Management
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Sync your portfolio data with MongoDB Atlas, export JSON backups, or restore from a previous snapshot.
                </p>
              </div>

              {/* ── MongoDB Atlas Sync Card ── */}
              <div className="p-6 rounded-2xl bg-[#0d1117] border border-orange-600/20 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                    <Database className="w-4 h-4 text-orange-500" />
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
                        <span className="w-2.5 h-2.5 rounded-full bg-orange-400" />
                        <span className="text-[11px] font-mono text-orange-400">API Offline</span>
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
                  <div className="p-4 rounded-xl bg-orange-600/5 border border-orange-600/15 space-y-2">
                    <p className="text-xs font-semibold text-orange-400">📋 Setup Guide</p>
                    <ol className="text-[11px] text-zinc-400 space-y-1.5 list-decimal list-inside font-mono">
                      <li>Go to <a href="https://cloud.mongodb.com" target="_blank" rel="noopener noreferrer" className="text-orange-500 underline">cloud.mongodb.com</a> and create a free cluster</li>
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
                    className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-400 disabled:opacity-40 text-black text-xs font-bold rounded-xl cursor-pointer transition-colors"
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
              <div className="p-6 rounded-2xl bg-[#100c06] border border-white/[0.08] space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white font-display">Export Portfolio Data</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Download a single JSON file containing all projects, services, testimonials, inquiries, and settings.
                    </p>
                  </div>
                  <button
                    onClick={handleExportJSON}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download JSON Backup</span>
                  </button>
                </div>
              </div>

              {/* Restore Card */}
              <div className="p-6 rounded-2xl bg-[#100c06] border border-white/[0.08] space-y-3">
                <h3 className="text-base font-bold text-white font-display">Restore from JSON</h3>
                <p className="text-xs text-zinc-400">
                  Paste a previously exported portfolio JSON payload to restore all data:
                </p>
                <textarea
                  rows={4}
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste JSON content here..."
                  className="w-full bg-[#141008] border border-white/10 rounded-xl p-3 text-xs text-white font-mono resize-y"
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
              <div className="p-6 rounded-2xl bg-orange-950/20 border border-orange-500/20 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-orange-300">Reset All to Initial Demo Samples</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Restores demo video projects, services, testimonials, and sample data.
                    </p>
                  </div>
                  <button
                    onClick={handleResetAllToDemo}
                    className="px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 text-xs font-semibold rounded-xl cursor-pointer transition-colors"
                  >
                    Reset All Data
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* VIDEO UPLOAD OVERLAY */}
      {videoUploadOverlay.active && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ background: 'rgba(5,5,10,0.96)', backdropFilter: 'blur(18px)' }}
        >
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(251,191,36,0.3) 1px,transparent 1px),linear-gradient(90deg,rgba(251,191,36,0.3) 1px,transparent 1px)',
            backgroundSize: '48px 48px',
          }} />
          <div className="relative w-full max-w-md mx-4 text-center">
            <div className="relative inline-flex items-center justify-center mb-8">
              <svg className="w-40 h-40 -rotate-90" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                <circle
                  cx="70" cy="70" r="60"
                  fill="none"
                  stroke={videoUploadOverlay.phase === 'done' ? '#22c55e' : '#fbbf24'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 60}`}
                  strokeDashoffset={`${2 * Math.PI * 60 * (1 - videoUploadOverlay.progress / 100)}`}
                  style={{ transition: 'stroke-dashoffset 0.3s ease, stroke 0.4s ease' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                {videoUploadOverlay.phase === 'done' ? (
                  <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className="text-3xl font-black text-white font-mono tabular-nums">
                    {Math.round(videoUploadOverlay.progress)}%
                  </span>
                )}
              </div>
            </div>

            <div className="mb-3">
              {videoUploadOverlay.phase === 'uploading' && (
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  <span className="text-orange-400 font-mono text-sm tracking-widest uppercase">Uploading</span>
                </div>
              )}
              {videoUploadOverlay.phase === 'processing' && (
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-purple-300 font-mono text-sm tracking-widest uppercase">Processing</span>
                </div>
              )}
              {videoUploadOverlay.phase === 'done' && (
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-green-300 font-mono text-sm tracking-widest uppercase">Upload Complete</span>
                </div>
              )}
            </div>

            <p className="text-white font-semibold text-base mb-1 truncate max-w-xs mx-auto">{videoUploadOverlay.fileName}</p>
            <p className="text-zinc-400 text-xs font-mono mb-8">{videoUploadOverlay.fileSize}</p>

            <div className="w-full bg-white/10 rounded-full h-1.5 mb-6 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${videoUploadOverlay.progress}%`,
                  background: videoUploadOverlay.phase === 'done'
                    ? 'linear-gradient(90deg,#22c55e,#4ade80)'
                    : 'linear-gradient(90deg,#d97706,#fbbf24,#fde68a)',
                }}
              />
            </div>

            {videoUploadOverlay.phase === 'done' && (
              <div className="flex flex-col gap-3">
                {/* Blob URL warning */}
                <div className="flex items-start gap-2.5 px-4 py-3 bg-orange-500/10 border border-orange-500/30 rounded-xl text-left">
                  <svg className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  </svg>
                  <div>
                    <p className="text-orange-400 text-xs font-semibold mb-0.5">Temporary session video</p>
                    <p className="text-orange-300/70 text-[11px] font-mono leading-relaxed">
                      This local file is only available until you refresh the page. For persistent playback, host the video on YouTube, Vimeo, or a CDN and paste the URL instead.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setVideoUploadOverlay(prev => ({ ...prev, active: false }));
                    openFramePicker(videoUploadOverlay.blobUrl);
                  }}
                  className="w-full py-3 px-6 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 10l4.553-2.069A1 1 0 0121 8.876V15.124a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Set Thumbnail from Video
                </button>
                <button
                  onClick={() => setVideoUploadOverlay(prev => ({ ...prev, active: false }))}
                  className="w-full py-2.5 px-6 bg-white/10 hover:bg-white/15 text-zinc-300 font-medium rounded-2xl text-sm transition-all"
                >
                  Continue Without Thumbnail
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* VIDEO FRAME PICKER MODAL */}
      {thumbFramePicker.open && (
        <div
          className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
          style={{ background: 'rgba(5,5,10,0.94)', backdropFilter: 'blur(14px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setThumbFramePicker(prev => ({ ...prev, open: false })); }}
        >
          <div className="w-full max-w-2xl bg-[#0e0b05] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold text-base">Pick Thumbnail from Video</h3>
                <p className="text-zinc-400 text-xs mt-0.5 font-mono">Scrub the timeline to find the perfect frame, then capture it</p>
              </div>
              <button
                onClick={() => setThumbFramePicker(prev => ({ ...prev, open: false }))}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-zinc-400 hover:text-white transition-all"
              >✕</button>
            </div>

            <div className="p-6 space-y-5">
              {/* Video preview */}
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video w-full">
                <video
                  ref={thumbVideoRef}
                  src={thumbFramePicker.videoSrc}
                  className="w-full h-full object-contain"
                  onLoadedMetadata={() => {
                    const v = thumbVideoRef.current;
                    if (v) setThumbFramePicker(prev => ({ ...prev, duration: v.duration }));
                  }}
                  onTimeUpdate={() => {
                    const v = thumbVideoRef.current;
                    if (v) setThumbFramePicker(prev => ({ ...prev, currentTime: v.currentTime }));
                  }}
                  crossOrigin="anonymous"
                  preload="metadata"
                />
                <button
                  type="button"
                  onClick={captureVideoFrame}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-2 bg-black/70 hover:bg-orange-500/90 hover:text-black border border-white/20 hover:border-orange-500 text-white rounded-xl text-xs font-semibold transition-all backdrop-blur"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Capture Frame
                </button>
              </div>

              {/* Timeline scrubber */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>
                    {Math.floor(thumbFramePicker.currentTime / 60).toString().padStart(2,'0')}:
                    {Math.floor(thumbFramePicker.currentTime % 60).toString().padStart(2,'0')}
                  </span>
                  <span className="text-zinc-500 text-[10px]">TIMELINE — drag to scrub</span>
                  <span>
                    {Math.floor(thumbFramePicker.duration / 60).toString().padStart(2,'0')}:
                    {Math.floor(thumbFramePicker.duration % 60).toString().padStart(2,'0')}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={thumbFramePicker.duration || 100}
                  step={0.033}
                  value={thumbFramePicker.currentTime}
                  onChange={(e) => {
                    const t = parseFloat(e.target.value);
                    setThumbFramePicker(prev => ({ ...prev, currentTime: t }));
                    if (thumbVideoRef.current) thumbVideoRef.current.currentTime = t;
                  }}
                  className="w-full h-2 rounded-full cursor-pointer appearance-none"
                  style={{
                    background: `linear-gradient(90deg, #fbbf24 ${(thumbFramePicker.currentTime / (thumbFramePicker.duration || 1)) * 100}%, rgba(255,255,255,0.1) 0%)`,
                  }}
                />
                {/* Quick jump buttons */}
                <div className="flex gap-2 mt-1">
                  {[0, 10, 25, 50, 75, 90].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => {
                        const t = (pct / 100) * thumbFramePicker.duration;
                        if (thumbVideoRef.current) thumbVideoRef.current.currentTime = t;
                        setThumbFramePicker(prev => ({ ...prev, currentTime: t }));
                      }}
                      className="flex-1 py-1 text-[10px] font-mono bg-white/5 hover:bg-orange-500/20 hover:text-orange-400 border border-white/10 rounded-lg text-zinc-400 transition-all"
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Captured frame preview */}
              {thumbFramePicker.capturedFrame && (
                <div className="flex gap-4 items-center p-4 bg-white/[0.04] border border-green-500/30 rounded-2xl">
                  <img
                    src={thumbFramePicker.capturedFrame}
                    alt="Captured frame"
                    className="w-28 h-16 object-cover rounded-xl border border-white/20 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-green-300 text-xs font-semibold mb-1">✓ Frame captured</p>
                    <p className="text-zinc-400 text-[11px] font-mono">
                      at {Math.floor(thumbFramePicker.currentTime / 60).toString().padStart(2,'0')}:
                      {Math.floor(thumbFramePicker.currentTime % 60).toString().padStart(2,'0')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={applyFrameAsThumbnail}
                    className="px-4 py-2 bg-green-500 hover:bg-green-400 text-white font-bold rounded-xl text-xs transition-all shadow-lg shadow-green-500/30 whitespace-nowrap"
                  >
                    Use as Thumbnail →
                  </button>
                </div>
              )}

              {/* Action row */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={captureVideoFrame}
                  className="flex-1 py-3 bg-orange-500 hover:bg-orange-400 text-black font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Capture This Frame
                </button>
                {thumbFramePicker.capturedFrame && (
                  <button
                    type="button"
                    onClick={applyFrameAsThumbnail}
                    className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition-all"
                  >
                    Set as Thumbnail ✓
                  </button>
                )}
              </div>
            </div>
          </div>
          <canvas ref={thumbCanvasRef} className="hidden" />
        </div>
      )}

    </div>
  );
};
