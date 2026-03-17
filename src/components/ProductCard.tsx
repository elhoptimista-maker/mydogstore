"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart, Heart } from 'lucide-react';
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
      title: "¡Añadido!",
      description: `${product.metadata.name} está en tu carrito.`,
      className: "bg-primary text-white rounded-2xl border-none font-bold",
    });
  };

  return (
    <div className="group relative bg-white rounded-[2.5rem] overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl border border-black/[0.03] flex flex-col h-full p-2">
      {/* Imagen del Producto */}
      <Link href={`/catalogo/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#f9f9f9] rounded-[2rem]">
        <Image
          src={product.media.main_image}
          alt={product.metadata.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className={cn(
            "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md",
            isFavorite ? "bg-red-500 text-white shadow-lg" : "bg-white/70 text-foreground/40 hover:text-red-500"
          )}
        >
          <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </button>
      </Link>
      
      {/* Contenido */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-secondary text-secondary" />
          <span className="text-[10px] font-black text-muted-foreground">4.8</span>
          <span className="mx-1 text-muted-foreground/30">|</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase">{product.attributes.brand}</span>
        </div>
        
        <h3 className="text-xs md:text-sm font-bold text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
          {product.metadata.name}
        </h3>
        
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Distribución</span>
            <span className="text-lg font-black text-primary tracking-tighter">
              ${product.financials.pricing.base_price.toLocaleString('es-CL')}
            </span>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            size="icon" 
            className="h-11 w-11 rounded-2xl bg-secondary text-foreground shadow-lg shadow-secondary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
