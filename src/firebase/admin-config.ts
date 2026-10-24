// src/firebase/admin-config.ts
import * as admin from 'firebase-admin';
import * as fs from 'fs';
import { PORTAL_SERVICE_ACCOUNT } from './portal-credentials';

const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  throw new Error('The FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. This is required for server-side authentication.');
}

// Parse the service account key from the environment variable
let serviceAccount;
try {
  serviceAccount = JSON.parse(serviceAccountKey);
} catch (e) {
  throw new Error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it is a valid JSON string.');
}


export const initAdminApp = () => {
  if (admin.apps.length > 0) {
    const mainApp = admin.apps.find(app => app?.name === '[DEFAULT]');
    if (mainApp) return mainApp;
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  } catch (error: any) {
    console.error("Firebase admin initialization error", error.stack);
    throw error;
  }
};

/**
 * Initializes the secondary app (Project A / Portal DEA) to validate external tokens.
 */
export const initPortalAdminApp = () => {
  const portalApp = admin.apps.find(app => app?.name === 'portal-dea');
  if (portalApp) return portalApp;

  const portalKeyPath = process.env.PORTAL_DEA_SERVICE_ACCOUNT_KEY || process.env.PORTAL_DEA_SERVICE_ACCOUNT_PATH;
  let portalServiceAccount: any = null;

  if (portalKeyPath) {
    try {
      if (portalKeyPath.trim().startsWith('{')) {
        portalServiceAccount = JSON.parse(portalKeyPath);
      } else if (fs.existsSync(portalKeyPath)) {
        const fileContent = fs.readFileSync(portalKeyPath, 'utf8');
        portalServiceAccount = JSON.parse(fileContent);
      }
    } catch (e) {
      console.warn("Error leyendo portalKeyPath, usando credenciales integradas:", e);
    }
  }

  // Fallback garantizado a credenciales integradas de Portal DEA
  if (!portalServiceAccount) {
    portalServiceAccount = PORTAL_SERVICE_ACCOUNT;
  }

  try {
    return admin.initializeApp({
      credential: admin.credential.cert(portalServiceAccount),
    }, 'portal-dea');
  } catch (error) {
    console.error("Failed to initialize Portal Admin App:", error);
    return null;
  }
};
