"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/mock-db';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "¡Añadido al carrito!",
      description: product.metadata.name,
      className: "bg-primary text-white rounded-2xl border-none font-bold shadow-2xl",
    });
  };

  return (
    <div className="group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 border border-black/[0.02] flex flex-col h-full">
      {/* Visual Header - Brand & Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <span className="bg-primary/10 backdrop-blur-md text-primary text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-primary/10">
          {product.attributes.brand}
        </span>
      </div>

      {/* Image Container */}
      <Link href={`/catalogo/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#fdfdfd] p-6">
        <Image
          src={product.media.main_image}
          alt={product.metadata.name}
          fill
          className="object-contain transition-transform duration-700 group-hover:scale-110 p-8"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
        />
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className={cn(
            "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md z-10",
            isFavorite ? "bg-red-500 text-white shadow-lg" : "bg-white/80 text-primary/40 hover:text-red-500"
          )}
        >
          <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </button>
      </Link>
      
      {/* Content */}
      <div className="p-6 md:p-8 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-3">
          <Star className="w-3 h-3 fill-secondary text-secondary" />
          <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">4.8 • Popular</span>
        </div>
        
        <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-primary transition-colors mb-6">
          {product.metadata.name}
        </h3>
        
        <div className="mt-auto flex items-end justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">Precio Venta</span>
            <span className="text-xl md:text-2xl font-black text-primary tracking-tighter">
              ${product.financials.pricing.base_price.toLocaleString('es-CL')}
            </span>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            size="icon" 
            className="h-12 w-12 md:h-14 md:w-14 rounded-2xl bg-secondary text-primary shadow-xl shadow-secondary/20 hover:scale-110 active:scale-95 transition-all"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}