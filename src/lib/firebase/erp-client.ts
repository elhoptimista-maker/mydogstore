"use client";

/**
 * @fileOverview Inicialización de la aplicación secundaria de Firebase para el ERP (Lado Cliente).
 * Proporciona acceso a la base de datos del ERP para lecturas directas del catálogo.
 * Utiliza variables de entorno con prefijo NEXT_PUBLIC_ para seguridad en el cliente.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

const erpFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_ERP_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_ERP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_ERP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_ERP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_ERP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_ERP_FIREBASE_APP_ID,
};

let erpApp: FirebaseApp;
let erpDb: Firestore;

/**
 * Inicializa y retorna la instancia de la app ERP en el cliente de forma segura.
 */
export function getErpClient() {
  if (!getApps().find(app => app.name === "erp-app")) {
    // Verificación básica de configuración
    if (!erpFirebaseConfig.apiKey) {
      console.warn("ERP Client: Missing NEXT_PUBLIC_ERP_FIREBASE_API_KEY environment variable.");
    }
    erpApp = initializeApp(erpFirebaseConfig, "erp-app");
  } else {
    erpApp = getApp("erp-app");
  }

  erpDb = getFirestore(erpApp);
  return { erpApp, erpDb };
}
