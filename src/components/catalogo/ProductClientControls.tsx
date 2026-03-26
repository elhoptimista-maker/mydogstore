"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Loader2, Minus, Plus, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { SanitizedProduct } from '@/types/product';
import { toast } from '@/hooks/use-toast';

/**
 * @fileOverview Controles de compra optimizados para CRO con micro-copy de confianza.
 */
export default function ProductClientControls({ product }: ProductClientControlsProps) {
  const { addToCart, cartType } = useCart();
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
      const cartTypeName = cartType === 'wholesale' ? 'mayorista' : '';
      
      toast({ 
        title: "¡Listo! 🐾", 
        description: `${quantity}x ${product.name} ya está en tu carrito.`.trim() 
      });
      
      setIsAdding(false);
      setQuantity(1); 
    }, 400);
  };

  return (
    <div className="space-y-6 pt-4">
      {/* Controles de Cantidad */}
      <div className="flex items-center justify-between bg-muted/30 p-3 rounded-2xl border border-black/[0.03]">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4">Seleccionar Cantidad</span>
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1 || product.currentStock <= 0}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <span className="font-black text-xl w-12 text-center tabular-nums">
            {quantity}
          </span>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-10 w-10 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={() => setQuantity(quantity + 1)}
            disabled={product.currentStock <= 0}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Botón de Añadir y Micro-copy de Confianza */}
      <div className="space-y-4">
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
          {product.currentStock > 0 ? (
            'Agregar al Carrito'
          ) : (
            'Agotado temporalmente'
          )}
        </Button>

        <div className="flex items-center justify-center gap-6 text-[9px] font-black text-muted-foreground uppercase tracking-widest">
           <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
              <span>Compra 100% Segura</span>
           </div>
           <div className="w-px h-3 bg-black/10" />
           <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-primary" />
              <span>Despacho rápido RM</span>
           </div>
        </div>
      </div>
    </div>
  );
}
