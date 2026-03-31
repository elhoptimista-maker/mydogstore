"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SanitizedProduct } from '@/types/product';
import { toast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { syncWishlistItem, subscribeToWishlist, toggleStockNotification } from '@/lib/services/user.service';
import { fetchProductById } from '@/actions/products';

interface WishlistContextType {
  wishlist: SanitizedProduct[];
  toggleWishlist: (product: SanitizedProduct) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  // Notificaciones de Stock
  isNotified: (id: string) => boolean;
  toggleNotification: (id: string) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<SanitizedProduct[]>([]);
  const [notifications, setNotifications] = useState<Record<string, boolean>>({});

  // 1. Cargar desde LocalStorage inicialmente (para invitados)
  useEffect(() => {
    const saved = localStorage.getItem('mydog_wishlist');
    if (saved) {
      try { 
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setWishlist(parsed);
      } catch (e) {}
    }
  }, []);

  // 2. Sincronizar con Firestore cuando el usuario se loguea
  useEffect(() => {
    if (!auth) return;
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (user) {
        unsubscribeFirestore = subscribeToWishlist(user.uid, async (items) => {
          try {
            const ids = items.map(i => i.id);
            const notifyMap = items.reduce((acc, i) => ({ ...acc, [i.id]: i.notify }), {});
            setNotifications(notifyMap);

            const fetchedProducts = await Promise.all(
              ids.map(id => fetchProductById(id))
            );

            const validProducts = fetchedProducts.filter((p): p is SanitizedProduct => p !== null);
            const uniqueMap = new Map();
            validProducts.forEach(p => uniqueMap.set(p.id, p));
            const finalProducts = Array.from(uniqueMap.values());

            setWishlist(finalProducts);
            localStorage.setItem('mydog_wishlist', JSON.stringify(finalProducts));
          } catch (error) {
            console.error("Error sincronizando wishlist:", error);
          }
        });
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  const toggleWishlist = (product: SanitizedProduct) => {
    const exists = wishlist.some(item => item.id === product.id);
    const user = auth?.currentUser;

    if (exists) {
      const updated = wishlist.filter(item => item.id !== product.id);
      setWishlist(updated);
      localStorage.setItem('mydog_wishlist', JSON.stringify(updated));
      
      if (user) syncWishlistItem(product.id, 'remove');
      toast({ title: "Eliminado de favoritos 💔", description: `${product.name} ya no está en tu lista.` });
    } else {
      const updated = [...wishlist, product];
      setWishlist(updated);
      localStorage.setItem('mydog_wishlist', JSON.stringify(updated));
      
      if (user) syncWishlistItem(product.id, 'add');
      toast({ title: "¡Añadido a favoritos! ❤️", description: `${product.name} se guardó en tu lista.` });
    }
  };

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);
  
  const isNotified = (id: string) => notifications[id] || false;

  const toggleNotification = async (id: string) => {
    const user = auth?.currentUser;
    if (!user) {
      toast({ variant: "destructive", title: "Inicia sesión", description: "Debes estar registrado para recibir avisos de stock." });
      return;
    }

    const currentState = isNotified(id);
    try {
      await toggleStockNotification(id, !currentState);
      setNotifications(prev => ({ ...prev, [id]: !currentState }));
      toast({ 
        title: !currentState ? "¡Aviso activado! 🔔" : "Aviso desactivado", 
        description: !currentState ? "Te enviaremos un correo apenas vuelva el stock." : "Ya no recibirás alertas para este producto."
      });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudo actualizar la preferencia." });
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
    setNotifications({});
    localStorage.removeItem('mydog_wishlist');
  };

  return (
    <WishlistContext.Provider value={{ 
      wishlist, 
      toggleWishlist, 
      isInWishlist, 
      clearWishlist,
      isNotified,
      toggleNotification
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
