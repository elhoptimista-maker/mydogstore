
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
    <div className="group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            data-ai-hint="dog product"
          />
          <div className="absolute top-3 left-3">
             <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary">
               {product.category}
             </span>
          </div>
        </div>
        
        <div className="p-4 space-y-2">
          <div className="flex items-center gap-1 text-yellow-400">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-medium text-muted-foreground">{product.rating}</span>
          </div>
          
          <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between pt-1">
            <span className="text-lg font-bold text-primary">${product.price.toFixed(2)}</span>
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity bg-accent/10 hover:bg-accent text-accent hover:text-white">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
}
