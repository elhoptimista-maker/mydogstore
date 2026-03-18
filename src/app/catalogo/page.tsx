
import { getSanitizedProducts } from '@/lib/services/catalog.service';
import ProductCard from '@/components/ProductCard';
import { LayoutGrid } from 'lucide-react';
import { CATEGORIES, PET_TYPES, BRANDS } from '@/lib/mock-db';
import FilterSidebar from '@/components/catalogo/FilterSidebar';
import CatalogControls from '@/components/catalogo/CatalogControls';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'Catálogo de Distribución | MyDog Distribuidora',
  description: 'Catálogo profesional de nutrición y accesorios certificados.',
};

interface PageProps {
  searchParams: Promise<{ 
    page?: string; 
    limit?: string;
    categoria?: string;
    marca?: string;
    especie?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
    q?: string;
  }>;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  
  // 1. Obtener todos los productos del ERP
  const allProducts = await getSanitizedProducts();
  
  // 2. Aplicar Filtros
  let filteredProducts = [...allProducts];

  if (params.q) {
    const query = params.q.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query)
    );
  }

  if (params.categoria) {
    const cats = params.categoria.split(',');
    filteredProducts = filteredProducts.filter(p => cats.includes(p.category));
  }

  if (params.marca) {
    const marcas = params.marca.split(',');
    filteredProducts = filteredProducts.filter(p => marcas.includes(p.brand));
  }

  if (params.especie) {
    const especies = params.especie.split(',');
    filteredProducts = filteredProducts.filter(p => especies.includes(p.species));
  }

  if (params.minPrice || params.maxPrice) {
    const min = parseInt(params.minPrice || '0');
    const max = parseInt(params.maxPrice || '999999');
    filteredProducts = filteredProducts.filter(p => p.sellingPrice >= min && p.sellingPrice <= max);
  }

  // 3. Aplicar Ordenamiento
  if (params.sort === 'price-asc') {
    filteredProducts.sort((a, b) => a.sellingPrice - b.sellingPrice);
  } else if (params.sort === 'price-desc') {
    filteredProducts.sort((a, b) => b.sellingPrice - a.sellingPrice);
  }

  // 4. Paginación
  const currentPage = parseInt(params.page || '1', 10);
  const itemsPerPage = parseInt(params.limit || '25', 10);
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-20">
      {/* Hero Header */}
      <section className="relative h-48 md:h-64 flex items-center bg-[#FEF9F3] overflow-hidden mb-8 border-b border-black/5">
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
          
          {/* Sidebar de Filtros Interactivos */}
          <aside className="hidden lg:block lg:col-span-1">
            <FilterSidebar 
              categories={CATEGORIES} 
              brands={BRANDS} 
              petTypes={PET_TYPES} 
            />
          </aside>

          {/* Área de Productos */}
          <main className="lg:col-span-3 space-y-8">
            
            {/* Controles de Vista Interactivos */}
            <CatalogControls totalCount={totalProducts} />

            {/* Grid de Productos */}
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-primary/20">
                <p className="text-muted-foreground font-bold">No se encontraron productos con los filtros seleccionados.</p>
                <Link href="/catalogo">
                  <Button variant="link" className="mt-4 text-primary font-black uppercase tracking-widest text-xs">Limpiar filtros</Button>
                </Link>
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
                    <Link href={`/catalogo?page=${currentPage - 1}&limit=${itemsPerPage}${params.categoria ? `&categoria=${params.categoria}` : ''}${params.marca ? `&marca=${params.marca}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}>
                      <ChevronLeft className="w-5 h-5" />
                    </Link>
                  ) : (
                    <ChevronLeft className="w-5 h-5" />
                  )}
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    if (totalPages > 5 && p > 3 && p < totalPages) {
                      if (p === 4) return <span key={p} className="px-2 text-muted-foreground">...</span>;
                      return null;
                    }
                    
                    return (
                      <Button 
                        key={p}
                        asChild={currentPage !== p}
                        className={cn(
                          "w-12 h-12 rounded-full font-black transition-all",
                          currentPage === p 
                            ? "bg-secondary text-primary shadow-xl shadow-secondary/20 scale-110 pointer-events-none" 
                            : "bg-white text-foreground shadow-sm border border-black/5 hover:bg-primary/5 hover:text-primary"
                        )}
                      >
                        {currentPage !== p ? (
                          <Link href={`/catalogo?page=${p}&limit=${itemsPerPage}${params.categoria ? `&categoria=${params.categoria}` : ''}${params.marca ? `&marca=${params.marca}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}>
                            {p.toString().padStart(2, '0')}
                          </Link>
                        ) : (
                          <span>{p.toString().padStart(2, '0')}</span>
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
                    <Link href={`/catalogo?page=${currentPage + 1}&limit=${itemsPerPage}${params.categoria ? `&categoria=${params.categoria}` : ''}${params.marca ? `&marca=${params.marca}` : ''}${params.sort ? `&sort=${params.sort}` : ''}`}>
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
