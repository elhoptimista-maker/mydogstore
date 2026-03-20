
/**
 * @fileOverview Servicio para la gestión de datos extendidos del usuario en Firestore.
 * Maneja el perfil, favoritos y sincronización.
 */

import { 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  onSnapshot,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { errorEmitter, FirestorePermissionError } from "@/lib/error-emitter";

/**
 * Obtiene el documento completo del usuario desde Firestore.
 */
export async function getUserData(uid: string) {
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}

/**
 * Actualiza el perfil extendido del usuario en Firestore.
 */
export async function updateUserProfile(data: any) {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay sesión activa");

  // 1. Si hay nombre, actualizar en Firebase Auth
  if (data.displayName) {
    await updateProfile(user, { displayName: data.displayName });
  }

  // 2. Actualizar todo en Firestore
  const userRef = doc(db, "users", user.uid);
  
  // Usar set con merge por si el documento no existe (primera vez)
  setDoc(userRef, { 
    ...data,
    updatedAt: serverTimestamp() 
  }, { merge: true }).catch(async () => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: userRef.path,
      operation: 'update',
      requestResourceData: data
    }));
  });
}

/**
 * Sincroniza un producto favorito en Firestore.
 */
export function syncWishlistItem(productId: string, action: 'add' | 'remove') {
  const user = auth.currentUser;
  if (!user) return;

  const favRef = doc(db, "users", user.uid, "wishlist", productId);

  if (action === 'add') {
    const data = { productId, addedAt: serverTimestamp() };
    setDoc(favRef, data).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: favRef.path,
        operation: 'create',
        requestResourceData: data
      }));
    });
  } else {
    deleteDoc(favRef).catch(async () => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: favRef.path,
        operation: 'delete'
      }));
    });
  }
}

/**
 * Escucha en tiempo real los favoritos del usuario.
 */
export function subscribeToWishlist(userId: string, callback: (ids: string[]) => void) {
  const wishlistRef = collection(db, "users", userId, "wishlist");
  return onSnapshot(wishlistRef, (snapshot) => {
    const ids = snapshot.docs.map(doc => doc.id);
    callback(ids);
  }, async (error) => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: wishlistRef.path,
      operation: 'list'
    }));
  });
}
