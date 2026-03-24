"use client";

import { SanitizedProduct } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import QuickViewModal from './QuickViewModal';
import { cn } from '@/lib/utils';

export default function ProductCard({ product }: { product: SanitizedProduct }) {
  const { addToCart, cartType } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    
    setTimeout(() => {
      addToCart(product);
      toast({
        title: "¡Añadido! 🐾",
        description: `${product.name} está en tu carrito.`,
      });
      setIsAdding(false);
    }, 500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isFavorite = isInWishlist(product.id);

  return (
    <div className="group relative bg-white rounded-[2rem] p-5 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-black/[0.03] flex flex-col h-full">
      {/* Capa de Acciones y Badges (Superior) */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          {product.currentStock < 5 && product.currentStock > 0 && (
            <Badge className="bg-orange-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-1">Últimas unidades</Badge>
          )}
          {product.currentStock <= 0 && (
            <Badge className="bg-red-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-1">Agotado</Badge>
          )}
        </div>
        
        {/* Acciones Rápidas Alineadas */}
        <div className="flex flex-col gap-2 transition-all duration-500 md:opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
          <button 
            onClick={handleWishlist}
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm border",
              isFavorite 
                ? "bg-red-50 border-red-100 text-red-500" 
                : "bg-white/80 backdrop-blur-md border-black/5 text-muted-foreground hover:text-red-500 hover:scale-110"
            )}
          >
            <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
          </button>

          <QuickViewModal product={product}>
            <button 
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-muted-foreground hover:text-primary hover:scale-110 flex items-center justify-center transition-all shadow-sm"
              title="Vista Rápida"
            >
              <Eye className="w-5 h-5" />
            </button>
          </QuickViewModal>
        </div>
      </div>

      {/* Imagen del Producto */}
      <Link href={`/catalogo/${product.slug || product.id}`} className="block relative aspect-square overflow-hidden mb-4 rounded-xl">
        <Image
          src={product.main_image}
          alt={product.name}
          fill
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Link>

      {/* Info del Producto */}
      <div className="flex flex-col flex-1">
        <div className="mb-3">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">
            {product.brand}
          </span>
          <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="mt-auto pt-4 border-t border-black/[0.03] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              {cartType === 'wholesale' ? 'Precio B2B' : 'Precio'}
            </span>
            <span className="text-xl font-black text-foreground tracking-tighter">
              ${(cartType === 'wholesale' ? product.wholesalePrice : product.sellingPrice).toLocaleString('es-CL')}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.currentStock <= 0 || isAdding}
            className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-90 disabled:opacity-30 disabled:grayscale",
              isAdding ? "bg-secondary text-primary" : "bg-primary text-white hover:bg-secondary hover:text-primary"
            )}
          >
            {isAdding ? (
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : (
              <ShoppingCart className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
