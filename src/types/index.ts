export type ProjectCategory = 
  | 'cinematic'
  | 'travel'
  | 'reels'
  | 'beat-sync'
  | 'transitions'
  | 'night-day'
  | 'lifestyle'
  | 'music-edits';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  year: string;
  client?: string;
  duration: string;
  thumbnail: string;
  videoUrl?: string; // YouTube, Vimeo, or direct MP4/stream
  aspectRatio?: '16:9' | '9:16' | '4:3';
  overview: string;
  role: string;
  creativeApproach: string;
  editingTechniques: string[];
  toolsUsed: string[];
  deliverables: string[];
  behindTheScenesImg?: string;
  featured?: boolean;
  order: number;
  isDemo?: boolean;
}

export interface Service {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  features: string[];
  icon: string;
  deliverableTimeframe?: string;
  pricingStartingAt?: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'in_progress' | 'completed' | 'archived';

export interface Inquiry {
  id: string;
  fullName: string;
  email: string;
  whatsappNumber?: string;
  projectType: string;
  estimatedBudget?: string;
  preferredDeliveryDate?: string;
  projectDescription: string;
  referenceLink?: string;
  status: InquiryStatus;
  adminNotes?: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  role: string;
  company?: string;
  projectType: string;
  feedback: string;
  rating?: number;
  isDemo?: boolean;
}

export interface AdminCredentials {
  email: string;
  username: string;
  passwordHash: string; // Stored securely in storage
  updatedAt: string;
}

export interface AdminSession {
  token: string;
  email: string;
  username: string;
  loggedInAt: string;
}

export interface SiteConfig {
  editorName: string;
  tagline: string;
  shortBio: string;
  aboutPhilosophy: string;
  aboutApproach: string;
  availableForProjects: boolean;
  availabilityNote: string;
  contactEmail: string;
  whatsappNumber: string;
  instagramHandle: string;
  vimeoHandle?: string;
  youtubeHandle?: string;
  location: string;
  // Cinematic Hero Banner
  heroPhoto?: string;       // Full-bleed portrait image
  heroTagline?: string;     // Italic accent line e.g. "Light and Shadow."
  heroSubcopy?: string;     // Supporting paragraph
  showreelTitle: string;
  showreelSubtitle: string;
  showreelDuration: string;
  showreelVideoUrl: string;
  showreelCover: string;
}
