import { getProducts, CATEGORIES, PET_TYPES } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import { Filter, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

export const metadata = {
  title: 'Catálogo de Distribución | MyDog Distribuidora',
  description: 'Explore nuestro catálogo completo de nutrición especializada y accesorios certificados.',
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 space-y-12">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">Catálogo de Productos</h1>
        <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed">
          Selección profesional de nutrición y accesorios para el bienestar animal. Calidad garantizada desde Arica a Punta Arenas.
        </p>
      </div>

      {/* Filtros y Navegación de Colecciones */}
      <div className="flex flex-wrap items-center gap-4 py-6 border-y border-border/50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full gap-2 font-bold px-6 border-primary/20">
              <Filter className="w-4 h-4 text-primary" /> Categorías <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-2xl p-2 w-56">
            {CATEGORIES.map((cat) => (
              <DropdownMenuItem key={cat} className="rounded-xl cursor-pointer py-2 px-4 hover:bg-primary/5">
                {cat}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-full gap-2 font-bold px-6 border-primary/20">
              Mascotas <ChevronDown className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-2xl p-2 w-56">
            {PET_TYPES.map((type) => (
              <DropdownMenuItem key={type} className="rounded-xl cursor-pointer py-2 px-4 hover:bg-primary/5">
                {type}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="outline" className="rounded-full gap-2 font-bold px-6 border-primary/20 ml-auto hidden md:flex">
          <SlidersHorizontal className="w-4 h-4 text-primary" /> Ordenar por <ChevronDown className="w-4 h-4 opacity-50" />
        </Button>
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination Placeholder */}
      <div className="flex justify-center pt-12">
        <Button variant="ghost" className="rounded-full text-muted-foreground font-bold px-8 h-12">
          Cargar más productos
        </Button>
      </div>
    </div>
  );
}
