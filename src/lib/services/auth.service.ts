/**
 * @fileOverview Servicio de Autenticación para el E-commerce.
 * Proporciona métodos para el registro, inicio de sesión y cierre de sesión de usuarios.
 * Integra la persistencia de perfiles en Cloud Firestore.
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
import { errorEmitter, FirestorePermissionError } from "@/lib/error-emitter";

/**
 * Registra un nuevo usuario, actualiza su perfil en Auth y crea su documento en Firestore.
 */
export async function registerUser(email: string, password: string, displayName: string): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 1. Actualizar el perfil básico en Firebase Auth
    await updateProfile(user, {
      displayName: displayName
    });

    // 2. Crear documento de usuario en Firestore para persistencia de perfil
    const userDocRef = doc(db, "users", user.uid);
    const userData = {
      uid: user.uid,
      email: email,
      displayName: displayName,
      role: 'customer',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };

    // La escritura se inicia pero no bloquea el retorno del credential (escritura optimista)
    setDoc(userDocRef, userData).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'create',
        requestResourceData: userData
      }));
    });
    
    return userCredential;
  } catch (error: any) {
    throw error;
  }
}

/**
 * Inicia sesión de un usuario existente y actualiza su última conexión en Firestore.
 */
export async function loginUser(email: string, password: string): Promise<UserCredential> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Actualizar última conexión en Firestore
    const userDocRef = doc(db, "users", user.uid);
    const updateData = {
      lastLogin: serverTimestamp()
    };

    setDoc(userDocRef, updateData, { merge: true }).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: userDocRef.path,
        operation: 'update',
        requestResourceData: updateData
      }));
    });

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
