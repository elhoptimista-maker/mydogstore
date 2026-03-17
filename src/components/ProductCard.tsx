"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/mock-db';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-border/40 flex flex-col h-full">
      <Link href={`/productos/${product.id}`} className="block relative aspect-square overflow-hidden bg-[#f9f9f9] m-3 rounded-[1.5rem]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          data-ai-hint="dog product"
        />
        <div className="absolute top-3 left-3">
           <span className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
             {product.category}
           </span>
        </div>
      </Link>
      
      <div className="p-5 pt-2 flex flex-col flex-1 gap-2">
        <div className="flex items-center gap-1.5">
          <div className="flex text-secondary">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={i < Math.floor(product.rating) ? "w-3 h-3 fill-current" : "w-3 h-3 text-muted/30"} />
            ))}
          </div>
          <span className="text-xs font-bold text-muted">{product.rating}</span>
        </div>
        
        <h3 className="text-base font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors min-h-[2.5rem]">
          {product.name}
        </h3>
        
        <div className="flex items-center justify-between mt-auto pt-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-muted uppercase">Precio Chile</span>
            <span className="text-xl font-extrabold text-primary tracking-tight">
              ${product.price.toLocaleString('es-CL')}
            </span>
          </div>
          <Button 
            size="icon" 
            className="h-11 w-11 rounded-2xl bg-secondary text-foreground hover:bg-primary hover:text-white transition-all shadow-lg shadow-secondary/10 active:scale-90"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}