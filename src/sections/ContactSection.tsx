import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, MessageSquare, Send, CheckCircle2, AlertCircle, ArrowUpRight, Instagram } from 'lucide-react';
import { motion } from 'motion/react';
import { inquiryFormSchema, InquiryFormData } from '../lib/validation';
import { storage } from '../lib/storage';
import { SiteConfig } from '../types';

interface ContactSectionProps {
  config: SiteConfig;
  preselectedService?: string;
  onInquirySubmitted?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  config,
  preselectedService,
  onInquirySubmitted,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<InquiryFormData>({
    resolver: zodResolver(inquiryFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      whatsappNumber: '',
      projectType: preselectedService || 'Cinematic Reels',
      estimatedBudget: '',
      preferredDeliveryDate: '',
      projectDescription: '',
      referenceLink: '',
      consent: true,
    },
  });

  useEffect(() => {
    if (preselectedService) {
      setValue('projectType', preselectedService);
    }
  }, [preselectedService, setValue]);

  const onSubmit = async (data: InquiryFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Simulate real async delay for user feedback & persist
      await new Promise((res) => setTimeout(res, 550));

      storage.saveInquiry({
        fullName: data.fullName,
        email: data.email,
        whatsappNumber: data.whatsappNumber || undefined,
        projectType: data.projectType,
        estimatedBudget: data.estimatedBudget || undefined,
        preferredDeliveryDate: data.preferredDeliveryDate || undefined,
        projectDescription: data.projectDescription,
        referenceLink: data.referenceLink || undefined,
      });

      setIsSubmitted(true);
      reset();
      if (onInquirySubmitted) onInquirySubmitted();
    } catch (err) {
      console.error('Inquiry submission error:', err);
      setSubmitError('Unable to save inquiry at this moment. Please email or message via WhatsApp.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanWhatsappNumber = config.whatsappNumber.replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsappNumber}?text=${encodeURIComponent(
    `Hi ${config.editorName}, I saw your mobile editing portfolio and would like to discuss an upcoming Reel project.`
  )}`;

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#09090b] relative overflow-hidden">
      {/* Subtle ambient light glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 rounded-full bg-amber-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left Column: Direct Outreach & WhatsApp with scroll reveal */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 space-y-6 sm:space-y-8"
          >
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2 sm:mb-3">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Start An Edit</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white leading-tight">
                Let's create something <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                  worth replaying.
                </span>
              </h2>

              <p className="mt-3 text-xs sm:text-base text-zinc-400 leading-relaxed font-normal">
                Whether you have raw camera rushes, phone footage from an expedition, or a brand social campaign needing dynamic pacing, send a note below.
              </p>
            </div>

            {/* Direct Connect Options */}
            <div className="space-y-3 pt-2 border-t border-white/[0.08]">
              {/* WhatsApp direct (Priority for mobile clients) */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#121216] border border-white/[0.08] hover:border-emerald-500/40 transition-all flex items-center justify-between group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                      Fast Direct Chat
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                      WhatsApp: {config.whatsappNumber}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
              </a>

              {/* Email direct */}
              <a
                href={`mailto:${config.contactEmail}?subject=Mobile%20Video%20Editing%20Inquiry`}
                className="p-4 rounded-xl bg-[#121216] border border-white/[0.08] hover:border-amber-500/40 transition-all flex items-center justify-between group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                      Direct Email
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                      {config.contactEmail}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-amber-400 transition-colors" />
              </a>

              {/* Instagram direct */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-xl bg-[#121216] border border-white/[0.08] hover:border-pink-500/40 transition-all flex items-center justify-between group active:scale-98"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block">
                      Instagram DM
                    </span>
                    <span className="text-sm font-semibold text-white group-hover:text-pink-300 transition-colors">
                      {config.instagramHandle}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-pink-400 transition-colors" />
              </a>
            </div>

            {/* Turnaround Note */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-zinc-400">
              <span className="font-mono text-zinc-300 uppercase tracking-wider block mb-0.5">
                Response Guarantee
              </span>
              <p>
                Inquiries reviewed within 12-24 hours. For rush turnaround (48-72h), WhatsApp is recommended.
              </p>
            </div>
          </motion.div>

          {/* Right Column: Project Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-[#121216] border border-white/[0.08] rounded-2xl p-5 sm:p-8 shadow-2xl"
          >
            {isSubmitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                  Inquiry Received
                </h3>
                <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto leading-relaxed">
                  Thank you! Your editing project details have been recorded. I'll review your reference link and respond with pacing notes and turnaround timeline.
                </p>
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5" noValidate>
                <div className="border-b border-white/[0.06] pb-3">
                  <h3 className="text-base sm:text-lg font-bold font-display text-white">
                    Project Brief & Specifications
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Share your footage volume, preferred audio, and desired delivery date. Fields with * are required.
                  </p>
                </div>

                {submitError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1" htmlFor="fullName">
                      Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g. Liam Parker"
                      {...register('fullName')}
                      className={`w-full bg-[#18181e] border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                        errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-amber-500'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-red-400 text-[11px] mt-1">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1" htmlFor="email">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="liam@creator.co"
                      {...register('email')}
                      className={`w-full bg-[#18181e] border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-amber-500'
                      }`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-[11px] mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                {/* WhatsApp & Type of Edit Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1" htmlFor="whatsappNumber">
                      WhatsApp Number (Optional)
                    </label>
                    <input
                      id="whatsappNumber"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      {...register('whatsappNumber')}
                      className="w-full bg-[#18181e] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1" htmlFor="projectType">
                      Type of Edit *
                    </label>
                    <select
                      id="projectType"
                      {...register('projectType')}
                      className="w-full bg-[#18181e] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-500 transition-colors cursor-pointer"
                    >
                      <option value="Cinematic Reels">Cinematic Reels</option>
                      <option value="Travel & Lifestyle">Travel & Lifestyle</option>
                      <option value="Instagram & Social Media">Instagram & Social Media</option>
                      <option value="Beat Sync & Motion">Beat Sync & Motion</option>
                      <option value="Day-to-Night Transitions">Day-to-Night Transitions</option>
                      <option value="Music & Audio Edits">Music & Audio Edits</option>
                      <option value="Personal & Creative Edits">Personal & Creative Edits</option>
                    </select>
                  </div>
                </div>

                {/* Budget & Delivery Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1" htmlFor="estimatedBudget">
                      Budget Range (Optional)
                    </label>
                    <input
                      id="estimatedBudget"
                      type="text"
                      placeholder="e.g. $500 – $1,200 per Reel"
                      {...register('estimatedBudget')}
                      className="w-full bg-[#18181e] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-300 mb-1" htmlFor="preferredDeliveryDate">
                      Required Delivery Date (Optional)
                    </label>
                    <input
                      id="preferredDeliveryDate"
                      type="text"
                      placeholder="e.g. In 4 days / ASAP"
                      {...register('preferredDeliveryDate')}
                      className="w-full bg-[#18181e] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Reference Video Link */}
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1" htmlFor="referenceLink">
                    Reference Video / Footage Link (Optional)
                  </label>
                  <input
                    id="referenceLink"
                    type="url"
                    placeholder="e.g. Instagram Reel, TikTok, Drive or Dropbox folder"
                    {...register('referenceLink')}
                    className="w-full bg-[#18181e] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 transition-colors"
                  />
                </div>

                {/* Project Description */}
                <div>
                  <label className="block text-xs font-mono text-zinc-300 mb-1" htmlFor="projectDescription">
                    Project Description & Story Details *
                  </label>
                  <textarea
                    id="projectDescription"
                    rows={3}
                    placeholder="Tell me about your footage source (iPhone 15/16 Pro, Sony camera, drone), preferred music or audio style, target duration, and any specific transitions..."
                    {...register('projectDescription')}
                    className={`w-full bg-[#18181e] border rounded-lg px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition-colors resize-y ${
                      errors.projectDescription ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-amber-500'
                    }`}
                  />
                  {errors.projectDescription && (
                    <p className="text-red-400 text-[11px] mt-1">{errors.projectDescription.message}</p>
                  )}
                </div>

                {/* Consent */}
                <div className="pt-1">
                  <label className="flex items-start gap-2 text-xs text-zinc-400 cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('consent')}
                      className="mt-0.5 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500"
                    />
                    <span>
                      I consent to storing this inquiry information so we can discuss and schedule the edit.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="text-red-400 text-[11px] mt-1">{errors.consent.message}</p>
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 text-xs font-semibold uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300 active:scale-95 disabled:opacity-50 transition-all rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Sending Inquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Project Inquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
