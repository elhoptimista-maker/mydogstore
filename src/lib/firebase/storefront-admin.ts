
import * as admin from 'firebase-admin';

const APP_NAME = 'STOREFRONT_ADMIN_APP';

/**
 * Inicializa y retorna la instancia de administración para el proyecto local (Storefront).
 * Se usa principalmente para verificar tokens de identidad de los usuarios del e-commerce.
 */
export function getStorefrontAdmin() {
  const existingApp = admin.apps.find(app => app?.name === APP_NAME);
  if (existingApp) return existingApp;

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  }, APP_NAME);
}

export function getStorefrontAuthAdmin() {
  return getStorefrontAdmin().auth();
}

export function getStorefrontDbAdmin() {
  return getStorefrontAdmin().firestore();
}
