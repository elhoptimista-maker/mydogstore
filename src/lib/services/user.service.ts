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
  if (!db) return null;
  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);
  return snap.exists() ? snap.data() : null;
}

/**
 * Actualiza el perfil extendido del usuario en Firestore.
 */
export async function updateUserProfile(data: any) {
  if (!auth || !db) throw new Error("Firebase no está inicializado.");
  const user = auth.currentUser;
  if (!user) throw new Error("No hay sesión activa");

  if (data.displayName) {
    await updateProfile(user, { displayName: data.displayName });
  }

  const userRef = doc(db, "users", user.uid);
  
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
  if (!auth || !db) return;
  const user = auth.currentUser;
  if (!user) return;

  const favRef = doc(db, "users", user.uid, "wishlist", productId);

  if (action === 'add') {
    const data = { productId, addedAt: serverTimestamp(), notifyWhenInStock: false };
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
 * Activa o desactiva la notificación de stock para un producto favorito.
 */
export async function toggleStockNotification(productId: string, enabled: boolean) {
  if (!auth || !db) return;
  const user = auth.currentUser;
  if (!user) return;

  const favRef = doc(db, "users", user.uid, "wishlist", productId);
  await updateDoc(favRef, { notifyWhenInStock: enabled }).catch(async () => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: favRef.path,
      operation: 'update'
    }));
  });
}

/**
 * Escucha en tiempo real los favoritos del usuario.
 * Retorna tanto los IDs como sus flags de notificación.
 */
export function subscribeToWishlist(userId: string, callback: (items: {id: string, notify: boolean}[]) => void) {
  if (!db) return () => {};
  const wishlistRef = collection(db, "users", userId, "wishlist");
  return onSnapshot(wishlistRef, (snapshot) => {
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      notify: doc.data().notifyWhenInStock || false
    }));
    callback(items);
  }, async (error) => {
    errorEmitter.emit('permission-error', new FirestorePermissionError({
      path: wishlistRef.path,
      operation: 'list'
    }));
  });
}
