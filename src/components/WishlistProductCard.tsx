
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Trash2, ShieldCheck, Truck, Bell, BellRing, Info } from 'lucide-react';
import { SanitizedProduct } from '@/types/product';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface WishlistProductCardProps {
  product: SanitizedProduct;
}

/**
 * Componente de tarjeta de producto especializado para la vista de lista en Favoritos.
 * Ahora incluye comportamiento dinámico de stock y avisos de marketing.
 */
export default function WishlistProductCard({ product }: WishlistProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isNotified, toggleNotification } = useWishlist();
  const [loadingNotify, setLoadingLoading] = useState(false);

  const hasStock = product.currentStock > 0;
  const isLowStock = product.currentStock > 0 && product.currentStock < 5;
  const notified = isNotified(product.id);

  const handleNotifyAction = async () => {
    setLoadingLoading(true);
    await toggleNotification(product.id);
    setLoadingLoading(false);
  };

  return (
    <div className="bg-white border border-border/50 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row gap-8 hover:shadow-xl transition-all group relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />

      {/* Image Section */}
      <Link 
        href={`/catalogo/${product.slug || product.id}`} 
        className="relative w-full md:w-56 aspect-square bg-muted/20 rounded-[2rem] overflow-hidden shrink-0 border border-black/[0.03]"
      >
         <Image 
           src={product.main_image} 
           alt={product.name} 
           fill 
           className={cn(
             "object-contain p-6 group-hover:scale-105 transition-transform duration-500",
             !hasStock && "grayscale opacity-60"
           )} 
           sizes="(max-width: 768px) 100vw, 224px"
         />
         {!hasStock ? (
           <Badge className="absolute top-4 left-4 bg-zinc-800 text-white border-none rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest shadow-lg">
             Agotado
           </Badge>
         ) : isLowStock && (
           <Badge className="absolute top-4 left-4 bg-orange-500 text-white border-none rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest shadow-lg animate-pulse">
             ¡Últimas unidades!
           </Badge>
         )}
      </Link>
      
      {/* Info Section */}
      <div className="flex-1 flex flex-col justify-center space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest">
              {product.brand}
            </Badge>
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              {product.category}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter leading-tight hover:text-primary transition-colors">
            <Link href={`/catalogo/${product.slug || product.id}`}>{product.name}</Link>
          </h3>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed max-w-2xl">
          {product.short_description}
        </p>
        
        <div className="flex flex-wrap items-center gap-8">
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Precio Distribución</span>
              <span className="text-3xl font-black text-primary tracking-tighter leading-none">
                ${product.sellingPrice.toLocaleString('es-CL')}
              </span>
           </div>
           <div className="hidden sm:block h-12 w-px bg-border/50" />
           <div className="flex flex-col">
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Disponibilidad</span>
              <div className="flex items-center gap-2">
                 <div className={cn("w-2 h-2 rounded-full", hasStock ? "bg-green-500 animate-pulse" : "bg-destructive")} />
                 <span className={cn("text-[10px] font-black uppercase tracking-widest", hasStock ? "text-green-600" : "text-destructive")}>
                   {hasStock ? `${product.currentStock} unidades en bodega` : 'Sin stock momentáneamente'}
                 </span>
              </div>
           </div>
        </div>

        {!hasStock && (
          <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-left-2">
            <Info className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide leading-relaxed">
              Este producto es de alta rotación. Activa la notificación para asegurar tu unidad en la próxima reposición.
            </p>
          </div>
        )}
      </div>

      {/* Actions Section */}
      <div className="flex flex-row md:flex-col gap-3 justify-center items-stretch md:w-56 md:border-l md:border-black/5 md:pl-8 pt-6 md:pt-0">
         {hasStock ? (
           <Button 
             onClick={() => addToCart(product)} 
             className="flex-1 md:flex-none rounded-2xl h-14 bg-primary text-white font-black text-sm uppercase tracking-widest gap-3 shadow-xl shadow-primary/15 hover:scale-[1.02] active:scale-95 transition-all"
           >
              <ShoppingCart className="w-5 h-5" /> Agregar
           </Button>
         ) : (
           <Button 
             onClick={handleNotifyAction}
             disabled={loadingNotify}
             className={cn(
               "flex-1 md:flex-none rounded-2xl h-14 font-black text-[10px] uppercase tracking-widest gap-3 transition-all",
               notified 
                ? "bg-green-50 text-green-600 border border-green-200" 
                : "bg-secondary text-primary shadow-xl shadow-secondary/20 hover:scale-[1.02] active:scale-95"
             )}
           >
              {notified ? (
                <>
                  <BellRing className="w-4 h-4" /> Suscrito al aviso
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4" /> Avisarme cuando vuelva
                </>
              )}
           </Button>
         )}
         <Button 
           variant="ghost" 
           onClick={() => toggleWishlist(product)} 
           className="flex-1 md:flex-none rounded-2xl h-14 text-red-500 hover:bg-red-50 font-black text-[10px] uppercase tracking-[0.2em] gap-3 transition-colors"
         >
            <Trash2 className="w-4 h-4" /> Eliminar
         </Button>
      </div>
    </div>
  );
}
