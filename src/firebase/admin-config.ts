// src/firebase/admin-config.ts
import * as admin from 'firebase-admin';
import * as fs from 'fs';

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
  if (!portalKeyPath) {
    console.warn("PORTAL_DEA_SERVICE_ACCOUNT_PATH / PORTAL_DEA_SERVICE_ACCOUNT_KEY is not configured. Portal sync will not work.");
    return null;
  }

  try {
    let portalServiceAccount;
    // Handle both raw JSON string or file path
    if (portalKeyPath.trim().startsWith('{')) {
      portalServiceAccount = JSON.parse(portalKeyPath);
    } else {
      const fileContent = fs.readFileSync(portalKeyPath, 'utf8');
      portalServiceAccount = JSON.parse(fileContent);
    }

    return admin.initializeApp({
      credential: admin.credential.cert(portalServiceAccount),
    }, 'portal-dea');
  } catch (error) {
    console.error("Failed to initialize Portal Admin App:", error);
    return null;
  }
};
