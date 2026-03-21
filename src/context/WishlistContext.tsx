
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SanitizedProduct } from '@/types/product';
import { toast } from '@/hooks/use-toast';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { syncWishlistItem, subscribeToWishlist } from '@/lib/services/user.service';
import { fetchProductById } from '@/actions/products';

interface WishlistContextType {
  wishlist: SanitizedProduct[];
  toggleWishlist: (product: SanitizedProduct) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<SanitizedProduct[]>([]);

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
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      // Limpiar suscripción previa si existe
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
        unsubscribeFirestore = null;
      }

      if (user) {
        // Suscribirse a cambios en Firestore
        unsubscribeFirestore = subscribeToWishlist(user.uid, async (ids) => {
          try {
            // Hidratar los productos que vienen de Firestore
            const fetchedProducts = await Promise.all(
              ids.map(id => fetchProductById(id))
            );

            // Filtrar nulos y asegurar unicidad
            const validProducts = fetchedProducts.filter((p): p is SanitizedProduct => p !== null);
            
            // Usamos un Map para garantizar que no haya IDs duplicados en el estado
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
    const user = auth.currentUser;

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
  
  const clearWishlist = () => {
    setWishlist([]);
    localStorage.removeItem('mydog_wishlist');
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};
