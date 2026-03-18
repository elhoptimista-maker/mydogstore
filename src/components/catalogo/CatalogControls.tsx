
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

export default function CatalogControls({ totalCount }: { totalCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    if (key !== 'page') params.set('page', '1');
    router.push(`/catalogo?${params.toString()}`, { scroll: false });
  };

  return (
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
              <FilterSidebar categories={CATEGORIES} brands={BRANDS} petTypes={PET_TYPES} />
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
          {totalCount} productos
        </span>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest hidden sm:inline">Ver:</span>
          <Select 
            defaultValue={searchParams.get('limit') || "25"} 
            onValueChange={(val) => updateParam('limit', val)}
          >
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

        <Select 
          defaultValue={searchParams.get('sort') || "default"}
          onValueChange={(val) => updateParam('sort', val)}
        >
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
  );
}
