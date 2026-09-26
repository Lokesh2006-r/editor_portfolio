/**
 * Firebase Client & Connection Status
 * 
 * Provides graceful detection and safe fallback when Firebase is not yet provisioned.
 * When Firebase credentials or firebase-applet-config.json are provided,
 * live Firestore synchronization can be activated.
 */

export interface FirebaseStatus {
  isConfigured: boolean;
  projectId?: string;
  hasAuth: boolean;
  hasFirestore: boolean;
  mode: 'local_storage' | 'firebase_live';
  notice: string;
}

export function getFirebaseStatus(): FirebaseStatus {
  const envProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  const envApiKey = import.meta.env.VITE_FIREBASE_API_KEY;

  if (envProjectId && envApiKey) {
    return {
      isConfigured: true,
      projectId: envProjectId,
      hasAuth: true,
      hasFirestore: true,
      mode: 'firebase_live',
      notice: 'Connected to live Firebase Cloud project.'
    };
  }

  return {
    isConfigured: false,
    hasAuth: false,
    hasFirestore: false,
    mode: 'local_storage',
    notice: 'Operating in self-contained local storage mode. To connect live Firebase, set VITE_FIREBASE_PROJECT_ID and VITE_FIREBASE_API_KEY in environment variables.'
  };
}
