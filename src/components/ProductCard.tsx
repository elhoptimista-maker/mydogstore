
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { SanitizedProduct } from '@/types/product';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import QuickViewModal from '@/components/QuickViewModal';

interface ProductCardProps {
  product: SanitizedProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    addToCart(product); 
    
    setTimeout(() => setIsAdding(false), 800);
    
    toast({
      title: "¡Añadido! 🐾",
      description: `Agregaste ${product.name} al carrito`,
      className: "bg-primary text-white rounded-2xl border-none font-bold shadow-2xl",
    });
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsQuickViewOpen(true);
  };

  return (
    <>
      <div className="bg-white border border-border/50 rounded-2xl p-4 flex flex-col relative group transition-all duration-300 hover:shadow-lg">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
          {product.currentStock < 5 && product.currentStock > 0 && (
            <Badge className="bg-orange-500 text-white border-none rounded-full px-2 py-0.5 text-[8px] font-bold uppercase">Últimas unidades</Badge>
          )}
          {product.currentStock === 0 && (
            <Badge className="bg-destructive text-white border-none rounded-full px-2 py-0.5 text-[8px] font-bold uppercase">Sin Stock</Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFavorite(!isFavorite); }}
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white shadow-md",
              isFavorite ? "text-red-500" : "text-foreground/40 hover:text-red-500"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </button>
          <button 
            onClick={handleQuickView}
            className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-foreground/40 hover:text-primary transition-all shadow-md"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Imagen */}
        <Link href={`/catalogo/${product.id}`} className="block relative aspect-square overflow-hidden mb-4 rounded-xl">
          <Image
            src={product.main_image}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 250px"
          />
        </Link>
        
        {/* Meta */}
        <div className="flex flex-col flex-1 space-y-2 min-w-0 text-left">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{product.category}</span>
          <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className={cn("w-2.5 h-2.5 fill-current", i <= 4 ? "text-yellow-400" : "text-muted")} />
            ))}
            <span className="text-[9px] font-bold text-muted-foreground ml-1">({product.brand})</span>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 mt-auto">
            <div className="flex flex-col">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Precio</span>
              <span className="text-lg font-black text-primary tracking-tighter leading-none">
                ${product.sellingPrice.toLocaleString('es-CL')}
              </span>
            </div>
            <button 
              onClick={handleAddToCart}
              disabled={product.currentStock === 0 || isAdding}
              className={cn(
                "w-10 h-10 rounded-xl transition-all flex items-center justify-center shadow-sm disabled:cursor-not-allowed relative overflow-hidden",
                isAdding ? "bg-secondary scale-110" : "bg-muted group-hover:bg-primary text-primary group-hover:text-white"
              )}
            >
              {isAdding ? (
                <span className="animate-in zoom-in duration-300">🐾</span>
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <QuickViewModal 
        product={product} 
        open={isQuickViewOpen} 
        onOpenChange={setIsQuickViewOpen} 
      />
    </>
  );
}
