"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SanitizedProduct } from '@/types/product';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserData } from '@/lib/services/user.service';

interface CartItem extends SanitizedProduct {
  quantity: number;
  isSubscription?: boolean;
  priceAtAddition: number;
  cartType: 'retail' | 'wholesale';
}

interface DiscountCoupon {
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: SanitizedProduct, isSubscription?: boolean, quantity?: number, forceWholesale?: boolean) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  cartType: 'retail' | 'wholesale';
  userData: any;
  // Lógica de descuentos
  coupon: DiscountCoupon | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  discountAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userRole, setUserRole] = useState<'customer' | 'wholesale' | 'admin'>('customer');
  const [userData, setUserData] = useState<any>(null);
  const [coupon, setCoupon] = useState<DiscountCoupon | null>(null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUserData(user.uid);
        setUserRole(data?.role || 'customer');
        setUserData(data);
      } else {
        setUserRole('customer');
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const cartType: 'retail' | 'wholesale' = userRole === 'wholesale' ? 'wholesale' : 'retail';

  useEffect(() => {
    if (cart.length > 0 && cart[0].cartType !== cartType) {
      setCart([]);
      setCoupon(null);
    }
  }, [cartType, cart]);

  const addToCart = (product: SanitizedProduct, isSubscription = false, quantity = 1, forceWholesale = false) => {
    const effectiveCartType = (forceWholesale || userRole === 'wholesale') ? 'wholesale' : 'retail';
    const priceAtAddition = effectiveCartType === 'wholesale' ? product.wholesalePrice : product.sellingPrice;

    setCart(prev => {
      if (prev.length > 0 && prev[0].cartType !== effectiveCartType) {
        return [{ ...product, quantity, isSubscription, priceAtAddition, cartType: effectiveCartType }];
      }

      const existing = prev.find(item => item.id === product.id && item.isSubscription === isSubscription);
      if (existing) {
        return prev.map(item => 
          item.id === product.id && item.isSubscription === isSubscription 
            ? { ...item, quantity: item.quantity + quantity, priceAtAddition } 
            : item
        );
      }
      return [...prev, { ...product, quantity, isSubscription, priceAtAddition, cartType: effectiveCartType }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    const normalizedCode = code.toUpperCase().trim();
    if (normalizedCode === 'BIENVENIDA') {
      setCoupon({ code: 'BIENVENIDA', type: 'percentage', value: 10 });
      return true;
    }
    if (normalizedCode === 'MYDOG5000') {
      setCoupon({ code: 'MYDOG5000', type: 'fixed', value: 5000 });
      return true;
    }
    return false;
  };

  const removeCoupon = () => setCoupon(null);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const subtotal = cart.reduce((acc, item) => {
    const basePrice = item.priceAtAddition;
    const price = item.isSubscription ? basePrice * 0.9 : basePrice;
    return acc + (price * item.quantity);
  }, 0);

  let discountAmount = 0;
  if (coupon) {
    if (coupon.type === 'percentage') {
      discountAmount = Math.round(subtotal * (coupon.value / 100));
    } else {
      discountAmount = coupon.value;
    }
  }

  const cartTotal = Math.max(subtotal - discountAmount, 0);

  return (
    <CartContext.Provider value={{ 
      cart, addToCart, removeFromCart, updateQuantity, clearCart, 
      cartCount, cartTotal, cartType, userData,
      coupon, applyCoupon, removeCoupon, discountAmount
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
