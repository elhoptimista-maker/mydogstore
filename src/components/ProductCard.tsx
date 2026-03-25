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
 * @fileOverview Componente de tarjeta de producto con soporte para vistas duales (Grid/List).
 * Implementa lógica de precios dinámicos, estados optimistas y accesibilidad mejorada.
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
      // Llamada directa al contexto. Si es síncrono, se procesa de inmediato.
      await addToCart(product);
      toast({
        title: "¡Añadido! 🐾",
        description: `${product.name} está en tu carrito.`,
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
  const priceLabel = cartType === 'wholesale' ? 'Precio B2B' : 'Precio Detalle';
  const productUrl = `/catalogo/${product.slug || product.id}`;

  if (variant === 'list') {
    return (
      <div className="group relative bg-white rounded-[2rem] p-4 md:p-6 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-black/[0.03] flex flex-col sm:flex-row gap-6 items-center">
        {/* Imagen Lateral */}
        <Link href={productUrl} className="relative w-full sm:w-48 aspect-square overflow-hidden rounded-2xl shrink-0 bg-muted/20">
          <Image
            src={product.main_image}
            alt={`Imagen de ${product.name}`}
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

        {/* Información Central */}
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
            {product.currentStock > 0 && product.currentStock < 5 && (
              <Badge className="bg-orange-100 text-orange-600 border-none text-[8px] font-black uppercase px-2 py-1">Stock Crítico</Badge>
            )}
          </div>
        </div>

        {/* Acciones y Precio */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 w-full sm:w-auto sm:border-l sm:border-black/[0.03] sm:pl-8">
          <div className="flex flex-col sm:text-right">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              {priceLabel}
            </span>
            <span className="text-2xl font-black text-foreground tracking-tighter">
              ${priceToDisplay.toLocaleString('es-CL')}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={handleWishlist}
              aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all border",
                isFavorite 
                  ? "bg-red-50 border-red-100 text-red-500" 
                  : "bg-muted/30 border-transparent text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
            </button>
            
            <QuickViewModal product={product}>
              <button 
                aria-label="Vista rápida del producto"
                className="w-10 h-10 rounded-xl bg-muted/30 text-muted-foreground hover:text-primary transition-all flex items-center justify-center"
              >
                <Eye className="w-4 h-4" />
              </button>
            </QuickViewModal>

            <button 
              onClick={handleAddToCart}
              disabled={product.currentStock <= 0 || isAdding}
              aria-label="Agregar al carrito"
              className={cn(
                "h-12 px-6 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90 disabled:opacity-30 font-black text-[10px] uppercase tracking-widest gap-2",
                isAdding ? "bg-secondary text-primary" : "bg-primary text-white hover:bg-secondary hover:text-primary"
              )}
            >
              {isAdding ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
              {isAdding ? "Añadiendo" : "Agregar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VISTA GRID
  return (
    <div className="group relative bg-white rounded-[2rem] p-5 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-black/[0.03] flex flex-col h-full">
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
        <div className="flex flex-col gap-1.5">
          {product.currentStock < 5 && product.currentStock > 0 && (
            <Badge className="bg-orange-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-1">Últimas uds</Badge>
          )}
          {product.currentStock <= 0 && (
            <Badge className="bg-red-500 text-white border-none text-[8px] font-black uppercase tracking-widest px-2 py-1">Agotado</Badge>
          )}
        </div>
        
        <div className="flex flex-col gap-2 transition-all duration-500 md:opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0">
          <button 
            onClick={handleWishlist}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
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
              aria-label="Vista Rápida"
              className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-md border border-black/5 text-muted-foreground hover:text-primary hover:scale-110 flex items-center justify-center transition-all shadow-sm"
            >
              <Eye className="w-5 h-5" />
            </button>
          </QuickViewModal>
        </div>
      </div>

      <Link href={productUrl} className="block relative aspect-square overflow-hidden mb-4 rounded-xl">
        <Image
          src={product.main_image}
          alt={`Imagen de ${product.name}`}
          fill
          className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Link>

      <div className="flex flex-col flex-1">
        <div className="mb-3">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1 block">
            {product.brand}
          </span>
          <h3 className="font-bold text-sm text-foreground leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
            <Link href={productUrl}>
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="mt-auto pt-4 border-t border-black/[0.03] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
              {cartType === 'wholesale' ? 'Precio B2B' : 'Precio'}
            </span>
            <span className="text-xl font-black text-foreground tracking-tighter">
              ${priceToDisplay.toLocaleString('es-CL')}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.currentStock <= 0 || isAdding}
            aria-label="Agregar al carrito"
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
