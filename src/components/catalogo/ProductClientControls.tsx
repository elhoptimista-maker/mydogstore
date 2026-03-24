/**
 * @fileOverview Componente cliente para los controles de compra del detalle del producto.
 * Maneja la lógica de añadir al carrito.
 */
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SanitizedProduct } from '@/types/product';
import { toast } from '@/hooks/use-toast';

interface ProductClientControlsProps {
  product: SanitizedProduct;
}

export default function ProductClientControls({ product }: ProductClientControlsProps) {
  const { addToCart, cartType } = useCart();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = () => {
    if (product.currentStock <= 0) {
      toast({ variant: "destructive", title: "Sin Stock", description: "Este producto está agotado temporalmente." });
      return;
    }

    setIsAdding(true);

    setTimeout(() => {
      // Siempre añadimos como compra normal (isSubscription = false)
      addToCart(product, false, 1);
      const cartTypeName = cartType === 'wholesale' ? 'mayorista' : '';
      
      toast({ 
        title: "¡Al carrito! 🛒", 
        description: `${product.name} fue añadido a tu pedido ${cartTypeName}.`.trim() 
      });
      
      setIsAdding(false);
    }, 400);
  };

  return (
    <div className="pt-4">
      <Button 
        onClick={handleAddToCart}
        disabled={product.currentStock <= 0 || isAdding}
        className="w-full h-16 rounded-3xl bg-primary text-white font-black text-lg gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
      >
        {isAdding ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <ShoppingCart className="w-6 h-6" />
        )}
        {product.currentStock > 0 ? 'Añadir al Carrito' : 'Agotado'}
      </Button>
    </div>
  );
}
