import * as admin from 'firebase-admin';

const APP_NAME = 'ERP_ADMIN_APP';

/**
 * Inicializa y retorna la instancia de Firestore administrativa para el ERP usando un Singleton.
 * Maneja de forma segura la ausencia de credenciales durante el build de Next.js.
 */
export function getErpDbAdmin() {
  const existingApp = admin.apps.find(app => app?.name === APP_NAME);
  if (existingApp) {
    return existingApp.firestore();
  }

  const projectId = process.env.ERP_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.ERP_FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.ERP_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // Si faltan credenciales (común en el build), retornamos un proxy para evitar crashes
  if (!projectId || !clientEmail || !privateKey) {
    return {
      collection: () => ({
        doc: () => ({ get: () => Promise.resolve({ exists: false, data: () => ({}) }) }),
        where: () => ({ get: () => Promise.resolve({ empty: true, docs: [] }), limit: () => ({ get: () => Promise.resolve({ empty: true, docs: [] }) }) }),
      })
    } as any;
  }

  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
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

  const projectId = process.env.ERP_FIREBASE_PROJECT_ID;
  const clientEmail = process.env.ERP_FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.ERP_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) return {} as any;

  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  }, APP_NAME);

  return app.auth();
}
