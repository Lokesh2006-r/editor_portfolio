import mongoose from 'mongoose';

const siteConfigSchema = new mongoose.Schema({
  _key: { type: String, default: 'singleton', unique: true },
  editorName: String,
  tagline: String,
  shortBio: String,
  aboutPhilosophy: String,
  aboutApproach: String,
  availableForProjects: { type: Boolean, default: true },
  availabilityNote: String,
  contactEmail: String,
  whatsappNumber: String,
  instagramHandle: String,
  vimeoHandle: String,
  youtubeHandle: String,
  location: String,
  showreelTitle: String,
  showreelSubtitle: String,
  showreelDuration: String,
  showreelVideoUrl: String,
  showreelCover: String,
}, { timestamps: true });

export const SiteConfig = mongoose.model('SiteConfig', siteConfigSchema);
