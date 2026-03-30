"use client";

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { getBundleRecommendation } from '@/actions/bundling';
import { SanitizedProduct } from '@/types/product';
import { Plus, Sparkles, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

/**
 * @fileOverview Componente sutil de venta cruzada para el carrito lateral.
 * Diseñado para compras de impulso de productos complementarios.
 */
export default function PredictiveBundle() {
  const { cart, addToCart } = useCart();
  const [recommendation, setRecommendation] = useState<SanitizedProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      setLoading(true);
      try {
        const result = await getBundleRecommendation(cart);
        setRecommendation(result);
      } catch (error) {
        console.error("Error fetching bundle", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [cart]);

  if (loading || !recommendation) return null;

  const handleAdd = () => {
    setIsAdding(true);
    
    // Simulación de feedback visual antes de añadir
    setTimeout(() => {
      addToCart(recommendation, false, 1, false);
      
      toast({
        title: "¡Añadido al carrito! ✨",
        description: `${recommendation.name} se agregó a tu pedido.`,
      });
      setIsAdding(false);
    }, 400);
  };

  return (
    <div className="mx-6 mt-2 mb-6 p-4 rounded-[2rem] bg-slate-50 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
        <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Los clientes también llevan</h4>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-black/5 shadow-sm">
        <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-slate-50 border border-black/5 shrink-0 p-1">
           <Image 
             src={recommendation.main_image} 
             alt={recommendation.name} 
             fill 
             className="object-contain" 
             sizes="48px"
           />
        </div>
        
        <div className="flex flex-col flex-1 min-w-0">
          <span className="text-[11px] font-bold text-slate-800 line-clamp-1">{recommendation.name}</span>
          <span className="text-xs font-black text-primary">
            ${recommendation.sellingPrice.toLocaleString('es-CL')}
          </span>
        </div>

        <Button 
          onClick={handleAdd} 
          disabled={isAdding}
          size="sm"
          className="shrink-0 h-9 px-4 bg-primary/5 hover:bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest rounded-xl transition-all border border-primary/10"
        >
          {isAdding ? <Loader2 className="w-3 h-3 animate-spin" /> : (
            <><Plus className="w-3 h-3 mr-1.5" /> Agregar</>
          )}
        </Button>
      </div>
    </div>
  );
}
