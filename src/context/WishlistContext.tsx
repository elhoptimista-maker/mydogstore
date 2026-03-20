
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
  const [syncedIds, setSyncedIds] = useState<string[]>([]);

  // 1. Cargar desde LocalStorage inicialmente (para invitados)
  useEffect(() => {
    const saved = localStorage.getItem('mydog_wishlist');
    if (saved) {
      try { setWishlist(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  // 2. Sincronizar con Firestore cuando el usuario se loguea
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Suscribirse a cambios en Firestore
        const unsubscribeFirestore = subscribeToWishlist(user.uid, async (ids) => {
          setSyncedIds(ids);
          
          // Hidratar los productos que no tengamos en el estado actual
          const newProducts: SanitizedProduct[] = [];
          for (const id of ids) {
            if (!wishlist.some(p => p.id === id)) {
              const fullProduct = await fetchProductById(id);
              if (fullProduct) newProducts.push(fullProduct);
            }
          }
          
          setWishlist(prev => {
            const filtered = prev.filter(p => ids.includes(p.id));
            const merged = [...filtered, ...newProducts];
            localStorage.setItem('mydog_wishlist', JSON.stringify(merged));
            return merged;
          });
        });
        return () => unsubscribeFirestore();
      } else {
        setSyncedIds([]);
      }
    });
    return () => unsubscribe();
  }, []);

  const toggleWishlist = (product: SanitizedProduct) => {
    const exists = wishlist.some(item => item.id === product.id);
    const user = auth.currentUser;

    if (exists) {
      setWishlist(prev => prev.filter(item => item.id !== product.id));
      if (user) syncWishlistItem(product.id, 'remove');
      toast({ title: "Eliminado de favoritos 💔", description: `${product.name} ya no está en tu lista.` });
    } else {
      setWishlist(prev => [...prev, product]);
      if (user) syncWishlistItem(product.id, 'add');
      toast({ title: "¡Añadido a favoritos! ❤️", description: `${product.name} se guardó en tu lista.` });
    }
  };

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);
  const clearWishlist = () => setWishlist([]);

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
