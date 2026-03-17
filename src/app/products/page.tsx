import { getProducts } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Catálogo de Distribución | MyDog Distribuidora',
  description: 'Catálogo completo de nutrición especializada y accesorios para clientes mayoristas y profesionales.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-headline font-extrabold text-primary">Catálogo Corporativo</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Selección técnica de productos de alta rotación y especialidad para su establecimiento.
        </p>
      </div>

      <div className="flex items-center gap-4 py-4 border-y border-border">
        <Button variant="outline" className="rounded-full gap-2">
          <Filter className="w-4 h-4" /> Categorías
        </Button>
        <Button variant="outline" className="rounded-full gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Ordenar por
        </Button>
        <div className="hidden md:flex gap-2 ml-auto">
          {['Todos', 'Nutrición Clínica', 'Mobiliario', 'Accesorios Técnicos'].map((cat) => (
            <Button key={cat} variant="ghost" className="rounded-full px-6 hover:bg-primary/5 hover:text-primary transition-colors">
              {cat}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
