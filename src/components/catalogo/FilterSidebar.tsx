
"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { X, Filter, Sparkles } from 'lucide-react';

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  petTypes: string[];
}

/**
 * @fileOverview Sidebar de filtros con lógica asistida y persistencia robusta.
 * Utiliza la URL como fuente de verdad absoluta para evitar pérdida de datos durante la navegación.
 */
export default function FilterSidebar({ categories, brands, petTypes }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Fuente de Verdad: Derivamos los filtros directamente de la URL
  const selectedCats = useMemo(() => searchParams.get('categoria')?.split(',') || [], [searchParams]);
  const selectedBrands = useMemo(() => searchParams.get('marca')?.split(',') || [], [searchParams]);
  const selectedPets = useMemo(() => searchParams.get('especie')?.split(',') || [], [searchParams]);
  
  // El rango de precio lo mantenemos en estado local para que el slider sea fluido, 
  // pero se sincroniza con la URL al soltar el mouse (onValueCommit)
  const [priceRange, setPriceRange] = useState([
    parseInt(searchParams.get('minPrice') || '0'),
    parseInt(searchParams.get('maxPrice') || '200000')
  ]);
  
  // Estado para controlar qué acordeones están abiertos (Lógica Visual Asistida)
  const [openSections, setOpenSections] = useState<string[]>(() => {
    // Si no hay nada seleccionado, empezamos por especies
    if (selectedPets.length === 0) return ["especies"];
    // Si hay especies pero no categorías, sugerimos categorías
    if (selectedCats.length === 0) return ["categoria"];
    // Si hay categorías pero no marcas, sugerimos marcas
    return ["marca"];
  });

  const handleToggle = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    const currentValues = params.get(key)?.split(',') || [];
    
    const isAdding = !currentValues.includes(value);
    let nextValues: string[];

    if (isAdding) {
      nextValues = [...currentValues, value];
      params.set(key, nextValues.join(','));
      
      // Lógica Asistida: Saltar a la siguiente sección al seleccionar
      if (key === 'especie') setOpenSections(["categoria"]);
      else if (key === 'categoria') setOpenSections(["marca"]);
    } else {
      nextValues = currentValues.filter(v => v !== value);
      if (nextValues.length > 0) {
        params.set(key, nextValues.join(','));
      } else {
        params.delete(key);
      }
    }

    // Siempre reseteamos a la página 1 al filtrar
    params.set('page', '1');
    router.push(`/catalogo?${params.toString()}`, { scroll: false });
  };

  const updatePriceUrl = (values: number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('minPrice', values[0].toString());
    params.set('maxPrice', values[1].toString());
    params.set('page', '1');
    router.push(`/catalogo?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push('/catalogo');
    setOpenSections(["especies"]);
    setPriceRange([0, 200000]);
  };

  const hasActiveFilters = selectedCats.length > 0 || selectedBrands.length > 0 || selectedPets.length > 0 || searchParams.has('minPrice') || searchParams.has('maxPrice');

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/5 border border-black/[0.03] overflow-hidden sticky top-48 flex flex-col max-h-[calc(100vh-200px)]">
      {/* Header Fijo */}
      <div className="p-6 border-b border-black/[0.03] flex items-center justify-between bg-primary/5 shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Filtros Asistidos</span>
        </div>
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAll}
            className="h-7 px-2 rounded-full text-[9px] font-black uppercase tracking-tighter text-primary/60 hover:text-red-500 hover:bg-red-50"
          >
            Limpiar <X className="ml-1 w-3 h-3" />
          </Button>
        )}
      </div>

      {/* Área Scrolleable */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {/* Rango de Precio */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Rango de Precio</h4>
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">CLP</span>
          </div>
          <Slider 
            value={priceRange} 
            min={0} 
            max={200000} 
            step={5000} 
            onValueChange={setPriceRange}
            onValueCommit={updatePriceUrl}
          />
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 bg-muted/30 p-2.5 rounded-xl border border-black/[0.02]">
              <span className="text-[8px] block font-black text-muted-foreground uppercase mb-0.5">Desde</span>
              <span className="text-xs font-bold text-foreground">${priceRange[0].toLocaleString()}</span>
            </div>
            <div className="flex-1 bg-muted/30 p-2.5 rounded-xl border border-black/[0.02] text-right">
              <span className="text-[8px] block font-black text-muted-foreground uppercase mb-0.5">Hasta</span>
              <span className="text-xs font-bold text-foreground">${priceRange[1].toLocaleString()}+</span>
            </div>
          </div>
        </div>

        {/* Acordeones Dinámicos */}
        <Accordion 
          type="multiple" 
          value={openSections} 
          onValueChange={setOpenSections} 
          className="w-full"
        >
          <AccordionItem value="especies" className="border-none mb-2">
            <AccordionTrigger className="hover:no-underline py-3 px-4 rounded-2xl hover:bg-muted/30 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary group-data-[state=open]:scale-150 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-[0.1em]">1. Especies</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 px-4 pb-6">
              <div className="grid grid-cols-1 gap-3">
                {petTypes.map((pet) => (
                  <div key={pet} className="flex items-center space-x-3 group cursor-pointer">
                    <Checkbox 
                      id={`pet-${pet}`} 
                      checked={selectedPets.includes(pet)}
                      onCheckedChange={() => handleToggle('especie', pet)}
                      className="rounded-md border-primary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" 
                    />
                    <Label htmlFor={`pet-${pet}`} className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer tracking-tight">
                      {pet}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="categoria" className="border-none mb-2">
            <AccordionTrigger className="hover:no-underline py-3 px-4 rounded-2xl hover:bg-muted/30 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary group-data-[state=open]:scale-150 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-[0.1em]">2. Categorías</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 px-4 pb-6">
              <div className="grid grid-cols-1 gap-3">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center space-x-3 group cursor-pointer">
                    <Checkbox 
                      id={`cat-${cat}`} 
                      checked={selectedCats.includes(cat)}
                      onCheckedChange={() => handleToggle('categoria', cat)}
                      className="rounded-md border-primary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" 
                    />
                    <Label htmlFor={`cat-${cat}`} className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer tracking-tight">
                      {cat}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="marca" className="border-none">
            <AccordionTrigger className="hover:no-underline py-3 px-4 rounded-2xl hover:bg-muted/30 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-secondary group-data-[state=open]:scale-150 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-[0.1em]">3. Marcas</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 px-4 pb-2">
              <div className="grid grid-cols-1 gap-3">
                {brands.map((brand) => (
                  <div key={brand} className="flex items-center space-x-3 group cursor-pointer">
                    <Checkbox 
                      id={`brand-${brand}`} 
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => handleToggle('marca', brand)}
                      className="rounded-md border-primary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" 
                    />
                    <Label htmlFor={`brand-${brand}`} className="text-xs font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer tracking-tight">
                      {brand}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Footer Fijo */}
      <div className="p-6 bg-muted/30 border-t border-black/[0.03] space-y-4 shrink-0">
        <div className="flex items-center gap-2 text-primary/40">
          <Sparkles className="w-3 h-3" />
          <p className="text-[8px] font-black uppercase tracking-widest leading-tight">
            Navegación asistida para una <br /> búsqueda técnica eficaz
          </p>
        </div>
      </div>
    </div>
  );
}
