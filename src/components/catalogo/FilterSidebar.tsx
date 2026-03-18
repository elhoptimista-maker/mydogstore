
"use client";

import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

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

  // Sincronizar estado local con URL
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
    params.set('page', '1'); // Resetear a pag 1 al filtrar

    if (Array.isArray(values) && typeof values[0] === 'number') {
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

  return (
    <div className="space-y-8">
      {/* Rango de Precio */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/[0.03]">
        <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-primary/60">Presupuesto</h4>
        <Slider 
          value={priceRange} 
          min={0} 
          max={200000} 
          step={5000} 
          onValueChange={setPriceRange}
          onValueCommit={(val) => updateUrl('price', val)}
          className="mb-6" 
        />
        <div className="flex items-center justify-between text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
          <div className="bg-muted/50 px-3 py-1.5 rounded-lg">${priceRange[0].toLocaleString()}</div>
          <div className="bg-muted/50 px-3 py-1.5 rounded-lg">${priceRange[1].toLocaleString()}+</div>
        </div>
      </div>

      {/* Categorías */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/[0.03]">
        <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-primary/60">Categoría</h4>
        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox 
                id={`cat-${cat}`} 
                checked={selectedCats.includes(cat)}
                onCheckedChange={() => handleToggle(selectedCats, setSelectedCats, 'categoria', cat)}
                className="rounded-md border-primary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" 
              />
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
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox 
                id={`brand-${brand}`} 
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => handleToggle(selectedBrands, setSelectedBrands, 'marca', brand)}
                className="rounded-md border-primary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" 
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer tracking-tight">
                {brand}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Especies */}
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-black/[0.03]">
        <h4 className="text-sm font-bold uppercase tracking-[0.2em] mb-8 text-primary/60">Especies</h4>
        <div className="space-y-4">
          {petTypes.map((pet) => (
            <div key={pet} className="flex items-center space-x-3 group cursor-pointer">
              <Checkbox 
                id={`pet-${pet}`} 
                checked={selectedPets.includes(pet)}
                onCheckedChange={() => handleToggle(selectedPets, setSelectedPets, 'especie', pet)}
                className="rounded-md border-primary/20 data-[state=checked]:bg-secondary data-[state=checked]:border-secondary" 
              />
              <Label htmlFor={`pet-${pet}`} className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors cursor-pointer tracking-tight">
                {pet}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
