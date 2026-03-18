
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Product } from '@/lib/mock-db';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

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
      description: product.metadata.name,
      className: "bg-primary text-white rounded-2xl border-none font-bold",
    });
  };

  return (
    <div className="bg-white border border-border/50 rounded-2xl p-4 flex flex-col relative group transition-all duration-300 hover:shadow-lg">
      {/* Badges (Top Left) */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-1">
        {product.financials.pricing.base_price < 20000 && (
          <Badge className="bg-red-500 text-white border-none rounded-full px-2 py-0.5 text-[8px] font-black uppercase">Oferta</Badge>
        )}
        <Badge className="bg-primary text-white border-none rounded-full px-2 py-0.5 text-[8px] font-black uppercase">Nuevo</Badge>
      </div>

      {/* Actions (Top Right) */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
        <button 
          onClick={(e) => { e.preventDefault(); setIsFavorite(!isFavorite); }}
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center transition-all bg-white shadow-md",
            isFavorite ? "text-red-500" : "text-foreground/40 hover:text-red-500"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </button>
        <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-foreground/40 hover:text-primary transition-all shadow-md">
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Imagen */}
      <Link href={`/catalogo/${product.id}`} className="block relative aspect-square overflow-hidden mb-4 rounded-xl">
        <Image
          src={product.media.main_image}
          alt={product.metadata.name}
          fill
          className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 768px) 50vw, 250px"
        />
      </Link>
      
      {/* Meta */}
      <div className="flex flex-col flex-1 space-y-2 min-w-0">
        <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{product.attributes.category}</span>
        <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-tight min-h-[2.5rem]">
          {product.metadata.name}
        </h3>
        
        <div className="flex items-center gap-1">
          {[1,2,3,4,5].map(i => (
            <Star key={i} className={cn("w-2.5 h-2.5 fill-current", i <= 4 ? "text-yellow-400" : "text-muted")} />
          ))}
          <span className="text-[9px] font-bold text-muted-foreground ml-1">(12)</span>
        </div>

        {/* Footer de Tarjeta */}
        <div className="flex items-center justify-between pt-2 mt-auto">
          <div className="flex flex-col">
            <span className="text-lg font-black text-primary tracking-tighter leading-none">
              ${product.financials.pricing.base_price.toLocaleString('es-CL')}
            </span>
            <span className="text-[9px] text-muted-foreground line-through font-bold">
              ${(product.financials.pricing.base_price * 1.2).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-10 h-10 rounded-xl bg-muted group-hover:bg-primary text-primary group-hover:text-white transition-all flex items-center justify-center shadow-sm"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
