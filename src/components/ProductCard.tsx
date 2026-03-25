"use client";

import { SanitizedProduct } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, Eye, Scale, Dog } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import QuickViewModal from './QuickViewModal';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: SanitizedProduct;
  variant?: 'grid' | 'list';
}

/**
 * @fileOverview Componente de tarjeta de producto con ingeniería de interacción superior.
 * Implementa estados optimistas, badges de stock crítico y acciones en hover.
 */
export default function ProductCard({ product, variant = 'grid' }: ProductCardProps) {
  const { addToCart, cartType } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    try {
      await addToCart(product);
      toast({
        title: "¡Añadido! 🐾",
        description: `${product.name} ya está en tu pedido.`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo añadir el producto.",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isFavorite = isInWishlist(product.id);
  const priceToDisplay = cartType === 'wholesale' ? product.wholesalePrice : product.sellingPrice;
  const productUrl = `/catalogo/${product.slug || product.id}`;

  if (variant === 'list') {
    return (
      <div className="group relative bg-white rounded-[2rem] p-4 md:p-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-black/[0.03] flex flex-col sm:flex-row gap-6 items-center">
        <Link href={productUrl} className="relative w-full sm:w-48 aspect-square overflow-hidden rounded-2xl shrink-0 bg-muted/20">
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 200px"
          />
          {product.currentStock <= 0 && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
              <Badge className="bg-red-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-1">Agotado</Badge>
            </div>
          )}
        </Link>

        <div className="flex-1 min-w-0 space-y-3 py-2">
          <div className="space-y-1">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{product.brand}</span>
            <h3 className="font-bold text-lg text-foreground leading-tight group-hover:text-primary transition-colors truncate">
              <Link href={productUrl}>{product.name}</Link>
            </h3>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed hidden md:block">
            {product.short_description}
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-1.5 bg-muted/40 px-3 py-1 rounded-full border border-black/[0.02]">
              <Scale className="w-3 h-3 text-primary/60" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase">{product.weight_kg}kg</span>
            </div>
            <div className="flex items-center gap-1.5 bg-muted/40 px-3 py-1 rounded-full border border-black/[0.02]">
              <Dog className="w-3 h-3 text-primary/60" />
              <span className="text-[9px] font-bold text-muted-foreground uppercase">{product.life_stage}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto sm:border-l sm:border-black/[0.03] sm:pl-8">
          <div className="flex flex-col sm:text-right">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              {cartType === 'wholesale' ? 'Precio B2B' : 'Precio'}
            </span>
            <span className="text-2xl font-black text-foreground tracking-tighter">
              ${priceToDisplay.toLocaleString('es-CL')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleWishlist}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                isFavorite ? "bg-red-50 border-red-100 text-red-500" : "bg-muted/30 border-transparent text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </button>
            <button 
              onClick={handleAddToCart}
              disabled={product.currentStock <= 0 || isAdding}
              className={cn(
                "h-12 px-6 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90 disabled:opacity-30 font-black text-[10px] uppercase tracking-widest gap-2",
                isAdding ? "bg-secondary text-primary" : "bg-primary text-white hover:bg-secondary hover:text-primary"
              )}
            >
              {isAdding ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
              {isAdding ? "Listo" : "Añadir"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white rounded-[2.2rem] p-4 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-black/[0.03] flex flex-col h-full">
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          {product.currentStock < 5 && product.currentStock > 0 && (
            <Badge className="bg-orange-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-2.5 py-1 shadow-lg shadow-orange-500/20">Últimas</Badge>
          )}
          {product.currentStock <= 0 && (
            <Badge className="bg-zinc-800 text-white border-none text-[8px] font-black uppercase tracking-widest px-2.5 py-1">Agotado</Badge>
          )}
        </div>
        
        <div className="flex flex-col gap-2 transition-all duration-500 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={handleWishlist}
            className={cn(
              "w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-xl border backdrop-blur-md",
              isFavorite ? "bg-red-500 border-red-500 text-white" : "bg-white/90 border-black/5 text-muted-foreground hover:text-red-500"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </button>
          <QuickViewModal product={product}>
            <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-black/5 text-muted-foreground hover:text-primary transition-all shadow-xl flex items-center justify-center">
              <Eye className="w-4 h-4" />
            </button>
          </QuickViewModal>
        </div>
      </div>

      <Link href={productUrl} className="block relative aspect-square overflow-hidden mb-4 rounded-2xl bg-muted/10">
        <Image
          src={product.main_image}
          alt={product.name}
          fill
          className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </Link>

      <div className="flex flex-col flex-1 px-1">
        <div className="mb-4">
          <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-1 block opacity-60">
            {product.brand}
          </span>
          <h3 className="font-bold text-xs md:text-sm text-foreground leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            <Link href={productUrl}>{product.name}</Link>
          </h3>
        </div>

        <div className="mt-auto pt-4 border-t border-black/[0.03] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">
              {cartType === 'wholesale' ? 'Precio B2B' : 'Precio'}
            </span>
            <span className="text-lg md:text-xl font-black text-foreground tracking-tighter leading-none">
              ${priceToDisplay.toLocaleString('es-CL')}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.currentStock <= 0 || isAdding}
            className={cn(
              "w-10 h-10 md:w-11 md:h-11 rounded-2xl flex items-center justify-center transition-all shadow-lg active:scale-95 disabled:opacity-20",
              isAdding ? "bg-secondary text-primary" : "bg-primary text-white hover:bg-secondary hover:text-primary"
            )}
          >
            {isAdding ? <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
