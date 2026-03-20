/**
 * @fileOverview Servicio de Autenticación para el E-commerce.
 * Proporciona métodos para el registro, inicio de sesión y cierre de sesión de usuarios.
 */

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  updateProfile,
  UserCredential
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

/**
 * Registra un nuevo usuario, actualiza su perfil y guarda sus datos en Firestore.
 */
export async function registerUser(email: string, password: string, displayName: string): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 1. Actualizar el perfil en Firebase Auth
    await updateProfile(user, {
      displayName: displayName
    });

    // 2. Crear documento de usuario en Firestore para persistencia
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: email,
      displayName: displayName,
      role: 'customer',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    });
    
    return userCredential;
  } catch (error: any) {
    throw error;
  }
}

/**
 * Inicia sesión de un usuario existente.
 */
export async function loginUser(email: string, password: string): Promise<UserCredential> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Actualizar última conexión en Firestore de forma no bloqueante
    const user = userCredential.user;
    setDoc(doc(db, "users", user.uid), {
      lastLogin: serverTimestamp()
    }, { merge: true });

    return userCredential;
  } catch (error: any) {
    throw error;
  }
}

/**
 * Cierra la sesión del usuario actual.
 */
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw error;
  }
}
