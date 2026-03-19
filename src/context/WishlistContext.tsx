"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SanitizedProduct } from '@/types/product';
import { toast } from '@/hooks/use-toast';

interface WishlistContextType {
  wishlist: SanitizedProduct[];
  toggleWishlist: (product: SanitizedProduct) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<SanitizedProduct[]>([]);

  // Persistencia simple en LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('mydog_wishlist');
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading wishlist", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('mydog_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product: SanitizedProduct) => {
    setWishlist(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        toast({
          title: "Eliminado de favoritos 💔",
          description: `${product.name} ya no está en tu lista.`,
          className: "bg-white text-primary border-none rounded-2xl shadow-2xl font-bold",
        });
        return prev.filter(item => item.id !== product.id);
      } else {
        toast({
          title: "¡Añadido a favoritos! ❤️",
          description: `${product.name} se guardó en tu lista.`,
          className: "bg-primary text-white border-none rounded-2xl shadow-2xl font-bold",
        });
        return [...prev, product];
      }
    });
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
