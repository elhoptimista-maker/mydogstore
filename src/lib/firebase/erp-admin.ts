/**
 * @fileOverview Inicialización de Firebase Admin para el ERP (Lado Servidor).
 * Utiliza privilegios elevados para transacciones seguras y verificación de tokens.
 * Lee las credenciales del Service Account desde variables de entorno individuales.
 */

import * as admin from "firebase-admin";

/**
 * Inicializa la aplicación administrativa del ERP de forma persistente en el servidor.
 */
export function getErpAdmin() {
  if (!admin.apps.find(app => app?.name === "erp-admin")) {
    const projectId = process.env.ERP_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.ERP_FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.ERP_FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.error("ERP Admin: Missing required environment variables (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY).");
    }

    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    }, "erp-admin");
  }
  
  return admin.app("erp-admin");
}

/**
 * Retorna la instancia de Firestore administrativa para el ERP.
 */
export function getErpAdminDb() {
  const app = getErpAdmin();
  return app.firestore();
}

/**
 * Retorna la instancia de Auth administrativa para el ERP.
 */
export function getErpAdminAuth() {
  const app = getErpAdmin();
  return app.auth();
}
