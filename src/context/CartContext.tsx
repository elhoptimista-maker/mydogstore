
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '@/lib/mock-db';

interface CartItem extends Product {
  quantity: number;
  isSubscription?: boolean;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, isSubscription?: boolean) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product, isSubscription = false) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.isSubscription === isSubscription);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.isSubscription === isSubscription 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { ...product, quantity: 1, isSubscription }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const cartTotal = cart.reduce((acc, item) => {
    const price = item.isSubscription ? item.price * 0.9 : item.price;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
