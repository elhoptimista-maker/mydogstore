"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, Plus, Heart } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast({
      title: "¡Añadido!",
      description: `${product.metadata.name} está en tu carrito.`,
      className: "bg-primary text-white rounded-2xl border-none font-bold",
    });
  };

  return (
    <div 
      className="group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 border border-border/40 flex flex-col h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/productos/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#f9f9f9] m-2 rounded-[1.5rem]">
        <Image
          src={product.media.main_image}
          alt={product.metadata.name}
          fill
          className={cn(
            "object-cover transition-transform duration-700",
            isHovered ? "scale-110" : "scale-100"
          )}
        />
        
        <div className="absolute top-2 left-2 flex flex-col gap-2">
           <span className="bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-primary shadow-sm border border-primary/10">
             {product.attributes.category}
           </span>
        </div>

        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className={cn(
            "absolute top-2 right-2 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md",
            isFavorite ? "bg-red-500 text-white shadow-lg" : "bg-white/80 text-foreground/40 hover:text-red-500 hover:bg-white"
          )}
        >
          <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </button>
      </Link>
      
      <div className="p-4 md:p-6 pt-0 flex flex-col flex-1 gap-3">
        <div className="flex items-center gap-1.5">
          <div className="flex text-secondary">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("w-3 h-3 fill-current", i < 4 ? "text-secondary" : "text-muted/20")} />
            ))}
          </div>
          <span className="text-[10px] font-black text-muted tracking-widest">4.8</span>
        </div>
        
        <h3 className="text-sm md:text-lg font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[2.6rem]">
          {product.metadata.name}
        </h3>
        
        <div className="flex items-end justify-between mt-auto pt-3 border-t border-border/30 gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Precio Distribución</span>
            <span className="text-xl md:text-2xl font-black text-primary tracking-tighter leading-none">
              ${product.financials.pricing.base_price.toLocaleString('es-CL')}
            </span>
          </div>
          <Button 
            onClick={handleAddToCart}
            size="icon" 
            className={cn(
              "h-10 w-10 md:h-12 md:w-12 rounded-xl transition-all duration-500 active:scale-90 shadow-lg shrink-0",
              isHovered ? "bg-primary text-white rotate-90" : "bg-secondary text-foreground"
            )}
          >
            <Plus className="w-5 h-5 md:w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}