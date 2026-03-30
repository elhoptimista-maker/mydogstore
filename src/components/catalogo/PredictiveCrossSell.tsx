
"use client";

import { useEffect, useState, useTransition } from 'react';
import { useCart } from '@/context/CartContext';
import { getBundleRecommendation } from '@/actions/bundling';
import { SanitizedProduct } from '@/types/product';
import { Plus, Sparkles, Loader2, ShoppingCart, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PredictiveCrossSellProps {
  baseProduct: SanitizedProduct;
}

/**
 * @fileOverview Componente de Cross-selling proactivo para la PDP.
 * Es inteligente: no sugiere productos que ya estén en el carrito.
 * Permite agregar el complemento con un solo clic.
 */
export default function PredictiveCrossSell({ baseProduct }: PredictiveCrossSellProps) {
  const { cart, addToCart } = useCart();
  const [recommendation, setRecommendation] = useState<SanitizedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();

  // EFECTO: Buscar recomendación cada vez que cambie el carrito
  // Esto asegura que si el usuario agrega el complemento, este desaparezca o cambie por otro
  useEffect(() => {
    const fetchRecommendation = async () => {
      // Incluimos el producto actual en el análisis para que el motor busque complementos para él,
      // pero el motor de bundling también revisará el resto del carrito.
      const itemsToAnalyze = [...cart, { ...baseProduct, priceAtAddition: baseProduct.sellingPrice }];
      
      try {
        const result = await getBundleRecommendation(itemsToAnalyze);
        setRecommendation(result);
      } catch (error) {
        console.error("Error fetching bundle in PDP", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [cart, baseProduct]);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!recommendation) return;

    setIsAdding(true);
    
    // Simulación de delay para feedback visual
    setTimeout(() => {
      addToCart(recommendation, false, 1, false);
      
      toast({
        title: "¡Añadido al carrito! ✨",
        description: `${recommendation.name} se agregó a tu pedido.`,
      });
      setIsAdding(false);
    }, 400);
  };

  if (loading && !recommendation) {
    return (
      <div className="h-24 w-full bg-slate-50 animate-pulse rounded-2xl border border-dashed border-slate-200" />
    );
  }

  if (!recommendation) return null;

  return (
    <div className="group relative overflow-hidden rounded-[2rem] bg-slate-50 border border-slate-100 p-4 transition-all hover:shadow-lg hover:border-primary/20 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 p-1 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-current" />
          </div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none">Complemento Sugerido</h4>
        </div>
        <Link href={`/catalogo/${recommendation.slug}`} className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
          Ver detalles <ArrowRight className="w-2.5 h-2.5" />
        </Link>
      </div>

      <div className="flex items-center gap-4 bg-white p-3 rounded-2xl border border-black/[0.03] shadow-sm relative z-10">
        <div className="relative w-14 h-14 bg-slate-50 rounded-xl overflow-hidden shrink-0 border border-black/5 p-1.5">
           <Image 
             src={recommendation.main_image} 
             alt={recommendation.name} 
             fill 
             className="object-contain" 
             sizes="56px"
           />
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-tight mb-1">{recommendation.name}</span>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-black text-primary">
              ${recommendation.sellingPrice.toLocaleString('es-CL')}
            </span>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Stock OK</span>
          </div>
        </div>

        <Button 
          onClick={handleAdd} 
          disabled={isAdding}
          size="sm"
          className="shrink-0 h-10 px-4 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-md shadow-primary/10 hover:scale-105 active:scale-95 transition-all gap-2"
        >
          {isAdding ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          Agregar
        </Button>
      </div>
      
      {/* Glow decorativo de fondo */}
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/10 transition-colors" />
    </div>
  );
}
