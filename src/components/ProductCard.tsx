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
      className: "bg-primary text-white rounded-2xl border-none font-bold shadow-2xl",
    });
  };

  return (
    <div className="group relative bg-white rounded-[2rem] md:rounded-[2.5rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-1 border border-black/[0.03] flex flex-col h-full p-2 md:p-3">
      {/* Imagen del Producto - Siempre Cuadrada */}
      <Link href={`/catalogo/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#f9f9f9] rounded-[1.5rem] md:rounded-[2rem]">
        <Image
          src={product.media.main_image}
          alt={product.metadata.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
        />
        
        <button 
          onClick={(e) => {
            e.preventDefault();
            setIsFavorite(!isFavorite);
          }}
          className={cn(
            "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md z-10",
            isFavorite ? "bg-red-500 text-white shadow-lg" : "bg-white/70 text-foreground/40 hover:text-red-500"
          )}
        >
          <Heart className={cn("w-5 h-5", isFavorite && "fill-current")} />
        </button>
      </Link>
      
      {/* Contenido */}
      <div className="p-3 md:p-4 flex flex-col flex-1 gap-2">
        <div className="flex items-center gap-1">
          <Star className="w-3 h-3 fill-secondary text-secondary" />
          <span className="text-[10px] font-black text-muted-foreground">4.8</span>
          <span className="mx-1 text-muted-foreground/20">|</span>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">{product.attributes.brand}</span>
        </div>
        
        <h3 className="text-xs md:text-sm font-bold text-foreground line-clamp-2 leading-tight min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.metadata.name}
        </h3>
        
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-black/[0.02]">
          <div className="flex flex-col">
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">P. Venta</span>
            <span className="text-base md:text-xl font-black text-primary tracking-tighter">
              ${product.financials.pricing.base_price.toLocaleString('es-CL')}
            </span>
          </div>
          
          <Button 
            onClick={handleAddToCart}
            size="icon" 
            className="h-11 w-11 md:h-12 md:w-12 rounded-[1.2rem] md:rounded-[1.5rem] bg-secondary text-foreground shadow-lg shadow-secondary/20 hover:scale-110 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}
