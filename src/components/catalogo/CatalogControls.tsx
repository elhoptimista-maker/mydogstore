
"use client";

import { Button } from '@/components/ui/button';
import { Filter, LayoutGrid, List } from 'lucide-react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import FilterSidebar from './FilterSidebar';
import { CATEGORIES, PET_TYPES, BRANDS } from '@/lib/mock-db';
import { cn } from '@/lib/utils';

export default function CatalogControls({ totalCount }: { totalCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'grid';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== 'page') params.set('page', '1');
    router.push(`/catalogo?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="bg-white p-4 md:p-5 rounded-[2rem] shadow-sm border border-black/[0.03] flex flex-col lg:flex-row items-center justify-between gap-4">
      {/* Sección Izquierda: Filtros, Vista y Contador */}
      <div className="flex items-center justify-between lg:justify-start gap-4 w-full lg:w-auto">
        <div className="flex items-center gap-3">
          {/* Trigger de Filtros (Solo Móvil) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="lg:hidden rounded-full bg-primary text-white hover:bg-primary/90 px-5 font-black text-[10px] uppercase h-10 gap-2 shadow-lg shadow-primary/20">
                <Filter className="w-3.5 h-3.5" /> Filtros
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:max-w-md p-0 overflow-y-auto bg-[#F6F6F6]">
              <SheetHeader className="p-8 bg-primary text-white sticky top-0 z-10">
                <SheetTitle className="text-white font-black text-2xl tracking-tighter leading-none">FILTRAR</SheetTitle>
              </SheetHeader>
              <div className="p-8 pb-20">
                <FilterSidebar categories={CATEGORIES} brands={BRANDS} petTypes={PET_TYPES} />
              </div>
            </SheetContent>
          </Sheet>

          {/* Switcher de Vista (Visible siempre) */}
          <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => updateParam('view', 'grid')}
              className={cn(
                "rounded-lg w-8 h-8 transition-all",
                currentView === 'grid' ? "bg-white shadow-sm text-primary" : "text-muted-foreground/60 hover:text-primary"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => updateParam('view', 'list')}
              className={cn(
                "rounded-lg w-8 h-8 transition-all",
                currentView === 'list' ? "bg-white shadow-sm text-primary" : "text-muted-foreground/60 hover:text-primary"
              )}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Contador de resultados */}
        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest whitespace-nowrap bg-muted/20 px-3 py-2 rounded-lg lg:ml-4">
          {totalCount} productos
        </span>
      </div>
      
      {/* Sección Derecha: Selectores de Orden y Cantidad */}
      <div className="flex items-center gap-2 w-full lg:w-auto">
        <div className="flex-1 lg:flex-none">
          <Select 
            defaultValue={searchParams.get('limit') || "25"} 
            onValueChange={(val) => updateParam('limit', val)}
          >
            <SelectTrigger className="w-full lg:w-24 rounded-xl border-none bg-muted/30 focus:ring-primary/20 h-10 font-black text-[10px] uppercase">
              <span className="mr-1 text-muted-foreground/60">Ver:</span>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="25" className="font-bold text-[10px]">25</SelectItem>
              <SelectItem value="50" className="font-bold text-[10px]">50</SelectItem>
              <SelectItem value="100" className="font-bold text-[10px]">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-[2] lg:flex-none">
          <Select 
            defaultValue={searchParams.get('sort') || "default"}
            onValueChange={(val) => updateParam('sort', val)}
          >
            <SelectTrigger className="w-full lg:w-48 rounded-xl border-none bg-muted/30 focus:ring-primary/20 h-10 font-black text-[10px] uppercase tracking-widest text-left">
              <SelectValue placeholder="ORDENAR" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-none shadow-2xl">
              <SelectItem value="default" className="font-bold text-[10px] uppercase tracking-widest">Relevancia</SelectItem>
              <SelectItem value="price-asc" className="font-bold text-[10px] uppercase tracking-widest">Menor Precio</SelectItem>
              <SelectItem value="price-desc" className="font-bold text-[10px] uppercase tracking-widest">Mayor Precio</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
