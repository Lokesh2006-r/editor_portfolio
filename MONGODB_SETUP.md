# MongoDB Atlas Integration Guide

This project now supports **MongoDB Atlas** as a cloud database for persisting all portfolio data (projects, services, testimonials, inquiries, site config).

## Architecture

```
Browser (React + Vite)           Express API Server
      localhost:3000         ↔       localhost:4000        ↔   MongoDB Atlas
         (Frontend)                  (server/index.js)          (cloud DB)
```

- The **frontend** always works with **localStorage** first (offline mode)
- The **Express API server** (`server/index.js`) bridges the frontend to MongoDB Atlas
- Use the **Admin → Data** tab to push/pull data between localStorage and Atlas

---

## Setup Steps

### 1. Create a MongoDB Atlas Cluster (Free)

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Sign up / Log in → Create a **free M0 cluster**
3. Go to **Database Access** → Add a new database user (username + password)
4. Go to **Network Access** → Add IP: `0.0.0.0/0` (allow all for development)
5. Go to your cluster → Click **Connect** → **Connect your application**
6. Copy the connection string (looks like `mongodb+srv://username:password@cluster.mongodb.net/`)

### 2. Configure Environment Variables

Edit your `.env` file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/editor_portfolio?retryWrites=true&w=majority
API_PORT=4000
VITE_API_URL=http://localhost:4000/api
```

Replace `<username>`, `<password>`, and `<cluster>` with your actual values.

### 3. Run Both Servers

Open **two terminal windows**:

**Terminal 1 — Frontend (Vite):**
```bash
npm run dev
```

**Terminal 2 — API Server (Express + MongoDB):**
```bash
npm run server
```

Or use `npm run dev:api` for auto-restart on file changes.

---

## Using the MongoDB Sync in Admin

1. Open the site → click **Admin** in the navbar
2. Log in with your admin credentials
3. Go to the **Data** tab (last icon in sidebar)
4. Click **Check Status** to verify the API server and MongoDB connection
5. Use **Push to MongoDB Atlas** to upload all your local data to the cloud
6. Use **Pull from MongoDB Atlas** to download cloud data to your local browser

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/status` | Server & DB health check |
| GET/POST/PUT/DELETE | `/api/projects` | CRUD for projects |
| POST | `/api/projects/bulk-sync` | Bulk upsert projects |
| GET/POST/PUT/DELETE | `/api/services` | CRUD for services |
| POST | `/api/services/bulk-sync` | Bulk upsert services |
| GET/POST/PUT/DELETE | `/api/testimonials` | CRUD for testimonials |
| POST | `/api/testimonials/bulk-sync` | Bulk upsert testimonials |
| GET/POST | `/api/inquiries` | CRUD for inquiries |
| PUT | `/api/inquiries/:id/status` | Update inquiry status |
| PUT | `/api/inquiries/:id/notes` | Update admin notes |
| POST | `/api/inquiries/bulk-sync` | Bulk upsert inquiries |
| GET/PUT | `/api/config` | Site config singleton |
