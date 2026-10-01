import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { VideoLightbox } from '../components/VideoLightbox';
import { ProjectModal } from '../components/ProjectModal';
import { ScrollProgress } from '../components/ScrollProgress';
import { ScrollToTop } from '../components/ScrollToTop';
import { KineticMarquee } from '../components/KineticMarquee';
import { AestheticBackground } from '../components/AestheticBackground';
import { Hero } from '../sections/Hero';
import { Showreel } from '../sections/Showreel';
import { VideoGallery } from '../sections/VideoGallery';
import { Services } from '../sections/Services';
import { About } from '../sections/About';
import { Workflow } from '../sections/Workflow';
import { Testimonials } from '../sections/Testimonials';
import { ContactSection } from '../sections/ContactSection';
import { AdminModal } from './admin/AdminModal';
import { storage } from '../lib/storage';
import { useScrollSpy } from '../hooks/useScrollSpy';
import { Project, SiteConfig, Inquiry, Testimonial, Service } from '../types';

interface HomeProps {
  onNavigateToAdmin?: () => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigateToAdmin }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [config, setConfig] = useState<SiteConfig>(storage.getConfig());
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>(storage.getServices());

  // Autoplay setting (could be moved to config, default true for now)
  const autoplayOnScroll = true;

  // Modals & Lightbox states
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeLightbox, setActiveLightbox] = useState<{
    isOpen: boolean;
    title: string;
    videoUrl?: string;
    posterUrl: string;
    categoryLabel?: string;
    duration?: string;
    client?: string;
    description?: string;
    triggerEl?: HTMLElement | null;
  }>({
    isOpen: false,
    title: '',
    posterUrl: '',
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>(undefined);

  // Scrollspy sections (matching navbar and section IDs)
  const sectionIds = ['hero', 'showreel', 'edits', 'services', 'workflow', 'about', 'testimonials', 'contact'];
  const activeSection = useScrollSpy(sectionIds, 130);

  // Load initial data and attach event listeners for cross-tab or storage sync
  useEffect(() => {
    setProjects(storage.getProjects());
    setConfig(storage.getConfig());
    setInquiries(storage.getInquiries());
    setTestimonials(storage.getTestimonials());
    setServices(storage.getServices());

    const handleProjectsUpdate = () => setProjects(storage.getProjects());
    const handleConfigUpdate = () => setConfig(storage.getConfig());
    const handleInquiriesUpdate = () => setInquiries(storage.getInquiries());
    const handleTestimonialsUpdate = () => setTestimonials(storage.getTestimonials());
    const handleServicesUpdate = () => setServices(storage.getServices());

    window.addEventListener('portfolio_projects_updated', handleProjectsUpdate);
    window.addEventListener('portfolio_config_updated', handleConfigUpdate);
    window.addEventListener('portfolio_inquiries_updated', handleInquiriesUpdate);
    window.addEventListener('portfolio_testimonials_updated', handleTestimonialsUpdate);
    window.addEventListener('portfolio_services_updated', handleServicesUpdate);

    return () => {
      window.removeEventListener('portfolio_projects_updated', handleProjectsUpdate);
      window.removeEventListener('portfolio_config_updated', handleConfigUpdate);
      window.removeEventListener('portfolio_inquiries_updated', handleInquiriesUpdate);
      window.removeEventListener('portfolio_testimonials_updated', handleTestimonialsUpdate);
      window.removeEventListener('portfolio_services_updated', handleServicesUpdate);
    };
  }, []);

  const handleOpenAdmin = () => {
    if (onNavigateToAdmin) {
      onNavigateToAdmin();
    } else {
      setIsAdminOpen(true);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Vertical Showreel launcher
  const launchShowreel = (e?: React.MouseEvent<HTMLElement>) => {
    setActiveLightbox({
      isOpen: true,
      title: config.showreelTitle,
      videoUrl: config.showreelVideoUrl,
      posterUrl: config.showreelCover,
      categoryLabel: 'Vertical Showreel (9:16)',
      duration: config.showreelDuration,
      description: config.showreelSubtitle,
      triggerEl: (e?.currentTarget as HTMLElement) || null,
    });
  };

  // Launch project in viewer
  const launchProjectVideo = (project: Project, e: React.MouseEvent<HTMLElement>) => {
    setSelectedProject(project);
  };

  const handleSelectServiceFromCard = (serviceTitle: string) => {
    setPreselectedService(serviceTitle);
    scrollToSection('contact');
  };

  const handleDiscussProjectFromModal = (project: Project) => {
    setPreselectedService(project.categoryLabel);
    scrollToSection('contact');
  };

  // Next / Prev project navigation in modal
  const currentProjectIndex = selectedProject
    ? projects.findIndex((p) => p.id === selectedProject.id)
    : -1;
  const hasNextProject = currentProjectIndex >= 0 && currentProjectIndex < projects.length - 1;
  const hasPrevProject = currentProjectIndex > 0;

  const handleNextProject = () => {
    if (hasNextProject) {
      setSelectedProject(projects[currentProjectIndex + 1]);
    }
  };

  const handlePrevProject = () => {
    if (hasPrevProject) {
      setSelectedProject(projects[currentProjectIndex - 1]);
    }
  };

  return (
    <div className="relative min-h-screen text-[#f4f4f5] flex flex-col font-sans film-grain selection:bg-violet-600 selection:text-black">
      {/* Aesthetic Floating Glowing Background Canvas */}
      <AestheticBackground config={config} />

      {/* Scroll Progress Bar at very top */}
      <ScrollProgress />

      {/* Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={scrollToSection}
        onOpenAdmin={handleOpenAdmin}
        brandName={config.editorName}
        availableForProjects={config.availableForProjects}
      />

      {/* Main Content Sections */}
      <main className="flex-1 relative z-10">

        <Hero
          config={config}
          onExploreWork={() => scrollToSection('edits')}
          onContact={() => scrollToSection('contact')}
          onWatchReel={launchShowreel}
        />

        {/* Cinematic Kinetic Marquee Divider with infinite movement */}
        <KineticMarquee speed={30} direction="left" />

        <Showreel
          config={config}
          onOpenLightbox={launchShowreel}
          onExploreWork={() => scrollToSection('edits')}
        />

        <VideoGallery
          projects={projects}
          onSelectProject={(project) => setSelectedProject(project)}
          onPlayDirect={launchProjectVideo}
          autoplayOnScroll={autoplayOnScroll}
        />

        {/* Secondary Kinetic Movement Ribbon */}
        <KineticMarquee speed={38} direction="right" className="opacity-90" />

        <Services services={services} onSelectService={handleSelectServiceFromCard} />

        <Workflow />

        <About config={config} onContact={() => scrollToSection('contact')} />

        <Testimonials
          testimonials={testimonials}
          onContact={() => scrollToSection('contact')}
        />

        <ContactSection
          config={config}
          preselectedService={preselectedService}
          onInquirySubmitted={() => {
            setInquiries(storage.getInquiries());
          }}
        />
      </main>

      {/* Footer */}
      <Footer
        config={config}
        onNavigate={scrollToSection}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Floating Scroll To Top Action with Circular Scroll Progress */}
      <ScrollToTop />

      {/* Fullscreen Video Lightbox */}
      <VideoLightbox
        isOpen={activeLightbox.isOpen}
        onClose={() => setActiveLightbox((prev) => ({ ...prev, isOpen: false }))}
        videoUrl={activeLightbox.videoUrl}
        posterUrl={activeLightbox.posterUrl}
        title={activeLightbox.title}
        categoryLabel={activeLightbox.categoryLabel}
        duration={activeLightbox.duration}
        client={activeLightbox.client}
        description={activeLightbox.description}
        triggerElement={activeLightbox.triggerEl}
      />

      {/* Dedicated Vertical Video Project Viewer */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onNext={handleNextProject}
        onPrev={handlePrevProject}
        hasNext={hasNextProject}
        hasPrev={hasPrevProject}
        onDiscussProject={handleDiscussProjectFromModal}
      />

      {/* Admin Dashboard Modal */}
      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        projects={projects}
        inquiries={inquiries}
        config={config}
        onUpdateProjects={(updated) => setProjects(updated)}
        onUpdateConfig={(updated) => setConfig(updated)}
      />
    </div>
  );
};
