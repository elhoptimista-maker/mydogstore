import { useState, useEffect, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * @fileOverview Custom hook que gestiona la lógica de filtrado asistido, 
 * sincronización con la URL y estados optimistas para el catálogo.
 */
export function useAssistedFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Estados locales para feedback instantáneo (Optimistic UI)
  const [localPets, setLocalPets] = useState<string[]>([]);
  const [localCats, setLocalCats] = useState<string[]>([]);
  const [localBrands, setLocalBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 200000]);

  // Sincronizar estados locales con la URL (útil para navegación atrás/adelante)
  useEffect(() => {
    setLocalPets(searchParams.get('especie')?.split(',').filter(Boolean) || []);
    setLocalCats(searchParams.get('categoria')?.split(',').filter(Boolean) || []);
    setLocalBrands(searchParams.get('marca')?.split(',').filter(Boolean) || []);
    
    const min = parseInt(searchParams.get('minPrice') || '0');
    const max = parseInt(searchParams.get('maxPrice') || '200000');
    setPriceRange([min, max]);
  }, [searchParams]);

  // Lógica de apertura de secciones del acordeón
  const [openSections, setOpenSections] = useState<string[]>(() => {
    if (!searchParams.get('especie')) return ["especies"];
    if (!searchParams.get('categoria')) return ["categoria"];
    return ["marca"];
  });

  const handleToggle = (key: string, value: string) => {
    const updateList = (prev: string[]) => 
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value];

    let nextPets = localPets;
    let nextCats = localCats;
    let nextBrands = localBrands;

    // Actualización inmediata de la UI y lógica asistida
    if (key === 'especie') {
      nextPets = updateList(localPets);
      setLocalPets(nextPets);
      if (nextPets.length > 0 && localCats.length === 0) setOpenSections(["categoria"]);
    } else if (key === 'categoria') {
      nextCats = updateList(localCats);
      setLocalCats(nextCats);
      if (nextCats.length > 0 && localBrands.length === 0) setOpenSections(["marca"]);
    } else if (key === 'marca') {
      nextBrands = updateList(localBrands);
      setLocalBrands(nextBrands);
    }

    // Sincronización diferida con la URL
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

  const activeFilters = [
    ...localPets.map(v => ({ key: 'especie', val: v })),
    ...localCats.map(v => ({ key: 'categoria', val: v })),
    ...localBrands.map(v => ({ key: 'marca', val: v }))
  ];

  const hasPriceFilter = searchParams.has('minPrice');

  return {
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
  };
}
