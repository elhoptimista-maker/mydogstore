"use client";

import Image from 'next/image';
import { SanitizedProduct } from '@/types/product';
import { MARKET_INTELLIGENCE } from '@/lib/services/ranking.engine';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Scale, Dog, Briefcase, Plus, Minus, X as CloseIcon, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface QuickViewModalProps {
  product: SanitizedProduct;
  children: React.ReactNode;
}

export default function QuickViewModal({ product, children }: QuickViewModalProps) {
  const router = useRouter();
  const { addToCart, cartType } = useCart(); 
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const isOutOfStock = product.currentStock <= 0;
  const maxQuantity = product.currentStock;
  
  const priceToDisplay = cartType === 'wholesale' ? product.wholesalePrice : product.sellingPrice;
  const priceLabel = cartType === 'wholesale' ? 'Precio B2B' : 'Precio Distribución';

  // =====================================================================
  // 🧠 INTELIGENCIA COMERCIAL Y TRANSPARENCIA
  // =====================================================================
  const brandKey = product.brand?.toLowerCase().trim() || '';
  const metrics = MARKET_INTELLIGENCE[brandKey];
  
  // 1. Estrellas Dinámicas (Sentimiento)
  const dynamicRating = metrics ? (metrics.sentiment / 2).toFixed(1) : "4.5";
  const isPremium = metrics && metrics.quality >= 4;

  // 2. Transparencia: Precio por Kilo (PPKG)
  const ppkg = product.weight_kg && product.weight_kg > 0 
    ? Math.round(priceToDisplay / product.weight_kg) 
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, false, quantity);
    
    toast({
      title: "¡Listo! 🐾",
      description: `${quantity}x ${product.name} ya está en tu carrito.`,
    });
    setOpen(false);
    
    setTimeout(() => setQuantity(1), 300);
  };

  const handleGoToDetail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    router.push(`/catalogo/${product.slug || product.id}`);
  };

  const increment = () => setQuantity(prev => (prev < maxQuantity ? prev + 1 : prev));
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}>
        {children}
      </DialogTrigger>
      <DialogContent 
        className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white gap-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={() => setOpen(false)} 
          aria-label="Cerrar vista rápida"
          className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 transition-colors flex items-center justify-center"
        >
          <CloseIcon className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Columna Izquierda: Visual */}
          <div className="relative aspect-square bg-muted/20 flex items-center justify-center p-12 overflow-hidden">
            <Image
              src={product.main_image}
              alt={`Imagen de ${product.name}`}
              fill
              className="object-contain p-12 transition-transform duration-500 hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10">
                <Badge className="bg-zinc-800 text-white border-none text-xs font-black uppercase tracking-widest px-4 py-2">
                  Agotado
                </Badge>
              </div>
            )}
            {/* SELLO PREMIUM EN LA IMAGEN */}
            {isPremium && (
               <div className="absolute top-6 left-6 z-10 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Premium</span>
               </div>
            )}
          </div>

          {/* Columna Derecha: Información y Acción */}
          <div className="p-8 md:p-12 flex flex-col justify-center space-y-6 bg-white relative">
            <div className="space-y-3">
              <div className="flex items-center gap-2 flex-wrap justify-between">
                <Badge className="bg-primary text-white border-none text-[9px] font-black uppercase tracking-widest rounded-full px-3 py-1">
                  {product.brand}
                </Badge>
                
                {/* ESTRELLAS DINÁMICAS */}
                <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded-full">
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-[10px] font-bold text-foreground">{dynamicRating}</span>
                </div>
              </div>

              {product.currentStock > 0 && product.currentStock <= 5 && (
                <Badge className="bg-orange-500 text-white border-none text-[9px] font-black uppercase tracking-widest rounded-full px-3 py-1 animate-pulse shadow-lg shadow-orange-500/20 w-fit">
                  ¡Últimas {product.currentStock} unidades!
                </Badge>
              )}

              <DialogTitle className="text-2xl md:text-3xl font-black text-foreground tracking-tighter leading-[1.1]">
                {product.name}
              </DialogTitle>
              
              <DialogDescription className="text-sm text-muted-foreground line-clamp-2">
                {product.short_description}
              </DialogDescription>

              <div className="flex flex-col pt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                  {priceLabel}
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-black text-primary tracking-tighter">
                    ${priceToDisplay.toLocaleString('es-CL')}
                  </span>
                  {/* TRANSPARENCIA: PRECIO POR KILO */}
                  {ppkg && (
                    <span className="text-xs font-bold text-muted-foreground/60">
                      (${ppkg.toLocaleString('es-CL')}/kg)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Scale className="w-3.5 h-3.5" />, label: "Peso", val: `${product.weight_kg}kg` },
                { icon: <Dog className="w-3.5 h-3.5" />, label: "Etapa", val: product.life_stage },
                { icon: <Briefcase className="w-3.5 h-3.5" />, label: "Especie", val: product.species }
              ].map((attr, i) => (
                <div key={i} className="bg-muted/40 p-3 rounded-2xl border border-black/[0.02] space-y-1">
                  <div className="text-primary opacity-60">{attr.icon}</div>
                  <p className="font-bold text-[11px] text-foreground leading-none truncate">{attr.val}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-2 mt-auto">
              <div className={cn(
                "flex items-center justify-between bg-muted/30 p-2 rounded-2xl border border-black/[0.03] transition-opacity",
                isOutOfStock && "opacity-50 pointer-events-none"
              )}>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4">
                  Cantidad a llevar
                </span>
                <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm">
                  <Button variant="ghost" size="icon" onClick={decrement} disabled={quantity <= 1 || isOutOfStock}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-black text-lg w-10 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={increment} disabled={quantity >= maxQuantity || isOutOfStock}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  type="button"
                  className="flex-1 h-16 rounded-3xl bg-primary text-white font-black text-sm md:text-lg gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                >
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6" /> 
                  {isOutOfStock ? "Sin Stock" : "Agregar al Carrito"}
                </Button>
                
                <Button 
                  onClick={handleGoToDetail}
                  type="button"
                  variant="outline" 
                  aria-label="Ver ficha completa del producto"
                  title="Ver detalles completos"
                  className="h-16 w-16 rounded-3xl border-primary/20 text-primary hover:bg-primary/5 hover:text-primary transition-colors shrink-0"
                >
                   <ArrowRight className="w-6 h-6" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-2 text-muted-foreground pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-primary/60" />
                <span className="text-[9px] font-black uppercase tracking-widest">
                  Compra segura | Despacho a toda la RM
                </span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
