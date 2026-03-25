"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { X, Filter, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAssistedFilters } from '@/hooks/use-assisted-filters';

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  petTypes: string[];
}

/**
 * @fileOverview Sidebar de filtros puramente presentacional.
 * Delega toda la lógica de estado y enrutamiento al hook useAssistedFilters (SRP).
 */
export default function FilterSidebar({ categories, brands, petTypes }: FilterSidebarProps) {
  const {
    isPending,
    localPets,
    localCats,
    localBrands,
    priceRange,
    setPriceRange,
    openSections,
    setOpenSections,
    handleToggle,
    updatePriceUrl,
    clearAll,
    activeFilters,
    hasPriceFilter
  } = useAssistedFilters();

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/5 border border-black/[0.03] overflow-hidden sticky top-48 flex flex-col max-h-[calc(100vh-200px)]">
      {/* Header Fijo */}
      <div className="p-6 border-b border-black/[0.03] flex items-center justify-between bg-primary/5 shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Filtros Técnicos</span>
        </div>
        {(activeFilters.length > 0 || hasPriceFilter) && (
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

      {/* Tags de Filtros Activos (Feedback instantáneo) */}
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

        {/* Acordeones de Selección Asistida */}
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
