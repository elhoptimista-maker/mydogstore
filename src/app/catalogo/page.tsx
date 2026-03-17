
import { getProducts, CATEGORIES, PET_TYPES, BRANDS } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import { 
  ChevronDown, 
  LayoutGrid, 
  List, 
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
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

export default async function CatalogoPage() {
  const products = await getProducts();

  const FiltersContent = () => (
    <div className="space-y-10">
      {/* Rango de Precio */}
      <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-orange-50">
        <h4 className="text-lg font-black mb-6 border-b pb-4 text-primary">Rango de Precio</h4>
        <Slider defaultValue={[0, 100000]} max={200000} step={1000} className="mb-6" />
        <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
          <div className="bg-muted px-3 py-1 rounded-lg">$0</div>
          <div className="bg-muted px-3 py-1 rounded-lg">$200.000+</div>
        </div>
      </div>

      {/* Categorías */}
      <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-orange-50">
        <h4 className="text-lg font-black mb-6 border-b pb-4 text-primary">Categoría</h4>
        <div className="space-y-4">
          {CATEGORIES.slice(0, 6).map((cat) => (
            <div key={cat} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox id={`cat-${cat}`} className="rounded-md border-orange-200 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" />
              <Label htmlFor={`cat-${cat}`} className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">
                {cat}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Marcas */}
      <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-orange-50">
        <h4 className="text-lg font-black mb-6 border-b pb-4 text-primary">Marca</h4>
        <div className="space-y-4 max-h-64 overflow-y-auto pr-2 no-scrollbar">
          {BRANDS.slice(0, 10).map((brand) => (
            <div key={brand} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox id={`brand-${brand}`} className="rounded-md border-orange-200 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" />
              <Label htmlFor={`brand-${brand}`} className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Mascotas */}
      <div className="bg-white p-6 lg:p-8 rounded-[2rem] lg:rounded-[2.5rem] shadow-sm border border-orange-50">
        <h4 className="text-lg font-black mb-6 border-b pb-4 text-primary">Mascotas</h4>
        <div className="space-y-4">
          {PET_TYPES.map((pet) => (
            <div key={pet} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox id={`pet-${pet}`} className="rounded-md border-orange-200 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" />
              <Label htmlFor={`pet-${pet}`} className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">
                {pet}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-[#FFF9F6] min-h-screen pb-20">
      {/* Hero Header */}
      <section className="relative h-48 md:h-80 flex items-center bg-[#FEF3EF] overflow-hidden mb-8 lg:mb-12">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full">
                <path fill="#FF9F43" d="M44.7,-76.4C58.2,-69.2,69.7,-57.4,77.1,-43.9C84.5,-30.4,87.7,-15.2,86.5,-0.7C85.3,13.8,79.7,27.6,71.5,40.1C63.3,52.6,52.5,63.7,39.7,70.9C26.9,78.1,12.1,81.4,-2.4,85.5C-16.9,89.7,-31.1,94.7,-43.9,87.6C-56.8,80.5,-68.2,61.4,-75.4,43.6C-82.6,25.8,-85.7,9.3,-84.3,-6.6C-82.9,-22.5,-77.1,-37.8,-67.4,-49.8C-57.8,-61.8,-44.4,-70.5,-30.9,-77.7C-17.4,-84.9,-3.7,-90.6,11.3,-89.7C26.3,-88.8,44.7,-76.4,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full relative z-10">
          <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tight mb-2">Catálogo</h1>
          <nav className="flex text-xs md:text-sm font-medium text-muted-foreground">
            <span className="text-secondary">Inicio</span>
            <span className="mx-2">🐾</span>
            <span>Catálogo</span>
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Sidebar de Filtros Desktop - FIJO IZQUIERDA */}
          <aside className="hidden lg:block lg:col-span-1">
            <FiltersContent />
          </aside>

          {/* Área de Productos */}
          <main className="lg:col-span-3 space-y-6 md:space-y-8">
            
            {/* Controles de Vista y Filtro Móvil */}
            <div className="bg-white p-3 md:p-4 rounded-2xl md:rounded-3xl shadow-sm border border-orange-50 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="lg:hidden rounded-xl bg-primary text-white hover:bg-primary/90 px-4 font-bold h-10 gap-2">
                      <Filter className="w-4 h-4" /> Filtros
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-[85%] sm:max-w-md p-0 overflow-y-auto bg-[#FFF9F6]">
                    <SheetHeader className="p-6 bg-primary text-white sticky top-0 z-10">
                      <SheetTitle className="text-white font-black text-xl">Filtrar Productos</SheetTitle>
                    </SheetHeader>
                    <div className="p-6 pb-20">
                      <FiltersContent />
                    </div>
                  </SheetContent>
                </Sheet>

                <div className="hidden md:flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="rounded-xl bg-primary/5 text-primary">
                    <LayoutGrid className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-primary">
                    <List className="w-5 h-5" />
                  </Button>
                </div>
                <span className="text-[10px] md:text-sm font-medium text-muted-foreground ml-0 md:ml-4">
                  {products.length} productos
                </span>
              </div>
              
              <div className="flex items-center gap-2 md:gap-4">
                <Select defaultValue="default">
                  <SelectTrigger className="w-32 md:w-48 rounded-xl border-orange-50 focus:ring-primary h-10 font-bold text-xs md:text-sm">
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="default">Por defecto</SelectItem>
                    <SelectItem value="price-asc">Menor Precio</SelectItem>
                    <SelectItem value="price-desc">Mayor Precio</SelectItem>
                    <SelectItem value="rating">Más valorados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Paginación Circular */}
            <div className="flex justify-center items-center gap-2 pt-8 md:pt-12">
              <Button variant="ghost" className="w-10 h-10 md:w-12 md:h-12 rounded-full font-black bg-white shadow-sm border border-orange-100">
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 rotate-90" />
              </Button>
              <Button className="w-10 h-10 md:w-12 md:h-12 rounded-full font-black bg-secondary text-foreground shadow-lg">01</Button>
              <Button variant="ghost" className="w-10 h-10 md:w-12 md:h-12 rounded-full font-black bg-white shadow-sm border border-orange-100">02</Button>
              <Button variant="ghost" className="w-10 h-10 md:w-12 md:h-12 rounded-full font-black bg-white shadow-sm border border-orange-100">
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5 -rotate-90" />
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
