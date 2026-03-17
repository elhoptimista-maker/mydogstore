
import { getProducts } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Catálogo Completo | MydogStore',
  description: 'Explora nuestra selección premium de comida, juguetes y camas para tu perro.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-headline font-extrabold text-primary">Nuestro Catálogo</h1>
        <p className="text-muted-foreground text-lg max-w-2xl">
          Todo lo que tu perro necesita para estar bakán, seleccionado con amor y respaldo científico.
        </p>
      </div>

      <div className="flex items-center gap-4 py-4 border-y border-border">
        <Button variant="outline" className="rounded-full gap-2">
          <Filter className="w-4 h-4" /> Filtrar
        </Button>
        <Button variant="outline" className="rounded-full gap-2">
          <SlidersHorizontal className="w-4 h-4" /> Ordenar
        </Button>
        <div className="hidden md:flex gap-2 ml-auto">
          {['Todo', 'Comida', 'Juguetes', 'Camas', 'Salud'].map((cat) => (
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
