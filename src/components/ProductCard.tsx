"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, Plus, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/mock-db';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div 
      className="group relative bg-white rounded-[2.5rem] overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-primary/10 border border-border/40 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Area */}
      <Link href={`/productos/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#f9f9f9] m-3 rounded-[2rem]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className={cn(
            "object-cover transition-transform duration-1000",
            isHovered ? "scale-110" : "scale-100"
          )}
          data-ai-hint="dog product"
        />
        
        {/* Floating Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
           <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-wider text-primary shadow-sm border border-primary/10">
             {product.category}
           </span>
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className={cn(
            "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md",
            isFavorite ? "bg-red-500 text-white shadow-lg" : "bg-white/80 text-foreground/40 hover:text-red-500 hover:bg-white"
          )}
        >
          <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </button>
      </Link>
      
      {/* Content Area */}
      <div className="p-6 pt-2 flex flex-col flex-1 gap-3">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex text-secondary">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("w-3 h-3 fill-current", i < Math.floor(product.rating) ? "text-secondary" : "text-muted/20")} />
            ))}
          </div>
          <span className="text-[10px] font-black text-muted tracking-widest">{product.rating}</span>
        </div>
        
        <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-[1.2] group-hover:text-primary transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>
        
        {/* Bottom Info & Action */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/30">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Precio Chile</span>
            <span className="text-2xl font-black text-primary tracking-tighter">
              ${product.price.toLocaleString('es-CL')}
            </span>
          </div>
          <Button 
            size="icon" 
            className={cn(
              "h-12 w-12 rounded-2xl transition-all duration-500 active:scale-90 shadow-lg",
              isHovered ? "bg-primary text-white shadow-primary/20 rotate-90" : "bg-secondary text-foreground shadow-secondary/10"
            )}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}