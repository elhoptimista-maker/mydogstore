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
    <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-border/50">
      <Link href={`/productos/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted/30">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            data-ai-hint="dog product"
          />
          <div className="absolute top-3 left-3">
             <span className="bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">
               {product.category}
             </span>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-semibold text-muted-foreground">{product.rating}</span>
          </div>
          
          <h3 className="text-sm font-bold text-primary line-clamp-1 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-extrabold text-primary">
              ${product.price.toLocaleString('es-CL')}
            </span>
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-primary/5 hover:bg-primary text-primary hover:text-white transition-colors">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}