
"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useMemo, useEffect, useTransition } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { X, Filter, Sparkles, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  petTypes: string[];
}

/**
 * @fileOverview Sidebar de filtros optimizado con estados optimistas y tags visuales.
 * Proporciona feedback instantáneo al usuario y sincroniza con la URL de forma fluida.
 */
export default function FilterSidebar({ categories, brands, petTypes }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // 1. Estados Locales para Feedback Instantáneo (Optimistic UI)
  const [localPets, setLocalPets] = useState<string[]>([]);
  const [localCats, setLocalCats] = useState<string[]>([]);
  const [localBrands, setLocalBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);

  // Sincronizar estados locales con la URL cuando esta cambie (ej: atrás/adelante)
  useEffect(() => {
    setLocalPets(searchParams.get('especie')?.split(',').filter(Boolean) || []);
    setLocalCats(searchParams.get('categoria')?.split(',').filter(Boolean) || []);
    setLocalBrands(searchParams.get('marca')?.split(',').filter(Boolean) || []);
    
    const min = parseInt(searchParams.get('minPrice') || '0');
    const max = parseInt(searchParams.get('maxPrice') || '200000');
    setPriceRange([min, max]);
  }, [searchParams]);

  // Estado de secciones abiertas
  const [openSections, setOpenSections] = useState<string[]>(() => {
    if (!searchParams.get('especie')) return ["especies"];
    if (!searchParams.get('categoria')) return ["categoria"];
    return ["marca"];
  });

  // 2. Lógica de Selección con persistencia inmediata en UI
  const handleToggle = (key: string, value: string) => {
    // Determinamos el nuevo estado local basado en la acción
    const updateList = (prev: string[]) => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value];

    let nextPets = localPets;
    let nextCats = localCats;
    let nextBrands = localBrands;

    // Actualización inmediata de la UI
    if (key === 'especie') {
      nextPets = updateList(localPets);
      setLocalPets(nextPets);
      // Lógica asistida: Si seleccionamos especie y no hay categorías, abrimos categorías
      if (nextPets.length > 0 && localCats.length === 0) setOpenSections(["categoria"]);
    } else if (key === 'categoria') {
      nextCats = updateList(localCats);
      setLocalCats(nextCats);
      if (nextCats.length > 0 && localBrands.length === 0) setOpenSections(["marca"]);
    } else if (key === 'marca') {
      nextBrands = updateList(localBrands);
      setLocalBrands(nextBrands);
    }

    // Sincronización diferida con la URL (sin bloquear la UI)
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      
      const sync = (k: string, list: string[]) => {
        if (list.length > 0) params.set(k, list.join(','));
        else params.delete(k);
      };

      sync('especie', nextPets);
      sync('categoria', nextCats);
      sync('marca', nextBrands);
      params.set('page', '1');

      router.push(`/catalogo?${params.toString()}`, { scroll: false });
    });
  };

  const updatePriceUrl = (values: number[]) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('minPrice', values[0].toString());
      params.set('maxPrice', values[1].toString());
      params.set('page', '1');
      router.push(`/catalogo?${params.toString()}`, { scroll: false });
    });
  };

  const clearAll = () => {
    setLocalPets([]);
    setLocalCats([]);
    setLocalBrands([]);
    setPriceRange([0, 200000]);
    setOpenSections(["especies"]);
    router.push('/catalogo');
  };

  // Construcción de la lista de filtros activos para los Tags
  const activeFilters = [
    ...localPets.map(v => ({ key: 'especie', val: v })),
    ...localCats.map(v => ({ key: 'categoria', val: v })),
    ...localBrands.map(v => ({ key: 'marca', val: v }))
  ];

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/5 border border-black/[0.03] overflow-hidden sticky top-48 flex flex-col max-h-[calc(100vh-200px)]">
      {/* Header Fijo */}
      <div className="p-6 border-b border-black/[0.03] flex items-center justify-between bg-primary/5 shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Filtros Técnicos</span>
        </div>
        {(activeFilters.length > 0 || searchParams.has('minPrice')) && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAll}
            className="h-7 px-3 rounded-full text-[9px] font-black uppercase tracking-tighter text-primary/60 hover:text-red-500 hover:bg-red-50"
          >
            Limpiar Todo
          </Button>
        )}
      </div>

      {/* Tags de Filtros Activos (Feedback Visual Inmediato) */}
      {activeFilters.length > 0 && (
        <div className="px-6 py-4 bg-white border-b border-black/[0.03] flex flex-wrap gap-2 shrink-0 max-h-32 overflow-y-auto no-scrollbar">
          {activeFilters.map((filter) => (
            <Badge 
              key={`${filter.key}-${filter.val}`}
              onClick={() => handleToggle(filter.key, filter.val)}
              className="bg-primary/5 text-primary border-primary/10 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all cursor-pointer py-1.5 pl-3 pr-2 rounded-full gap-1 group shadow-sm"
            >
              <span className="text-[9px] font-black uppercase tracking-tight">{filter.val}</span>
              <X className="w-3 h-3 opacity-40 group-hover:opacity-100" />
            </Badge>
          ))}
        </div>
      )}

      {/* Área Scrolleable de Filtros */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {/* Rango de Precio */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Presupuesto</h4>
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
              <span className="text-[8px] block font-black text-muted-foreground uppercase mb-0.5">Mín</span>
              <span className="text-xs font-bold text-foreground">${priceRange[0].toLocaleString()}</span>
            </div>
            <div className="flex-1 bg-muted/30 p-2.5 rounded-xl border border-black/[0.02] text-right">
              <span className="text-[8px] block font-black text-muted-foreground uppercase mb-0.5">Máx</span>
              <span className="text-xs font-bold text-foreground">${priceRange[1].toLocaleString()}{priceRange[1] === 200000 ? '+' : ''}</span>
            </div>
          </div>
        </div>

        {/* Acordeones de Selección */}
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
                      checked={localPets.includes(pet)}
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
                      checked={localCats.includes(cat)}
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
                      checked={localBrands.includes(brand)}
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

      {/* Estado de Carga Sutil */}
      {isPending && (
        <div className="px-6 py-2 bg-secondary/10 flex items-center justify-center gap-2">
          <div className="w-1 h-1 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1 h-1 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1 h-1 bg-secondary rounded-full animate-bounce" />
          <span className="text-[8px] font-black uppercase text-primary/60 tracking-widest">Actualizando catálogo</span>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-6 bg-muted/30 border-t border-black/[0.03] space-y-4 shrink-0">
        <div className="flex items-center gap-2 text-primary/40">
          <Sparkles className="w-3 h-3" />
          <p className="text-[8px] font-black uppercase tracking-widest leading-tight">
            Navegación inteligente asistida <br /> para tu mascota.
          </p>
        </div>
      </div>
    </div>
  );
}
