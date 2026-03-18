
import { getSanitizedProducts } from '@/lib/services/catalog.service';
import { CATEGORIES, PET_TYPES, BRANDS } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import { 
  ChevronLeft,
  ChevronRight,
  LayoutGrid, 
  List, 
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

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
  }>;
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const { page: pageStr, limit: limitStr } = await searchParams;
  
  // Parámetros de paginación
  const currentPage = parseInt(pageStr || '1', 10);
  const itemsPerPage = parseInt(limitStr || '25', 10);
  
  const allProducts = await getSanitizedProducts();
  
  // Lógica de paginación
  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = allProducts.slice(startIndex, startIndex + itemsPerPage);

  const FiltersContent = () => (
    <div className="space-y-8">
      {/* Rango de Precio */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/[0.03]">
        <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-primary/60">Presupuesto</h4>
        <Slider defaultValue={[0, 100000]} max={200000} step={1000} className="mb-6" />
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <div className="bg-muted/50 px-3 py-1.5 rounded-lg">$0</div>
          <div className="bg-muted/50 px-3 py-1.5 rounded-lg">$200.000+</div>
        </div>
      </div>

      {/* Categorías */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/[0.03]">
        <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-primary/60">Categoría</h4>
        <div className="space-y-4">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <div key={cat} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox id={`cat-${cat}`} className="rounded-md border-primary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" />
              <Label htmlFor={`cat-${cat}`} className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer tracking-tight">
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Marcas */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/[0.03]">
        <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-primary/60">Marcas</h4>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 no-scrollbar">
          {BRANDS.slice(0, 10).map((brand) => (
            <div key={brand} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox id={`brand-${brand}`} className="rounded-md border-primary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" />
              <Label htmlFor={`brand-${brand}`} className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer tracking-tight">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Mascotas */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/[0.03]">
        <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-primary/60">Especies</h4>
        <div className="space-y-4">
          {PET_TYPES.map((pet) => (
            <div key={pet} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox id={`pet-${pet}`} className="rounded-md border-primary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" />
              <Label htmlFor={`pet-${pet}`} className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer tracking-tight">
                {pet}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-20">
      {/* Hero Header Minimalista */}
      <section className="relative h-48 md:h-64 flex items-center bg-[#FEF9F3] overflow-hidden mb-8 border-b border-black/5">
        <div className="absolute top-0 right-0 w-1/4 h-full opacity-5 pointer-events-none">
          <LayoutGrid className="w-full h-full text-primary" />
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Explora nuestra tienda</span>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none">Nuestro <span className="text-primary">Catálogo</span></h1>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar de Filtros Desktop */}
          <aside className="hidden lg:block lg:col-span-1">
            <FiltersContent />
          </aside>

          {/* Área de Productos */}
          <main className="lg:col-span-3 space-y-8">
            
            {/* Controles de Vista */}
            <div className="bg-white p-4 rounded-[2rem] shadow-sm border border-black/[0.03] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" className="lg:hidden rounded-full bg-primary text-white hover:bg-primary/90 px-6 font-bold h-11 gap-2 shadow-lg shadow-primary/20">
                      <Filter className="w-4 h-4" /> Filtros
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[85%] sm:max-w-md p-0 overflow-y-auto bg-[#F6F6F6]">
                    <SheetHeader className="p-8 bg-primary text-white sticky top-0 z-10">
                      <SheetTitle className="text-white font-black text-2xl tracking-tighter leading-none">Filtrar</SheetTitle>
                    </SheetHeader>
                    <div className="p-8 pb-20">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="hidden md:flex items-center gap-2 bg-muted/30 p-1 rounded-xl">
                  <Button variant="ghost" size="icon" className="rounded-lg bg-white shadow-sm text-primary w-9 h-9">
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-lg text-muted-foreground hover:text-primary w-9 h-9">
                    <List className="w-4 h-4" />
                  </Button>
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest ml-2 whitespace-nowrap">
                  {totalProducts} productos
                </span>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                {/* Selector de Items por Página */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:inline">Ver:</span>
                  <Select defaultValue={itemsPerPage.toString()}>
                    <SelectTrigger className="w-20 rounded-xl border-none bg-muted/30 focus:ring-primary/20 h-11 font-bold text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl">
                      <SelectItem value="25" className="font-bold text-[10px]">25</SelectItem>
                      <SelectItem value="50" className="font-bold text-[10px]">50</SelectItem>
                      <SelectItem value="100" className="font-bold text-[10px]">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Select defaultValue="default">
                  <SelectTrigger className="w-36 md:w-44 rounded-xl border-none bg-muted/30 focus:ring-primary/20 h-11 font-bold text-xs uppercase tracking-wider">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-none shadow-2xl">
                    <SelectItem value="default" className="font-bold text-[10px] uppercase tracking-widest">Por defecto</SelectItem>
                    <SelectItem value="price-asc" className="font-bold text-[10px] uppercase tracking-widest">Menor Precio</SelectItem>
                    <SelectItem value="price-desc" className="font-bold text-[10px] uppercase tracking-widest">Mayor Precio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

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
                    <Link href={`/catalogo?page=${currentPage - 1}&limit=${itemsPerPage}`}>
                      <ChevronLeft className="w-5 h-5" />
                    </Link>
                  ) : (
                    <ChevronLeft className="w-5 h-5" />
                  )}
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                    // Mostrar solo algunas páginas si hay muchas (ej: 1, 2, 3 ... total)
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
                          <Link href={`/catalogo?page=${p}&limit=${itemsPerPage}`}>
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
                    <Link href={`/catalogo?page=${currentPage + 1}&limit=${itemsPerPage}`}>
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
