"use client";

import { SanitizedProduct } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Link from 'next/link';

interface RelatedProductsSliderProps {
  products: SanitizedProduct[];
  title?: string;
  subtitle?: string;
  badge?: string;
  viewAllHref?: string;
}

/**
 * @fileOverview Componente reutilizable de Slider para productos relacionados.
 * Implementa un diseño responsivo con efecto de "asomo" (peeking) en móviles.
 * Corregida la alineación de textos a la izquierda y ubicación del botón en mobile.
 */
export default function RelatedProductsSlider({ 
  products, 
  title = "Productos Similares", 
  subtitle = "Expertos en nutrición recomiendan estas alternativas técnicas.",
  badge = "Selección basada en atributos",
  viewAllHref
}: RelatedProductsSliderProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="pt-2 pb-8">
      {/* Header: Alineado a la izquierda siempre, horizontal con botón en MD+ */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div className="space-y-2 text-left">
          {badge && (
            <Badge variant="outline" className="rounded-full font-black text-[9px] uppercase tracking-[0.2em] border-primary/20 text-primary px-4 py-1 bg-primary/5">
              {badge}
            </Badge>
          )}
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-none">{title}</h2>
          {subtitle && <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>}
        </div>
        
        {/* Botón Desktop: Visible solo desde MD */}
        {viewAllHref && (
          <Link href={viewAllHref} className="hidden md:inline-block">
            <button className="h-12 px-8 rounded-full border-2 border-primary/10 font-black text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all bg-white whitespace-nowrap">
              Ver todo el catálogo
            </button>
          </Link>
        )}
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full relative"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem 
              key={product.id} 
              className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <div className="h-full py-4">
                <ProductCard product={product} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Botones de navegación solo visibles en desktop */}
        <div className="hidden lg:block">
          <CarouselPrevious className="h-12 w-12 -left-6 border-none shadow-xl bg-white text-primary hover:bg-primary hover:text-white" />
          <CarouselNext className="h-12 w-12 -right-6 border-none shadow-xl bg-white text-primary hover:bg-primary hover:text-white" />
        </div>
      </Carousel>

      {/* Botón Mobile: Visible solo en pantallas pequeñas, ubicado debajo de los cards */}
      {viewAllHref && (
        <div className="mt-8 flex md:hidden">
          <Link href={viewAllHref} className="w-full">
            <button className="w-full h-14 rounded-2xl border-2 border-primary/10 font-black text-[10px] uppercase tracking-widest text-primary bg-white shadow-sm active:scale-95 transition-all">
              Ver todo el catálogo
            </button>
          </Link>
        </div>
      )}
    </section>
  );
}
