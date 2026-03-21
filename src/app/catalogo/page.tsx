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

// Forzamos dynamic ya que la búsqueda depende de parámetros de URL en tiempo de ejecución
export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CatalogoPage(props: PageProps) {
  const searchParams = await props.searchParams;
  
  const q = typeof searchParams.q === 'string' ? searchParams.q : undefined;
  const categoria = typeof searchParams.categoria === 'string' ? searchParams.categoria : undefined;
  const marca = typeof searchParams.marca === 'string' ? searchParams.marca : undefined;
  const especie = typeof searchParams.especie === 'string' ? searchParams.especie : undefined;
  const sort = typeof searchParams.sort === 'string' ? searchParams.sort : undefined;
  const minPrice = typeof searchParams.minPrice === 'string' ? searchParams.minPrice : undefined;
  const maxPrice = typeof searchParams.maxPrice === 'string' ? searchParams.maxPrice : undefined;
  const page = typeof searchParams.page === 'string' ? searchParams.page : '1';
  const limit = typeof searchParams.limit === 'string' ? searchParams.limit : '25';

  const allProducts = (await getSanitizedProducts()).filter(p => p.currentStock > 0);
  
  let filteredProducts = [...allProducts];

  if (q) {
    const query = q.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) ||
      p.sku.toLowerCase().includes(query)
    );
  }

  if (categoria) {
    const cats = categoria.split(',');
    filteredProducts = filteredProducts.filter(p => cats.includes(p.category));
  }

  if (marca) {
    const marcas = marca.split(',');
    filteredProducts = filteredProducts.filter(p => marcas.includes(p.brand));
  }

  if (especie) {
    const especies = especie.split(',');
    filteredProducts = filteredProducts.filter(p => especies.includes(p.species));
  }

  if (minPrice || maxPrice) {
    const min = parseInt(minPrice || '0');
    const max = parseInt(maxPrice || '999999');
    filteredProducts = filteredProducts.filter(p => p.sellingPrice >= min && p.sellingPrice <= max);
  }

  if (sort === 'price-asc') {
    filteredProducts.sort((a, b) => a.sellingPrice - b.sellingPrice);
  } else if (sort === 'price-desc') {
    filteredProducts.sort((a, b) => b.sellingPrice - a.sellingPrice);
  }

  const currentPage = parseInt(page, 10);
  const itemsPerPage = parseInt(limit, 10);
  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const getPaginationUrl = (p: number) => {
    const params = new URLSearchParams();
    params.set('page', p.toString());
    params.set('limit', itemsPerPage.toString());
    if (categoria) params.set('categoria', categoria);
    if (marca) params.set('marca', marca);
    if (especie) params.set('especie', especie);
    if (sort) params.set('sort', sort);
    if (q) params.set('q', q);
    return `/catalogo?${params.toString()}`;
  };

  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-20">
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
          <aside className="hidden lg:block lg:col-span-1">
            <FilterSidebar 
              categories={CATEGORIES} 
              brands={BRANDS} 
              petTypes={PET_TYPES} 
            />
          </aside>
          <main className="lg:col-span-3 space-y-8">
            <CatalogControls totalCount={totalProducts} />
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] p-20 text-center border border-dashed border-primary/20">
                <p className="text-muted-foreground font-bold">No se encontraron productos con stock en este momento.</p>
                <Link href="/catalogo">
                  <Button variant="link" className="mt-4 text-primary font-black uppercase tracking-widest text-xs">Limpiar filtros</Button>
                </Link>
              </div>
            )}
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
                          <Link href={getPaginationUrl(p)}>
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
