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
    <section className="space-y-10 pt-16 border-t border-black/5">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-2">
          {badge && (
            <Badge variant="outline" className="rounded-full font-black text-[9px] uppercase tracking-[0.2em] border-primary/20 text-primary px-4 py-1 bg-primary/5">
              {badge}
            </Badge>
          )}
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">{title}</h2>
          {subtitle && <p className="text-sm font-medium text-muted-foreground">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link href={viewAllHref}>
            <button className="h-12 px-8 rounded-full border-2 border-primary/10 font-black text-[10px] uppercase tracking-widest hover:border-primary hover:text-primary transition-all bg-white">
              Ver todo
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
            <CarouselItem key={product.id} className="pl-4 basis-[85%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
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
    </section>
  );
}
