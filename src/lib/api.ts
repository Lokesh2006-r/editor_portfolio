/**
 * MongoDB Atlas API Client
 *
 * Communicates with the Express API server (server/index.js).
 * If the server is offline, operations fall back to localStorage via the `storage` module.
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// ──────────────────────────────────────────────────────────
// Connection Status
// ──────────────────────────────────────────────────────────

export interface ApiStatus {
  online: boolean;
  db: 'connected' | 'disconnected';
  mongoConfigured: boolean;
  lastChecked: string;
}

let _statusCache: ApiStatus = {
  online: false,
  db: 'disconnected',
  mongoConfigured: false,
  lastChecked: '',
};

export async function checkApiStatus(): Promise<ApiStatus> {
  try {
    const res = await fetch(`${API_BASE}/status`, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) throw new Error('Not OK');
    const data = await res.json();
    _statusCache = {
      online: true,
      db: data.db,
      mongoConfigured: data.mongoConfigured,
      lastChecked: new Date().toISOString(),
    };
  } catch {
    _statusCache = {
      online: false,
      db: 'disconnected',
      mongoConfigured: false,
      lastChecked: new Date().toISOString(),
    };
  }
  return _statusCache;
}

export function getCachedApiStatus(): ApiStatus {
  return _statusCache;
}

// ──────────────────────────────────────────────────────────
// Generic fetch helper
// ──────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    signal: options.signal ?? AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

// ──────────────────────────────────────────────────────────
// PROJECTS
// ──────────────────────────────────────────────────────────

export const projectsApi = {
  getAll: () => apiFetch<any[]>('/projects'),
  getOne: (id: string) => apiFetch<any>(`/projects/${id}`),
  create: (data: any) => apiFetch<any>('/projects', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch<any>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch<any>(`/projects/${id}`, { method: 'DELETE' }),
  bulkSync: (projects: any[]) => apiFetch<any>('/projects/bulk-sync', { method: 'POST', body: JSON.stringify(projects) }),
};

// ──────────────────────────────────────────────────────────
// SERVICES
// ──────────────────────────────────────────────────────────

export const servicesApi = {
  getAll: () => apiFetch<any[]>('/services'),
  create: (data: any) => apiFetch<any>('/services', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch<any>(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch<any>(`/services/${id}`, { method: 'DELETE' }),
  bulkSync: (services: any[]) => apiFetch<any>('/services/bulk-sync', { method: 'POST', body: JSON.stringify(services) }),
};

// ──────────────────────────────────────────────────────────
// TESTIMONIALS
// ──────────────────────────────────────────────────────────

export const testimonialsApi = {
  getAll: () => apiFetch<any[]>('/testimonials'),
  create: (data: any) => apiFetch<any>('/testimonials', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string, data: any) => apiFetch<any>(`/testimonials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiFetch<any>(`/testimonials/${id}`, { method: 'DELETE' }),
  bulkSync: (items: any[]) => apiFetch<any>('/testimonials/bulk-sync', { method: 'POST', body: JSON.stringify(items) }),
};

// ──────────────────────────────────────────────────────────
// INQUIRIES
// ──────────────────────────────────────────────────────────

export const inquiriesApi = {
  getAll: () => apiFetch<any[]>('/inquiries'),
  create: (data: any) => apiFetch<any>('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
  updateStatus: (id: string, status: string) =>
    apiFetch<any>(`/inquiries/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  updateNotes: (id: string, adminNotes: string) =>
    apiFetch<any>(`/inquiries/${id}/notes`, { method: 'PUT', body: JSON.stringify({ adminNotes }) }),
  delete: (id: string) => apiFetch<any>(`/inquiries/${id}`, { method: 'DELETE' }),
  bulkSync: (items: any[]) => apiFetch<any>('/inquiries/bulk-sync', { method: 'POST', body: JSON.stringify(items) }),
};

// ──────────────────────────────────────────────────────────
// SITE CONFIG
// ──────────────────────────────────────────────────────────

export const configApi = {
  get: () => apiFetch<any>('/config'),
  update: (data: any) => apiFetch<any>('/config', { method: 'PUT', body: JSON.stringify(data) }),
};
