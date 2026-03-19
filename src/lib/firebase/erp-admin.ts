import * as admin from 'firebase-admin';

const APP_NAME = 'ERP_ADMIN_APP';

/**
 * Inicializa y retorna la instancia de Firestore administrativa para el ERP usando un Singleton.
 */
export function getErpDbAdmin() {
  const existingApp = admin.apps.find(app => app?.name === APP_NAME);
  if (existingApp) {
    return existingApp.firestore();
  }

  // Sanitizar la llave privada para entornos Vercel/AppHosting
  const privateKey = process.env.ERP_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.ERP_FIREBASE_PROJECT_ID,
      clientEmail: process.env.ERP_FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  }, APP_NAME);

  return app.firestore();
}

/**
 * Retorna la instancia de Auth administrativa para el ERP usando el Singleton.
 */
export function getErpAuthAdmin() {
  const existingApp = admin.apps.find(app => app?.name === APP_NAME);
  if (existingApp) {
    return existingApp.auth();
  }

  const privateKey = process.env.ERP_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.ERP_FIREBASE_PROJECT_ID,
      clientEmail: process.env.ERP_FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  }, APP_NAME);

  return app.auth();
}