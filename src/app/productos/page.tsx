
import { getProducts, CATEGORIES, PET_TYPES, BRANDS } from '@/lib/mock-db';
import ProductCard from '@/components/ProductCard';
import { 
  Search, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  Filter
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

export const metadata = {
  title: 'Catálogo de Distribución | MyDog Distribuidora',
  description: 'Catálogo profesional de nutrición y accesorios certificados.',
};

export default async function ProductosPage() {
  const products = await getProducts();

  return (
    <div className="bg-[#FFF9F6] min-h-screen pb-20">
      {/* Hero Header Estilo Shoo */}
      <section className="relative h-64 md:h-80 flex items-center bg-[#FEF3EF] overflow-hidden mb-12">
        <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
            <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="h-full">
                <path fill="#FF9F43" d="M44.7,-76.4C58.2,-69.2,69.7,-57.4,77.1,-43.9C84.5,-30.4,87.7,-15.2,86.5,-0.7C85.3,13.8,79.7,27.6,71.5,40.1C63.3,52.6,52.5,63.7,39.7,70.9C26.9,78.1,12.1,81.4,-2.4,85.5C-16.9,89.7,-31.1,94.7,-43.9,87.6C-56.8,80.5,-68.2,61.4,-75.4,43.6C-82.6,25.8,-85.7,9.3,-84.3,-6.6C-82.9,-22.5,-77.1,-37.8,-67.4,-49.8C-57.8,-61.8,-44.4,-70.5,-30.9,-77.7C-17.4,-84.9,-3.7,-90.6,11.3,-89.7C26.3,-88.8,44.7,-76.4,44.7,-76.4Z" transform="translate(100 100)" />
            </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10">
          <h1 className="text-5xl md:text-7xl font-black text-foreground tracking-tight mb-2">Catálogo</h1>
          <nav className="flex text-sm font-medium text-muted-foreground">
            <span className="text-secondary">Inicio</span>
            <span className="mx-2">🐾</span>
            <span>Productos</span>
          </nav>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Sidebar de Filtros (Fijos a la izquierda) */}
          <aside className="lg:col-span-1 space-y-10">
            
            {/* Rango de Precio */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-100">
              <h4 className="text-lg font-black mb-6 border-b pb-4">Rango de Precio</h4>
              <Slider defaultValue={[0, 100000]} max={200000} step={1000} className="mb-6" />
              <div className="flex items-center justify-between text-sm font-bold text-muted-foreground">
                <div className="bg-muted px-3 py-1 rounded-lg">$0</div>
                <div className="bg-muted px-3 py-1 rounded-lg">$200.000+</div>
              </div>
            </div>

            {/* Categorías */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-100">
              <h4 className="text-lg font-black mb-6 border-b pb-4">Categoría</h4>
              <div className="space-y-4">
                {CATEGORIES.slice(0, 6).map((cat) => (
                  <div key={cat} className="flex items-center space-x-3 group cursor-pointer">
                    <Checkbox id={cat} className="rounded-md border-orange-200 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" />
                    <Label htmlFor={cat} className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">
                      {cat}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Marcas */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-100">
              <h4 className="text-lg font-black mb-6 border-b pb-4">Marca</h4>
              <div className="space-y-4 max-h-64 overflow-y-auto pr-2 no-scrollbar">
                {BRANDS.slice(0, 10).map((brand) => (
                  <div key={brand} className="flex items-center space-x-3 group cursor-pointer">
                    <Checkbox id={brand} className="rounded-md border-orange-200 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" />
                    <Label htmlFor={brand} className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

             {/* Mascotas */}
             <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-orange-100">
              <h4 className="text-lg font-black mb-6 border-b pb-4">Mascotas</h4>
              <div className="space-y-4">
                {PET_TYPES.map((pet) => (
                  <div key={pet} className="flex items-center space-x-3 group cursor-pointer">
                    <Checkbox id={pet} className="rounded-md border-orange-200 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" />
                    <Label htmlFor={pet} className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors cursor-pointer">
                      {pet}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Área de Productos */}
          <main className="lg:col-span-3 space-y-8">
            
            {/* Controles de Vista y Orden */}
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-orange-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl bg-primary/5 text-primary">
                  <LayoutGrid className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-xl text-muted-foreground hover:text-primary">
                  <List className="w-5 h-5" />
                </Button>
                <span className="text-sm font-medium text-muted-foreground ml-4">Mostrando 1–{products.length} de {products.length} resultados</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Ver:</span>
                    <Select defaultValue="12">
                        <SelectTrigger className="w-20 rounded-xl border-orange-100 focus:ring-primary h-10 font-bold">
                            <SelectValue placeholder="12" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                            <SelectItem value="48">48</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Select defaultValue="default">
                  <SelectTrigger className="w-48 rounded-xl border-orange-100 focus:ring-primary h-10 font-bold">
                    <SelectValue placeholder="Orden predeterminado" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="default">Orden predeterminado</SelectItem>
                    <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                    <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                    <SelectItem value="rating">Mejor valorados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid de Productos */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Paginación Estilo Scooby */}
            <div className="flex justify-center items-center gap-2 pt-12">
              <Button variant="ghost" className="w-12 h-12 rounded-full font-black bg-white shadow-sm border border-orange-100 hover:bg-primary hover:text-white transition-all">
                <ChevronDown className="w-5 h-5 rotate-90" />
              </Button>
              <Button className="w-12 h-12 rounded-full font-black bg-secondary text-foreground shadow-lg">01</Button>
              <Button variant="ghost" className="w-12 h-12 rounded-full font-black bg-white shadow-sm border border-orange-100 hover:bg-primary hover:text-white transition-all">02</Button>
              <Button variant="ghost" className="w-12 h-12 rounded-full font-black bg-white shadow-sm border border-orange-100 hover:bg-primary hover:text-white transition-all">03</Button>
              <Button variant="ghost" className="w-12 h-12 rounded-full font-black bg-white shadow-sm border border-orange-100 hover:bg-primary hover:text-white transition-all">
                <ChevronDown className="w-5 h-5 -rotate-90" />
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
