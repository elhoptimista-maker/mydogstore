
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SanitizedProduct } from '@/types/product';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ProductClientControlsProps {
  product: SanitizedProduct;
}

export default function ProductClientControls({ product }: ProductClientControlsProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (product.currentStock <= 0) {
      toast({ variant: "destructive", title: "Sin Stock", description: "Este producto está agotado temporalmente." });
      return;
    }

    setIsAdding(true);

    setTimeout(() => {
      addToCart(product, false, quantity);
      
      toast({ 
        title: "¡Listo! 🐾", 
        description: `${quantity}x ${product.name} ya está en tu carrito.`
      });
      
      setIsAdding(false);
      setQuantity(1); 
    }, 400);
  };

  const isOutOfStock = product.currentStock <= 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/30 p-2.5 rounded-[2rem] border border-black/[0.03]">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-6 max-sm:text-center max-sm:mb-1">
          ¿Cuántos llevamos?
        </span>
        <div className="flex items-center justify-between sm:justify-end gap-4 bg-white rounded-full p-1.5 shadow-xl shadow-black/5 grow sm:grow-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 rounded-full hover:bg-primary/5 hover:text-primary transition-all active:scale-90"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || isOutOfStock}
          >
            <Minus className="w-5 h-5" />
          </Button>
          <span className="font-black text-2xl w-14 text-center tabular-nums text-primary">
            {quantity}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-11 w-11 rounded-full hover:bg-primary/5 hover:text-primary transition-all active:scale-90"
            onClick={() => setQuantity(quantity + 1)}
            disabled={isOutOfStock || (product.currentStock > 0 && quantity >= product.currentStock)}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        <Button 
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className={cn(
            "w-full h-16 md:h-20 rounded-[2.5rem] font-black text-base md:text-xl uppercase tracking-widest gap-4 shadow-2xl transition-all duration-500 hover:scale-[1.02] active:scale-95",
            isOutOfStock ? "bg-zinc-200 text-zinc-400 grayscale" : "bg-primary text-white shadow-primary/20"
          )}
        >
          {isAdding ? (
            <Loader2 className="w-6 h-6 md:w-7 md:h-7 animate-spin" />
          ) : (
            <ShoppingCart className="w-6 h-6 md:w-7 md:h-7" />
          )}
          {isOutOfStock ? 'Agotado' : 'Agregar al Carrito'}
        </Button>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-green-500" />
              <span>Compra 100% Segura MyDog</span>
           </div>
           <div className="hidden sm:block w-px h-4 bg-black/10" />
           <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-primary" />
              <span>Despacho rápido Santiago RM</span>
           </div>
        </div>
      </div>
    </div>
  );
}
