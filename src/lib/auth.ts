import { AdminCredentials, AdminSession } from '../types';

const ADMIN_CREDS_KEY = 'kaien_admin_credentials_v1';
const ADMIN_SESSION_KEY = 'kaien_admin_session_v1';

// Default initial credentials (visible to demo user on login screen)
export const DEFAULT_ADMIN_CREDENTIALS = {
  email: 'admin@kaienvance.com',
  username: 'admin',
  password: 'cinema@2025',
};

// Simple reproducible hash for client-side storage
function hashPassword(pass: string): string {
  let hash = 0;
  for (let i = 0; i < pass.length; i++) {
    const char = pass.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(36)}_${pass.length}`;
}

export const auth = {
  getCredentials(): AdminCredentials {
    try {
      const data = localStorage.getItem(ADMIN_CREDS_KEY);
      if (!data) {
        const initial: AdminCredentials = {
          email: DEFAULT_ADMIN_CREDENTIALS.email,
          username: DEFAULT_ADMIN_CREDENTIALS.username,
          passwordHash: hashPassword(DEFAULT_ADMIN_CREDENTIALS.password),
          updatedAt: new Date().toISOString(),
        };
        localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return {
        email: DEFAULT_ADMIN_CREDENTIALS.email,
        username: DEFAULT_ADMIN_CREDENTIALS.username,
        passwordHash: hashPassword(DEFAULT_ADMIN_CREDENTIALS.password),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  getSession(): AdminSession | null {
    try {
      const data = localStorage.getItem(ADMIN_SESSION_KEY);
      if (!data) return null;
      const session: AdminSession = JSON.parse(data);
      return session;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  },

  login(identifier: string, passwordAttempt: string): { success: boolean; error?: string; session?: AdminSession } {
    const creds = this.getCredentials();
    const cleanId = identifier.trim().toLowerCase();
    const isEmailMatch = creds.email.toLowerCase() === cleanId;
    const isUserMatch = creds.username.toLowerCase() === cleanId;

    if (!isEmailMatch && !isUserMatch) {
      return { success: false, error: 'Invalid email/username or password.' };
    }

    const hashedAttempt = hashPassword(passwordAttempt);
    if (hashedAttempt !== creds.passwordHash) {
      return { success: false, error: 'Invalid email/username or password.' };
    }

    const session: AdminSession = {
      token: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      email: creds.email,
      username: creds.username,
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    window.dispatchEvent(new Event('portfolio_auth_changed'));
    return { success: true, session };
  },

  logout(): void {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    window.dispatchEvent(new Event('portfolio_auth_changed'));
  },

  updateCredentials(
    currentPasswordAttempt: string,
    newEmail: string,
    newUsername: string,
    newPassword?: string
  ): { success: boolean; error?: string } {
    const creds = this.getCredentials();
    if (hashPassword(currentPasswordAttempt) !== creds.passwordHash) {
      return { success: false, error: 'Current password does not match.' };
    }

    if (!newEmail || !newEmail.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }

    const updated: AdminCredentials = {
      email: newEmail.trim().toLowerCase(),
      username: newUsername.trim() || creds.username,
      passwordHash: newPassword && newPassword.length >= 6 ? hashPassword(newPassword) : creds.passwordHash,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(updated));

    // Update active session with new email/user
    const session = this.getSession();
    if (session) {
      session.email = updated.email;
      session.username = updated.username;
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
    }

    window.dispatchEvent(new Event('portfolio_auth_changed'));
    return { success: true };
  },

  resetToDefaultCredentials(): void {
    const initial: AdminCredentials = {
      email: DEFAULT_ADMIN_CREDENTIALS.email,
      username: DEFAULT_ADMIN_CREDENTIALS.username,
      passwordHash: hashPassword(DEFAULT_ADMIN_CREDENTIALS.password),
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(ADMIN_CREDS_KEY, JSON.stringify(initial));
    window.dispatchEvent(new Event('portfolio_auth_changed'));
  },
};
