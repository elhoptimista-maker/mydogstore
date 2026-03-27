"use client";

import { useEffect, useState } from 'react';
import { useCart } from '@/context/CartContext';
import { getUpgradeRecommendation } from '@/actions/nudge';
import { SanitizedProduct } from '@/types/product';
import { HeartPulse, ArrowRight, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

/**
 * @fileOverview Componente de "Nudge Marketing" para el carrito.
 * Implementa el "Frontend Honesto": evalúa peso, precio absoluto y precio por kilo.
 */
export default function HealthySwitch() {
  const { cart, removeFromCart, addToCart } = useCart();
  const [recommendation, setRecommendation] = useState<{ originalItem: any, upgradeProduct: SanitizedProduct } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  useEffect(() => {
    const fetchRecommendation = async () => {
      if (cart.length === 0) {
        setRecommendation(null);
        return;
      }
      
      setLoading(true);
      try {
        const result = await getUpgradeRecommendation(cart);
        setRecommendation(result);
      } catch (error) {
        console.error("Error fetching healthy switch", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [cart]);

  if (loading || !recommendation) return null;

  const { originalItem, upgradeProduct } = recommendation;
  
  // CÁLCULOS DE TRANSPARENCIA: Diferencia absoluta vs Precio por Kilo
  const priceDifference = upgradeProduct.sellingPrice - originalItem.priceAtAddition;
  
  const originalWeight = originalItem.weight_kg || 1;
  const upgradeWeight = upgradeProduct.weight_kg || 1;
  const originalPPKG = originalItem.priceAtAddition / originalWeight;
  const upgradePPKG = upgradeProduct.sellingPrice / upgradeWeight;

  // Lógica inteligente para el descriptor comercial
  let tagText = "";
  if (priceDifference > 0) {
    tagText = `POR SOLO $${priceDifference.toLocaleString('es-CL')} MÁS EN EL TOTAL`;
  } else {
    if (upgradePPKG <= originalPPKG) {
      tagText = "¡MEJOR PRECIO Y CALIDAD!";
    } else {
      tagText = "¡EXCELENTE ALTERNATIVA PREMIUM!";
    }
  }

  const handleSwitch = () => {
    setIsSwitching(true);
    
    // Simulación de delay para feedback visual
    setTimeout(() => {
      // Removemos el producto de baja calidad
      removeFromCart(originalItem.id);
      
      // Añadimos el producto premium manteniendo los atributos originales
      addToCart(
        upgradeProduct, 
        originalItem.isSubscription, 
        originalItem.quantity, 
        originalItem.cartType === 'wholesale'
      );
      
      toast({
        title: "¡Excelente elección! 🐾",
        description: `Has mejorado la nutrición de tu mascota cambiando a ${upgradeProduct.brand}.`,
      });
      setIsSwitching(false);
    }, 600);
  };

  return (
    <div className="mx-6 mt-4 mb-6 p-5 rounded-[2rem] bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 shadow-sm relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="absolute top-0 right-0 p-4 opacity-[0.08] text-green-600">
        <HeartPulse className="w-20 h-20" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-green-600 rounded-full flex items-center justify-center text-white">
            <HeartPulse className="w-4 h-4" />
          </div>
          <h4 className="text-[10px] font-black text-green-800 uppercase tracking-widest leading-none">Consejo Nutricional</h4>
        </div>
        
        <p className="text-[11px] font-medium text-green-900/80 mb-4 leading-relaxed">
          Nuestros expertos sugieren cambiar <span className="font-bold text-green-900">{originalItem.brand}</span> por <span className="font-bold text-green-900">{upgradeProduct.brand}</span> para una mejor digestión y vitalidad de tu mascota.
        </p>

        <div className="flex items-center justify-between bg-white/80 p-3 rounded-2xl mb-4 border border-white shadow-inner">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative rounded-xl overflow-hidden bg-white border border-black/[0.03] shrink-0 p-1">
               <Image 
                 src={upgradeProduct.main_image} 
                 alt={upgradeProduct.name} 
                 fill 
                 className="object-contain" 
                 sizes="48px"
               />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-slate-800 truncate">{upgradeProduct.name}</span>
              <span className="text-[9px] font-black text-green-600 uppercase tracking-tight">
                {tagText}
              </span>
            </div>
          </div>
        </div>

        <Button 
          onClick={handleSwitch} 
          disabled={isSwitching}
          className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-black text-[10px] uppercase tracking-widest rounded-xl shadow-lg shadow-green-900/10 transition-all hover:scale-[1.02] active:scale-95"
        >
          {isSwitching ? <Loader2 className="w-4 h-4 animate-spin" /> : (
            <>Hacer el cambio saludable <ArrowRight className="w-4 h-4 ml-2" /></>
          )}
        </Button>
      </div>
    </div>
  );
}
