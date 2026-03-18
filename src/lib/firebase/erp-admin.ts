/**
 * @fileOverview Inicialización de Firebase Admin para el ERP (Lado Servidor).
 * Utiliza privilegios elevados para transacciones seguras y verificación de tokens.
 */

import * as admin from "firebase-admin";

/**
 * Inicializa la aplicación administrativa del ERP de forma persistente en el servidor.
 */
export function getErpAdmin() {
  if (!admin.apps.find(app => app?.name === "erp-admin")) {
    const serviceAccount = JSON.parse(
      process.env.ERP_FIREBASE_SERVICE_ACCOUNT || "{}"
    );

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
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
