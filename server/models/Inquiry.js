import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  fullName: String,
  email: String,
  whatsappNumber: String,
  projectType: String,
  estimatedBudget: String,
  preferredDeliveryDate: String,
  projectDescription: String,
  referenceLink: String,
  status: { type: String, default: 'new' },
  adminNotes: String,
  createdAt: { type: String, default: () => new Date().toISOString() },
}, { timestamps: false });

const testimonialSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  clientName: String,
  role: String,
  company: String,
  projectType: String,
  feedback: String,
  rating: Number,
  isDemo: Boolean,
}, { timestamps: true });

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
export const Testimonial = mongoose.model('Testimonial', testimonialSchema);
