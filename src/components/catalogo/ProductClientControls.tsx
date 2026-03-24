/**
 * @fileOverview Componente cliente para los controles interactivos del detalle del producto.
 * Maneja la lógica de añadir al carrito y favoritos.
 */
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Share2, Loader2, Info } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { SanitizedProduct } from '@/types/product';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ProductClientControlsProps {
  product: SanitizedProduct;
}

export default function ProductClientControls({ product }: ProductClientControlsProps) {
  const { addToCart, cartType } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isAddingSub, setIsAddingSub] = useState(false);

  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (isSubscription: boolean) => {
    // Si el producto no tiene stock
    if (product.currentStock <= 0) {
      toast({ variant: "destructive", title: "Sin Stock", description: "Este producto está agotado temporalmente." });
      return;
    }

    const setLoader = isSubscription ? setIsAddingSub : setIsAdding;
    setLoader(true);

    // Simulamos un pequeño delay para feedback visual
    setTimeout(() => {
      // El CartContext ya se encarga de saber si estamos en modo wholesale o retail
      // y aplicará el precio correcto (wholesalePrice vs sellingPrice)
      addToCart(product, isSubscription, 1);
      
      const cartTypeName = cartType === 'wholesale' ? 'mayorista' : '';
      
      toast({ 
        title: isSubscription ? "Suscripción activada 🔄" : "¡Al carrito! 🛒", 
        description: `${product.name} fue añadido a tu pedido ${cartTypeName}.` 
      });
      
      setLoader(false);
    }, 400);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `MyDog: ${product.name}`,
          text: product.short_description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Enlace copiado", description: "URL copiada al portapapeles." });
      }
    } catch (error) {
      // Fallo silencioso si el usuario cancela el share nativo
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 ml-auto">
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => toggleWishlist(product)}
                  className={cn(
                    "rounded-full shadow-sm border transition-all",
                    inWishlist 
                      ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600" 
                      : "bg-white border-border/50 text-muted-foreground hover:text-red-500"
                  )}
                >
                  <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-bold text-[10px] uppercase tracking-widest bg-black text-white">
                {inWishlist ? 'Quitar de favoritos' : 'Añadir a favoritos'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleShare}
                  className="rounded-full bg-white shadow-sm border border-border/50 text-muted-foreground hover:text-primary transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="font-bold text-[10px] uppercase tracking-widest bg-black text-white">
                Compartir producto
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

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

        {/* El botón de suscripción solo debería estar visible si NO es wholesale */}
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
    </>
  );
}
