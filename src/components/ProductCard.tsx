
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/mock-db';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import QuickViewModal from '@/components/QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
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

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickView(true);
  };

  return (
    <>
      <div className="group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl border border-black/[0.02] flex flex-col h-full w-full max-w-full">
        {/* Marca Flotante */}
        <div className="absolute top-4 left-4 z-20">
          <span className="bg-primary text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
            {product.attributes.brand}
          </span>
        </div>

        {/* Contenedor de Imagen - Área maximizada sin bordes internos */}
        <div className="relative aspect-square overflow-hidden bg-[#fdfdfd] shrink-0">
          <Link href={`/catalogo/${product.id}`} className="block relative w-full h-full">
            <Image
              src={product.media.main_image}
              alt={product.metadata.name}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 300px"
              priority={false}
            />
          </Link>
          
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className={cn(
              "absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md z-20 shadow-sm",
              isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-primary/40 hover:bg-white hover:text-red-500"
            )}
          >
            <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
          </button>
        </div>
        
        {/* Contenido de la Tarjeta */}
        <div className="p-5 flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-secondary text-secondary" />
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">4.8 • Popular</span>
          </div>
          
          <Link href={`/catalogo/${product.id}`} className="block mb-4">
            <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-primary transition-colors">
              {product.metadata.name}
            </h3>
          </Link>
          
          {/* Precio y Botones - Identicos para todas las vistas */}
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-black/[0.03] pt-4">
            <div className="flex flex-col min-w-0">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1 truncate">Precio Venta</span>
              <span className="text-2xl font-black text-primary tracking-tighter leading-none">
                ${product.financials.pricing.base_price.toLocaleString('es-CL')}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5 shrink-0">
              <Button 
                onClick={handleQuickView}
                size="icon" 
                variant="outline"
                className="h-10 w-10 rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                <Eye className="w-5 h-5" />
              </Button>

              <Button 
                onClick={handleAddToCart}
                size="icon" 
                className="h-10 w-10 rounded-xl bg-secondary text-primary shadow-lg shadow-secondary/10 hover:bg-secondary/90 transition-all"
              >
                <ShoppingCart className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <QuickViewModal 
        product={product} 
        open={showQuickView} 
        onOpenChange={setShowQuickView} 
      />
    </>
  );
}
