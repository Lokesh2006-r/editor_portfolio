import { z } from 'zod';

export const inquiryFormSchema = z.object({
  fullName: z.string().min(2, { message: 'Full name must be at least 2 characters.' }).max(80),
  email: z.string().email({ message: 'Please provide a valid email address.' }).max(100),
  whatsappNumber: z.string().max(30).optional().or(z.literal('')),
  projectType: z.string().min(1, { message: 'Please select a project type.' }),
  estimatedBudget: z.string().max(50).optional().or(z.literal('')),
  preferredDeliveryDate: z.string().max(50).optional().or(z.literal('')),
  projectDescription: z.string().min(15, { message: 'Please share at least a brief description (min 15 characters).' }).max(2000),
  referenceLink: z.string().max(250).optional().or(z.literal('')),
  consent: z.boolean().refine((val) => val === true, {
    message: 'You must acknowledge the consent terms to submit.',
  }),
});

export type InquiryFormData = z.infer<typeof inquiryFormSchema>;

export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required').max(100),
  category: z.enum(['cinematic', 'commercial', 'travel', 'weddings', 'reels']),
  categoryLabel: z.string().min(2, 'Category label is required'),
  year: z.string().regex(/^\d{4}$/, 'Must be a 4-digit year'),
  client: z.string().max(80).optional(),
  duration: z.string().min(1, 'Duration is required (e.g. 02:45)'),
  thumbnail: z.string().min(1, 'Thumbnail path or URL is required'),
  videoUrl: z.string().optional(),
  aspectRatio: z.enum(['16:9', '9:16', '4:3']).default('16:9'),
  overview: z.string().min(10, 'Overview is required'),
  role: z.string().min(2, 'Role is required'),
  creativeApproach: z.string().min(10, 'Creative approach is required'),
  editingTechniques: z.string(), // Comma-separated in form
  toolsUsed: z.string(), // Comma-separated in form
  deliverables: z.string(), // Comma-separated in form
  featured: z.boolean().default(false),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
