/**
 * @fileOverview Componente cliente para los controles de compra del detalle del producto.
 * Maneja la lógica de añadir al carrito y suscripciones.
 */
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Info } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SanitizedProduct } from '@/types/product';
import { toast } from '@/hooks/use-toast';

interface ProductClientControlsProps {
  product: SanitizedProduct;
}

export default function ProductClientControls({ product }: ProductClientControlsProps) {
  const { addToCart, cartType } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingSub, setIsAddingSub] = useState(false);

  const handleAddToCart = (isSubscription: boolean) => {
    if (product.currentStock <= 0) {
      toast({ variant: "destructive", title: "Sin Stock", description: "Este producto está agotado temporalmente." });
      return;
    }

    const setLoader = isSubscription ? setIsAddingSub : setIsAdding;
    setLoader(true);

    setTimeout(() => {
      addToCart(product, isSubscription, 1);
      const cartTypeName = cartType === 'wholesale' ? 'mayorista' : '';
      
      toast({ 
        title: isSubscription ? "Suscripción activada 🔄" : "¡Al carrito! 🛒", 
        description: `${product.name} fue añadido a tu pedido ${cartTypeName}.` 
      });
      
      setLoader(false);
    }, 400);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
      <Button 
        onClick={() => handleAddToCart(false)}
        disabled={product.currentStock <= 0 || isAdding || isAddingSub}
        className="h-16 rounded-3xl bg-primary text-white font-black text-lg gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        {isAdding ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <ShoppingCart className="w-6 h-6" />
        )}
        {product.currentStock > 0 ? 'Añadir al Carrito' : 'Agotado'}
      </Button>

      {cartType !== 'wholesale' ? (
        <Button 
          onClick={() => handleAddToCart(true)}
          variant="outline" 
          disabled={product.currentStock <= 0 || isAdding || isAddingSub}
          className="h-16 rounded-3xl border-secondary text-secondary hover:bg-secondary/5 font-black text-[13px] md:text-sm lg:text-base gap-2 group transition-all"
        >
          {isAddingSub ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <span className="text-xl group-hover:rotate-12 transition-transform">🔄</span>
          )}
          <div className="flex flex-col items-start leading-none">
            <span>Suscríbete y Ahorra 10%</span>
            <span className="text-[9px] uppercase tracking-widest opacity-80 mt-1">Entrega programada</span>
          </div>
        </Button>
      ) : (
        <div className="h-16 rounded-3xl bg-secondary/10 border border-secondary/20 flex items-center justify-center gap-3 px-6 text-secondary">
           <Info className="w-5 h-5 shrink-0" />
           <div className="flex flex-col">
              <span className="font-black text-xs uppercase tracking-tight">Compra Mayorista</span>
              <span className="font-bold text-[9px] uppercase tracking-widest opacity-80">Suscripciones desactivadas</span>
           </div>
        </div>
      )}
    </div>
  );
}
