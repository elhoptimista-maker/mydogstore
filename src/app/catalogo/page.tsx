import { fetchFilteredCatalog } from '@/actions/products';
import ProductCard from '@/components/ProductCard';
import { LayoutGrid, Search, Star, Package, Dog } from 'lucide-react';
import { CATEGORIES, PET_TYPES, BRANDS } from '@/lib/mock-db';
import FilterSidebar from '@/components/catalogo/FilterSidebar';
import CatalogControls from '@/components/catalogo/CatalogControls';
import Pagination from '@/components/catalogo/Pagination';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Catálogo de Distribución | MyDog Distribuidora',
  description: 'Catálogo profesional de nutrición y accesorios certificados.',
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * @fileOverview Página principal del catálogo. Orquestador de servidor.
 * Delega el filtrado al Server Action y la navegación a componentes especializados.
 */
export default async function CatalogoPage(props: PageProps) {
  const searchParams = await props.searchParams;
  
  // 1. Delegamos el filtrado y lógica de negocio al Server Action (Optimizado con Caché)
  const { 
    products, 
    totalCount, 
    totalPages, 
  } = await fetchFilteredCatalog(searchParams);

  const view = (typeof searchParams.view === 'string' ? searchParams.view : 'grid') as 'grid' | 'list';

  // --- LÓGICA DE HERO DINÁMICO ---
  const getParam = (key: string) => {
    const val = searchParams[key];
    return Array.isArray(val) ? val[0] : val;
  };

  const q = getParam('q');
  const categoria = getParam('categoria')?.split(',')[0];
  const marca = getParam('marca')?.split(',')[0];
  const especie = getParam('especie')?.split(',')[0];

  let displayBadge = "Explora nuestra tienda";
  let displayPrefix = "Nuestro";
  let displayHighlight = "Catálogo";
  let HeroIcon = LayoutGrid;

  if (q) {
    displayBadge = "Búsqueda Asistida";
    displayPrefix = "Buscando:";
    displayHighlight = q;
    HeroIcon = Search;
  } else if (marca) {
    displayBadge = "Especialistas en";
    displayPrefix = "Marca:";
    displayHighlight = marca;
    HeroIcon = Star;
  } else if (categoria) {
    displayBadge = "Todo en";
    displayPrefix = "Categoría:";
    displayHighlight = categoria;
    HeroIcon = Package;
  } else if (especie) {
    displayBadge = "Nutrición por especie";
    displayPrefix = "Para:";
    displayHighlight = `${especie}s`;
    HeroIcon = Dog;
  }

  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-20">
      {/* Hero Sección Dinámico */}
      <section className="relative h-48 md:h-64 flex items-center bg-[#FEF9F3] overflow-hidden mb-10 border-b border-black/5">
        <div className="absolute top-0 right-0 w-1/4 h-full opacity-5 pointer-events-none">
          <HeroIcon className="w-full h-full text-primary" />
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">{displayBadge}</span>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none">
              {displayPrefix} <span className="text-primary">{displayHighlight}</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar de Filtros (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <FilterSidebar 
              categories={CATEGORIES} 
              brands={BRANDS} 
              petTypes={PET_TYPES} 
            />
          </aside>

          {/* Área Principal */}
          <main className="lg:col-span-3 space-y-6">
            <CatalogControls 
              totalCount={totalCount} 
              categories={CATEGORIES}
              brands={BRANDS}
              petTypes={PET_TYPES}
            />
            
            {products.length > 0 ? (
              <div className={cn(
                "grid gap-6 md:gap-8 transition-all duration-500",
                view === 'list' ? "grid-cols-1" : "grid-cols-2 md:grid-cols-2 lg:grid-cols-3"
              )}>
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    variant={view} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-primary/20">
                <div className="space-y-4">
                  <p className="text-muted-foreground font-bold text-lg">No se encontraron productos con esos filtros.</p>
                  <p className="text-muted-foreground/60 text-sm max-w-xs mx-auto">Prueba quitando algunos filtros o buscando con otros términos.</p>
                  <Link href="/catalogo">
                    <Button variant="outline" className="mt-4 border-primary text-primary font-black uppercase tracking-widest text-xs h-12 px-8 rounded-full">
                      Limpiar todos los filtros
                    </Button>
                  </Link>
                </div>
              </div>
            )}
            
            {/* Paginación Profesional */}
            <Pagination totalPages={totalPages} />
          </main>
        </div>
      </div>
    </div>
  );
}
