
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
  query,
  serverTimestamp,
  getDoc
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { SanitizedProduct } from "@/types/product";
import { errorEmitter, FirestorePermissionError } from "@/lib/error-emitter";

/**
 * Actualiza el nombre visible del usuario en Auth y Firestore.
 */
export async function updateUserProfile(displayName: string) {
  const user = auth.currentUser;
  if (!user) throw new Error("No hay sesión activa");

  // 1. Actualizar en Firebase Auth
  await updateProfile(user, { displayName });

  // 2. Actualizar en Firestore
  const userRef = doc(db, "users", user.uid);
  updateDoc(userRef, { displayName }).catch(async () => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: userRef.path,
      operation: 'update',
      requestResourceData: { displayName }
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
