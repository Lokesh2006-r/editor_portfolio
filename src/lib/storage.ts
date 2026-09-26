import { Project, Inquiry, SiteConfig, Testimonial, Service } from '../types';
import { initialProjects } from '../data/projects';
import { initialSiteConfig } from '../data/siteConfig';
import { initialTestimonials } from '../data/testimonials';
import { servicesList } from '../data/services';

const PROJECTS_KEY = 'kaien_portfolio_projects_v1';
const INQUIRIES_KEY = 'kaien_portfolio_inquiries_v1';
const CONFIG_KEY = 'lokez_portfolio_config_v3';
const TESTIMONIALS_KEY = 'kaien_portfolio_testimonials_v1';
const SERVICES_KEY = 'kaien_portfolio_services_v1';

export const storage = {
  getProjects(): Project[] {
    try {
      const data = localStorage.getItem(PROJECTS_KEY);
      if (!data) {
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(initialProjects));
        return initialProjects;
      }
      return JSON.parse(data);
    } catch {
      return initialProjects;
    }
  },

  saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
      window.dispatchEvent(new Event('portfolio_projects_updated'));
    } catch (e) {
      console.error('Failed to save projects', e);
    }
  },

  resetProjects(): Project[] {
    try {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(initialProjects));
      window.dispatchEvent(new Event('portfolio_projects_updated'));
    } catch (e) {
      console.error('Failed to reset projects', e);
    }
    return initialProjects;
  },

  getServices(): Service[] {
    try {
      const data = localStorage.getItem(SERVICES_KEY);
      if (!data) {
        localStorage.setItem(SERVICES_KEY, JSON.stringify(servicesList));
        return servicesList;
      }
      return JSON.parse(data);
    } catch {
      return servicesList;
    }
  },

  saveServices(services: Service[]): void {
    try {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
      window.dispatchEvent(new Event('portfolio_services_updated'));
    } catch (e) {
      console.error('Failed to save services', e);
    }
  },

  resetServices(): Service[] {
    try {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(servicesList));
      window.dispatchEvent(new Event('portfolio_services_updated'));
    } catch (e) {
      console.error('Failed to reset services', e);
    }
    return servicesList;
  },

  getInquiries(): Inquiry[] {
    try {
      const data = localStorage.getItem(INQUIRIES_KEY);
      if (!data) return [];
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  saveInquiry(inquiry: Omit<Inquiry, 'id' | 'createdAt' | 'status'>): Inquiry {
    const inquiries = this.getInquiries();
    const newInquiry: Inquiry = {
      ...inquiry,
      id: `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    const updated = [newInquiry, ...inquiries];
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('portfolio_inquiries_updated'));
    return newInquiry;
  },

  updateInquiryStatus(id: string, status: Inquiry['status']): void {
    const inquiries = this.getInquiries();
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq));
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('portfolio_inquiries_updated'));
  },

  updateInquiryNotes(id: string, adminNotes: string): void {
    const inquiries = this.getInquiries();
    const updated = inquiries.map((inq) => (inq.id === id ? { ...inq, adminNotes } : inq));
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('portfolio_inquiries_updated'));
  },

  deleteInquiry(id: string): void {
    const inquiries = this.getInquiries();
    const updated = inquiries.filter((inq) => inq.id !== id);
    localStorage.setItem(INQUIRIES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('portfolio_inquiries_updated'));
  },

  getConfig(): SiteConfig {
    try {
      const data = localStorage.getItem(CONFIG_KEY);
      if (!data) {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(initialSiteConfig));
        return initialSiteConfig;
      }
      const parsed = JSON.parse(data);
      if (parsed.editorName === 'Kaien Vance') {
        parsed.editorName = 'Lokez Edits';
      }
      return { ...initialSiteConfig, ...parsed };
    } catch {
      return initialSiteConfig;
    }
  },

  saveConfig(config: SiteConfig): void {
    try {
      localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
      window.dispatchEvent(new Event('portfolio_config_updated'));
    } catch (e) {
      console.error('Failed to save config', e);
    }
  },

  getTestimonials(): Testimonial[] {
    try {
      const data = localStorage.getItem(TESTIMONIALS_KEY);
      if (!data) {
        localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(initialTestimonials));
        return initialTestimonials;
      }
      return JSON.parse(data);
    } catch {
      return initialTestimonials;
    }
  },

  saveTestimonials(testimonials: Testimonial[]): void {
    try {
      localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(testimonials));
      window.dispatchEvent(new Event('portfolio_testimonials_updated'));
    } catch (e) {
      console.error('Failed to save testimonials', e);
    }
  },

  resetTestimonials(): Testimonial[] {
    try {
      localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(initialTestimonials));
      window.dispatchEvent(new Event('portfolio_testimonials_updated'));
    } catch (e) {
      console.error('Failed to reset testimonials', e);
    }
    return initialTestimonials;
  },

  exportAllData(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projects: this.getProjects(),
      services: this.getServices(),
      testimonials: this.getTestimonials(),
      inquiries: this.getInquiries(),
      config: this.getConfig(),
    };
    return JSON.stringify(data, null, 2);
  },

  importAllData(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, error: 'Invalid JSON file structure.' };
      }
      if (Array.isArray(parsed.projects)) this.saveProjects(parsed.projects);
      if (Array.isArray(parsed.services)) this.saveServices(parsed.services);
      if (Array.isArray(parsed.testimonials)) this.saveTestimonials(parsed.testimonials);
      if (Array.isArray(parsed.inquiries)) {
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify(parsed.inquiries));
        window.dispatchEvent(new Event('portfolio_inquiries_updated'));
      }
      if (parsed.config && typeof parsed.config === 'object') this.saveConfig(parsed.config);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e?.message || 'Failed to parse JSON backup.' };
    }
  },

  resetAllData(): void {
    this.resetProjects();
    this.resetServices();
    this.resetTestimonials();
    this.saveConfig(initialSiteConfig);
    localStorage.removeItem(INQUIRIES_KEY);
    window.dispatchEvent(new Event('portfolio_inquiries_updated'));
  },
};
