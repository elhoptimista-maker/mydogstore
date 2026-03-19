import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { SanitizedProduct } from '@/types/product';

/**
 * @fileOverview Sección de productos destacados para la Home.
 */

interface FeaturedProductsProps {
  products: SanitizedProduct[];
}

export default function FeaturedProducts({ products }: FeaturedProductsProps) {
  return (
    <section className="pb-24 pt-12 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
      <div className="flex flex-row justify-between items-end border-b border-black/5 pb-8">
        <div className="space-y-2">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Selección experta</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Productos <span className="text-primary">Destacados</span></h2>
        </div>
        <Link href="/catalogo">
          <Button variant="outline" className="rounded-full font-bold border-2 px-8 h-12 border-primary/10 hover:border-primary transition-all">Ver Todos</Button>
        </Link>
      </div>
      
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-primary/10">
          <p className="text-muted-foreground font-medium">No se encontraron productos con stock disponibles en este momento.</p>
        </div>
      )}
    </section>
  );
}
