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
import { auth } from "@/lib/firebase/client";

/**
 * Registra un nuevo usuario y actualiza su perfil con el nombre proporcionado.
 */
export async function registerUser(email: string, password: string, displayName: string): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Actualizar el nombre del perfil inmediatamente después de la creación
    await updateProfile(userCredential.user, {
      displayName: displayName
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
