"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const APP_NAME = 'ERP_CLIENT_APP';

const erpFirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_ERP_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_ERP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_ERP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_ERP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_ERP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_ERP_FIREBASE_APP_ID,
};

/**
 * Inicializa y retorna la instancia de Firestore del ERP en el cliente usando un Singleton.
 */
export function getErpDbClient() {
  const app = getApps().find(a => a.name === APP_NAME) 
    ? getApp(APP_NAME) 
    : initializeApp(erpFirebaseConfig, APP_NAME);
  return getFirestore(app);
}