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
      <div className="group relative bg-white rounded-[2rem] overflow-hidden transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2 border border-black/[0.02] flex flex-col h-full">
        {/* Etiqueta de Marca - Siempre visible arriba a la izquierda */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          <span className="bg-primary/10 backdrop-blur-md text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-primary/10">
            {product.attributes.brand}
          </span>
        </div>

        {/* Contenedor de Imagen */}
        <div className="relative aspect-square overflow-hidden bg-[#fdfdfd] p-4 md:p-6">
          <Link href={`/catalogo/${product.id}`} className="block relative w-full h-full">
            <Image
              src={product.media.main_image}
              alt={product.metadata.name}
              fill
              className="object-contain transition-transform duration-700 group-hover:scale-110 p-6 md:p-8"
              sizes="(max-width: 768px) 80vw, (max-width: 1200px) 33vw, 25vw"
            />
          </Link>
          
          {/* Botón Vista Rápida - Overlay en Hover para Desktop */}
          <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex items-center justify-center pointer-events-none">
            <Button 
              onClick={handleQuickView}
              className="pointer-events-auto bg-white/90 backdrop-blur-sm text-primary font-black rounded-full h-12 px-6 shadow-2xl hover:bg-white scale-90 group-hover:scale-100 transition-all duration-300 gap-2 border-none"
            >
              <Eye className="w-5 h-5" /> Vista Rápida
            </Button>
          </div>
          
          {/* Botón Favorito */}
          <button 
            onClick={(e) => {
              e.preventDefault();
              setIsFavorite(!isFavorite);
            }}
            className={cn(
              "absolute top-4 right-4 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md z-10",
              isFavorite ? "bg-red-500 text-white shadow-lg" : "bg-white/80 text-primary/40 hover:bg-white hover:text-red-500 shadow-sm"
            )}
          >
            <Heart className={cn("w-4 h-4 md:w-5 md:h-5", isFavorite && "fill-current")} />
          </button>
        </div>
        
        {/* Contenido de la Tarjeta */}
        <div className="p-5 md:p-8 flex flex-col flex-1">
          {/* Rating y Tag de Popularidad */}
          <div className="flex items-center gap-1 mb-2 md:mb-3">
            <Star className="w-3 h-3 fill-secondary text-secondary" />
            <span className="text-[10px] md:text-xs font-black text-muted-foreground uppercase tracking-widest">4.8 • Popular</span>
          </div>
          
          {/* Nombre del Producto */}
          <Link href={`/catalogo/${product.id}`}>
            <h3 className="text-sm md:text-base font-bold text-foreground line-clamp-2 leading-snug min-h-[2.5rem] group-hover:text-primary transition-colors mb-4 md:mb-6">
              {product.metadata.name}
            </h3>
          </Link>
          
          {/* Pie de Tarjeta - Precio y Acciones */}
          <div className="mt-auto flex items-end justify-between gap-2 md:gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-0.5 md:mb-1">Precio Distribución</span>
              <span className="text-lg md:text-2xl font-black text-primary tracking-tighter">
                ${product.financials.pricing.base_price.toLocaleString('es-CL')}
              </span>
            </div>
            
            <div className="flex gap-2">
              {/* Icono de Vista Rápida - Visible en móviles/tablets */}
              <Button 
                onClick={handleQuickView}
                variant="ghost"
                size="icon" 
                className="md:hidden h-10 w-10 rounded-xl bg-primary/5 text-primary"
              >
                <Eye className="w-5 h-5" />
              </Button>
              
              {/* Botón de Añadir al Carrito */}
              <Button 
                onClick={handleAddToCart}
                size="icon" 
                className="h-10 w-10 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-secondary text-primary shadow-xl shadow-secondary/20 hover:bg-secondary/90 hover:scale-110 active:scale-95 transition-all"
              >
                <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Vista Rápida */}
      <QuickViewModal 
        product={product} 
        open={showQuickView} 
        onOpenChange={setShowQuickView} 
      />
    </>
  );
}