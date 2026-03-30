
"use client";

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { getBundleRecommendation } from '@/actions/bundling';
import { SanitizedProduct } from '@/types/product';
import { Plus, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PredictiveCrossSellProps {
  baseProduct: SanitizedProduct;
}

/**
 * @fileOverview Componente de Cross-selling optimizado para responsividad extrema.
 * Maneja el apilado en móviles y la expansión en desktop.
 */
export default function PredictiveCrossSell({ baseProduct }: PredictiveCrossSellProps) {
  const { cart, addToCart } = useCart();
  const [recommendation, setRecommendation] = useState<SanitizedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
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
    
    setTimeout(() => {
      addToCart(recommendation, false, 1, false);
      
      toast({
        title: "¡Excelente! ✨",
        description: `${recommendation.name} se agregó a tu pedido.`,
      });
      setIsAdding(false);
    }, 400);
  };

  if (loading && !recommendation) {
    return (
      <div className="h-24 w-full bg-muted/30 animate-pulse rounded-[2rem] border border-dashed border-black/5" />
    );
  }

  if (!recommendation) return null;

  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#F9FAFB] border border-black/[0.03] p-5 md:p-6 transition-all duration-500 hover:shadow-xl hover:shadow-black/5 hover:border-primary/20 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2">
          <div className="bg-amber-100 p-1.5 rounded-xl shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-current" />
          </div>
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] leading-none">Complemento Sugerido</h4>
        </div>
        <Link href={`/catalogo/${recommendation.slug}`} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1.5">
          Ver Ficha <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-5 bg-white p-4 rounded-3xl border border-black/[0.02] shadow-sm relative z-10">
        <div className="relative w-20 h-20 sm:w-16 sm:h-16 bg-[#F9FAFB] rounded-2xl overflow-hidden shrink-0 border border-black/[0.03] p-2">
           <Image 
             src={recommendation.main_image} 
             alt={recommendation.name} 
             fill 
             className="object-contain" 
             sizes="80px"
           />
        </div>
        
        <div className="flex-1 min-w-0 text-center sm:text-left space-y-1">
          <h5 className="text-[11px] md:text-xs font-bold text-slate-800 line-clamp-2 leading-tight">{recommendation.name}</h5>
          <div className="flex items-center justify-center sm:justify-start gap-3">
            <span className="text-base font-black text-primary tracking-tight">
              ${recommendation.sellingPrice.toLocaleString('es-CL')}
            </span>
            <Badge variant="outline" className="text-[8px] font-black text-muted-foreground uppercase h-4 px-1.5 opacity-60">En Stock</Badge>
          </div>
        </div>

        <Button 
          onClick={handleAdd} 
          disabled={isAdding}
          className="w-full sm:w-auto h-12 px-8 bg-primary text-white font-black text-[10px] uppercase tracking-widest rounded-2xl shadow-lg shadow-primary/10 hover:scale-105 active:scale-95 transition-all gap-2"
        >
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          Agregar
        </Button>
      </div>
      
      {/* Visual background glow */}
      <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-700" />
    </div>
  );
}
