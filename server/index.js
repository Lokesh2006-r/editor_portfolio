import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { Project } from './models/Project.js';
import { SiteConfig } from './models/SiteConfig.js';
import { Service } from './models/Service.js';
import { Inquiry, Testimonial } from './models/Inquiry.js';

dotenv.config();

const app = express();
const PORT = process.env.API_PORT || 4000;

// Build MongoDB URI safely — encodeURIComponent handles special chars in password
function buildMongoUri() {
  const uri = process.env.MONGODB_URI;
  if (uri && !uri.includes('YOUR_MONGODB')) return uri; // already a full URI

  const user = process.env.MONGODB_USERNAME;
  const pass = process.env.MONGODB_PASSWORD;
  const cluster = process.env.MONGODB_CLUSTER;
  const db = process.env.MONGODB_DBNAME || 'editor_portfolio';

  if (!user || !pass || !cluster) return null;

  return `mongodb+srv://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${cluster}/${db}?retryWrites=true&w=majority&appName=editorportfolio`;
}

const MONGO_URI = buildMongoUri();

// ──────────────────────────────────────────────
// Middleware
// ──────────────────────────────────────────────
app.use(cors({
  origin: ['http://localhost:3000', 'http://0.0.0.0:3000', process.env.APP_URL].filter(Boolean),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// ──────────────────────────────────────────────
// MongoDB Atlas Connection
// ──────────────────────────────────────────────
let dbConnected = false;

async function connectDB() {
  if (!MONGO_URI) {
    console.warn('[MongoDB] MONGODB_URI not set. Running in offline mode.');
    return;
  }
  try {
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
    });
    dbConnected = true;
    console.log('[MongoDB] ✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('[MongoDB] ❌ Connection failed:', err.message);
    dbConnected = false;
  }
}

// ──────────────────────────────────────────────
// Health / Status
// ──────────────────────────────────────────────
app.get('/api/status', (req, res) => {
  res.json({
    ok: true,
    db: dbConnected ? 'connected' : 'disconnected',
    mongoConfigured: !!MONGO_URI,
    timestamp: new Date().toISOString(),
  });
});

// ──────────────────────────────────────────────
// PROJECTS — CRUD
// ──────────────────────────────────────────────
app.get('/api/projects', async (req, res) => {
  try {
    const docs = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/projects/:id', async (req, res) => {
  try {
    const doc = await Project.findOne({ id: req.params.id });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.id) payload.id = `proj-${Date.now()}`;
    const doc = await Project.findOneAndUpdate(
      { id: payload.id },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const doc = await Project.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/projects/:id', async (req, res) => {
  try {
    await Project.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Bulk sync – replace entire projects collection
app.post('/api/projects/bulk-sync', async (req, res) => {
  try {
    const projects = req.body;
    if (!Array.isArray(projects)) return res.status(400).json({ error: 'Expected array' });

    const ops = projects.map((p) => ({
      updateOne: {
        filter: { id: p.id },
        update: { $set: p },
        upsert: true,
      },
    }));
    if (ops.length > 0) await Project.bulkWrite(ops);
    res.json({ synced: ops.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ──────────────────────────────────────────────
// SERVICES — CRUD
// ──────────────────────────────────────────────
app.get('/api/services', async (req, res) => {
  try {
    const docs = await Service.find().sort({ number: 1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/services', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.id) payload.id = `svc-${Date.now()}`;
    const doc = await Service.findOneAndUpdate(
      { id: payload.id },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/services/:id', async (req, res) => {
  try {
    const doc = await Service.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    await Service.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/services/bulk-sync', async (req, res) => {
  try {
    const services = req.body;
    if (!Array.isArray(services)) return res.status(400).json({ error: 'Expected array' });
    const ops = services.map((s) => ({
      updateOne: { filter: { id: s.id }, update: { $set: s }, upsert: true },
    }));
    if (ops.length > 0) await Service.bulkWrite(ops);
    res.json({ synced: ops.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ──────────────────────────────────────────────
// TESTIMONIALS — CRUD
// ──────────────────────────────────────────────
app.get('/api/testimonials', async (req, res) => {
  try {
    const docs = await Testimonial.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.id) payload.id = `tes-${Date.now()}`;
    const doc = await Testimonial.findOneAndUpdate(
      { id: payload.id },
      payload,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/testimonials/:id', async (req, res) => {
  try {
    const doc = await Testimonial.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/testimonials/:id', async (req, res) => {
  try {
    await Testimonial.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/testimonials/bulk-sync', async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected array' });
    const ops = items.map((t) => ({
      updateOne: { filter: { id: t.id }, update: { $set: t }, upsert: true },
    }));
    if (ops.length > 0) await Testimonial.bulkWrite(ops);
    res.json({ synced: ops.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ──────────────────────────────────────────────
// INQUIRIES — Create & Read & Update status
// ──────────────────────────────────────────────
app.get('/api/inquiries', async (req, res) => {
  try {
    const docs = await Inquiry.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/inquiries', async (req, res) => {
  try {
    const payload = { ...req.body };
    if (!payload.id) payload.id = `inq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    if (!payload.createdAt) payload.createdAt = new Date().toISOString();
    if (!payload.status) payload.status = 'new';
    const doc = new Inquiry(payload);
    await doc.save();
    res.status(201).json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/inquiries/:id/status', async (req, res) => {
  try {
    const doc = await Inquiry.findOneAndUpdate(
      { id: req.params.id },
      { status: req.body.status },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/inquiries/:id/notes', async (req, res) => {
  try {
    const doc = await Inquiry.findOneAndUpdate(
      { id: req.params.id },
      { adminNotes: req.body.adminNotes },
      { new: true }
    );
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/inquiries/:id', async (req, res) => {
  try {
    await Inquiry.findOneAndDelete({ id: req.params.id });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/inquiries/bulk-sync', async (req, res) => {
  try {
    const items = req.body;
    if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected array' });
    const ops = items.map((i) => ({
      updateOne: { filter: { id: i.id }, update: { $set: i }, upsert: true },
    }));
    if (ops.length > 0) await Inquiry.bulkWrite(ops);
    res.json({ synced: ops.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ──────────────────────────────────────────────
// SITE CONFIG — Singleton
// ──────────────────────────────────────────────
app.get('/api/config', async (req, res) => {
  try {
    const doc = await SiteConfig.findOne({ _key: 'singleton' });
    res.json(doc || null);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/config', async (req, res) => {
  try {
    const doc = await SiteConfig.findOneAndUpdate(
      { _key: 'singleton' },
      { ...req.body, _key: 'singleton' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(doc);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ──────────────────────────────────────────────
// Start Server
// ──────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`[API] 🚀 Studio API running at http://localhost:${PORT}`);
    console.log(`[API] DB Status: ${dbConnected ? '✅ MongoDB Atlas Connected' : '⚠️  Offline mode (localStorage fallback active)'}`);
  });
});
