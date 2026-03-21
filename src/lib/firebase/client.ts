import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Durante el build de Next.js, las variables de entorno pueden no estar presentes.
// Evitamos que Firebase lance un error de "invalid-api-key" inicializando solo si hay una API Key presente.
const app = (getApps().length === 0 && firebaseConfig.apiKey) 
  ? initializeApp(firebaseConfig) 
  : (getApps().length > 0 ? getApp() : null);

// Exportamos proxies o nulls seguros si el app no se inicializó (entorno de build)
export const auth = app ? getAuth(app) : ({} as any);
export const db = app ? getFirestore(app) : ({} as any);
export default app;
