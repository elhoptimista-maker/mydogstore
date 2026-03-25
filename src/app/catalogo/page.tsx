import { fetchFilteredCatalog } from '@/actions/products';
import ProductCard from '@/components/ProductCard';
import { LayoutGrid, ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES, PET_TYPES, BRANDS } from '@/lib/mock-db';
import FilterSidebar from '@/components/catalogo/FilterSidebar';
import CatalogControls from '@/components/catalogo/CatalogControls';
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

export default async function CatalogoPage(props: PageProps) {
  const searchParams = await props.searchParams;
  
  // 1. Delegamos el filtrado y paginación al Server Action (Optimizado con Caché)
  const { 
    products, 
    totalCount, 
    totalPages, 
    currentPage, 
    limit 
  } = await fetchFilteredCatalog(searchParams);

  const view = (typeof searchParams.view === 'string' ? searchParams.view : 'grid') as 'grid' | 'list';

  /**
   * Genera la URL de paginación clonando todos los parámetros actuales.
   */
  const getPaginationUrl = (p: number) => {
    const params = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else if (value !== undefined) {
        params.set(key, value);
      }
    });

    params.set('page', p.toString());
    params.set('limit', limit.toString());
    return `/catalogo?${params.toString()}`;
  };

  /**
   * Lógica inteligente para mostrar números de página
   */
  const getVisiblePages = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | string)[] = [1];
    if (currentPage > 3) pages.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) pages.push(i);
    }
    if (currentPage < totalPages - 2) pages.push('...');
    if (!pages.includes(totalPages)) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-20">
      {/* Hero Sección */}
      <section className="relative h-48 md:h-64 flex items-center bg-[#FEF9F3] overflow-hidden mb-10 border-b border-black/5">
        <div className="absolute top-0 right-0 w-1/4 h-full opacity-5 pointer-events-none">
          <LayoutGrid className="w-full h-full text-primary" />
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Explora nuestra tienda</span>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none">
              Nuestro <span className="text-primary">Catálogo</span>
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
            
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-12">
                <Button 
                  variant="ghost" 
                  disabled={currentPage <= 1}
                  asChild={currentPage > 1}
                  className="w-12 h-12 rounded-full font-black bg-white shadow-sm border border-black/5 hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                >
                  {currentPage > 1 ? (
                    <Link href={getPaginationUrl(currentPage - 1)}>
                      <ChevronLeft className="w-5 h-5" />
                    </Link>
                  ) : (
                    <ChevronLeft className="w-5 h-5" />
                  )}
                </Button>
                
                <div className="flex items-center gap-2">
                  {getVisiblePages().map((p, i) => {
                    if (p === '...') {
                      return <span key={`dots-${i}`} className="px-2 text-muted-foreground font-black">...</span>;
                    }
                    
                    const pageNum = p as number;
                    return (
                      <Button 
                        key={pageNum}
                        asChild={currentPage !== pageNum}
                        className={cn(
                          "w-12 h-12 rounded-full font-black transition-all",
                          currentPage === pageNum 
                            ? "bg-secondary text-primary shadow-xl shadow-secondary/20 scale-110 pointer-events-none" 
                            : "bg-white text-foreground shadow-sm border border-black/5 hover:bg-primary/5 hover:text-primary"
                        )}
                      >
                        {currentPage !== pageNum ? (
                          <Link href={getPaginationUrl(pageNum)}>
                            {pageNum.toString().padStart(2, '0')}
                          </Link>
                        ) : (
                          <span>{pageNum.toString().padStart(2, '0')}</span>
                        )}
                      </Button>
                    );
                  })}
                </div>

                <Button 
                  variant="ghost" 
                  disabled={currentPage >= totalPages}
                  asChild={currentPage < totalPages}
                  className="w-12 h-12 rounded-full font-black bg-white shadow-sm border border-black/5 hover:bg-primary hover:text-white transition-all disabled:opacity-30"
                >
                  {currentPage < totalPages ? (
                    <Link href={getPaginationUrl(currentPage + 1)}>
                      <ChevronRight className="w-5 h-5" />
                    </Link>
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
