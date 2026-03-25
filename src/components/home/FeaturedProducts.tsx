import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { SanitizedProduct } from '@/types/product';
import { ArrowRight } from 'lucide-react';

/**
 * @fileOverview Sección de productos destacados para la Home.
 * Implementa una grilla responsiva optimizada para alta densidad de inventario.
 */

interface FeaturedProductsProps {
  products: SanitizedProduct[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 md:px-8 space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-black/[0.03] pb-8">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            💎 Selección de Temporada
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-none">
            Productos <span className="text-primary">Destacados</span>
          </h2>
          <p className="text-xs md:text-sm font-medium text-muted-foreground">
            Nutrición y accesorios probados por nuestro equipo técnico.
          </p>
        </div>
        <Link href="/catalogo">
          <Button variant="outline" className="rounded-full font-black border-2 px-8 h-12 border-primary/10 hover:border-primary hover:text-primary transition-all text-[10px] uppercase tracking-widest gap-2">
            Ver Todo el Catálogo <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-[2.5rem] border-2 border-dashed border-primary/5">
          <p className="text-muted-foreground font-bold text-sm uppercase tracking-widest">No hay productos disponibles en esta sección.</p>
        </div>
      )}
    </section>
  );
}
