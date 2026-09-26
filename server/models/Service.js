import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  number: String,
  title: String,
  shortDesc: String,
  features: [String],
  icon: String,
  deliverableTimeframe: String,
  pricingStartingAt: String,
}, { timestamps: true });

export const Service = mongoose.model('Service', serviceSchema);
