import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  categoryLabel: String,
  year: String,
  client: String,
  duration: String,
  thumbnail: String,
  videoUrl: String,
  aspectRatio: { type: String, default: '9:16' },
  overview: String,
  role: String,
  creativeApproach: String,
  editingTechniques: [String],
  toolsUsed: [String],
  deliverables: [String],
  behindTheScenesImg: String,
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 },
  isDemo: { type: Boolean, default: false },
}, { timestamps: true });

export const Project = mongoose.model('Project', projectSchema);
