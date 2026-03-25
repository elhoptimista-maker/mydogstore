
"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { X, Filter, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  petTypes: string[];
}

export default function FilterSidebar({ categories, brands, petTypes }: FilterSidebarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPets, setSelectedPets] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);

  useEffect(() => {
    const cats = searchParams.get('categoria')?.split(',') || [];
    const marcas = searchParams.get('marca')?.split(',') || [];
    const pets = searchParams.get('especie')?.split(',') || [];
    const min = parseInt(searchParams.get('minPrice') || '0');
    const max = parseInt(searchParams.get('maxPrice') || '200000');

    setSelectedCats(cats);
    setSelectedBrands(marcas);
    setSelectedPets(pets);
    setPriceRange([min, max]);
  }, [searchParams]);

  const updateUrl = (key: string, values: string[] | number[]) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    if (key === 'price' && Array.isArray(values) && typeof values[0] === 'number') {
      params.set('minPrice', values[0].toString());
      params.set('maxPrice', values[1].toString());
    } else if (values.length > 0) {
      params.set(key, (values as string[]).join(','));
    } else {
      params.delete(key);
    }

    router.push(`/catalogo?${params.toString()}`, { scroll: false });
  };

  const handleToggle = (list: string[], setList: (l: string[]) => void, key: string, value: string) => {
    const newList = list.includes(value) 
      ? list.filter(item => item !== value) 
      : [...list, value];
    setList(newList);
    updateUrl(key, newList);
  };

  const clearAll = () => {
    router.push('/catalogo');
  };

  const hasActiveFilters = selectedCats.length > 0 || selectedBrands.length > 0 || selectedPets.length > 0 || priceRange[0] > 0 || priceRange[1] < 200000;

  return (
    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-black/5 border border-black/[0.03] overflow-hidden sticky top-48 flex flex-col max-h-[calc(100vh-200px)]">
      {/* 1. Header Fijo */}
      <div className="p-6 border-b border-black/[0.03] flex items-center justify-between bg-primary/5 shrink-0">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Filtros Avanzados</span>
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

      {/* 2. Área Scrolleable */}
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
            onValueCommit={(val) => updateUrl('price', val)}
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

        {/* Acordeones */}
        <Accordion type="multiple" defaultValue={["especies", "categoria"]} className="w-full">
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
                      onCheckedChange={() => handleToggle(selectedPets, setSelectedPets, 'especie', pet)}
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
                      onCheckedChange={() => handleToggle(selectedCats, setSelectedCats, 'categoria', cat)}
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
                      onCheckedChange={() => handleToggle(selectedBrands, setSelectedBrands, 'marca', brand)}
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

      {/* 3. Footer Fijo */}
      <div className="p-6 bg-muted/30 border-t border-black/[0.03] space-y-4 shrink-0">
        <div className="flex items-center gap-2 text-primary/40">
          <Sparkles className="w-3 h-3" />
          <p className="text-[8px] font-black uppercase tracking-widest leading-tight">
            Los resultados se actualizan <br /> automáticamente
          </p>
        </div>
      </div>
    </div>
  );
}
