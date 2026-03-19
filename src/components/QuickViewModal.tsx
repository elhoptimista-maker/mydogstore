"use client";

import Image from 'next/image';
import { SanitizedProduct } from '@/types/product';
import { 
  Dialog, 
  DialogContent, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, ShoppingCart, Scale, Dog, Briefcase, Heart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface QuickViewModalProps {
  product: SanitizedProduct;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!open) {
      setQuantity(1);
    }
  }, [open]);

  const handleAddToCart = () => {
    addToCart(product, false, quantity);
    toast({
      title: "¡Añadido al carrito!",
      description: `${quantity}x ${product.name}`,
      className: "bg-primary text-white rounded-2xl border-none font-bold shadow-2xl",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white gap-0"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Columna Izquierda: Visual */}
          <div className="relative aspect-square bg-muted/20 flex items-center justify-center p-12 overflow-hidden">
            <div className="absolute top-6 left-6 z-10">
              <Badge className="bg-white/80 backdrop-blur-md text-primary border-none rounded-full px-4 py-1.5 text-[9px] font-black uppercase tracking-widest shadow-sm">
                Vista Rápida
              </Badge>
            </div>
            
            <Image
              src={product.main_image}
              alt={product.name}
              fill
              className="object-contain p-12 transition-transform duration-500 hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Columna Derecha: Información y Acción */}
          <div className="p-8 md:p-12 flex flex-col justify-center space-y-8 bg-white relative">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-white border-none text-[9px] font-black uppercase tracking-widest rounded-full px-3 py-1">
                  {product.brand}
                </Badge>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{product.category}</span>
              </div>

              <DialogTitle className="text-2xl md:text-3xl font-black text-foreground tracking-tighter leading-[1.1]">
                {product.name}
              </DialogTitle>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-primary tracking-tighter">
                    ${product.sellingPrice.toLocaleString('es-CL')}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">IVA Incl.</span>
                </div>
                <div className="flex items-center gap-1 text-secondary bg-secondary/10 px-3 py-1 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="text-xs font-black text-primary">4.8</span>
                </div>
              </div>
            </div>

            {/* Atributos Técnicos */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Scale className="w-3.5 h-3.5" />, label: "Peso", val: `${product.weight_kg}kg` },
                { icon: <Dog className="w-3.5 h-3.5" />, label: "Etapa", val: product.life_stage },
                { icon: <Briefcase className="w-3.5 h-3.5" />, label: "Especie", val: product.species }
              ].map((attr, i) => (
                <div key={i} className="bg-muted/40 p-3 rounded-2xl border border-black/[0.02] space-y-1">
                  <div className="text-primary opacity-60">
                    {attr.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter leading-none mb-0.5">{attr.label}</span>
                    <p className="font-bold text-[11px] text-foreground leading-none truncate">{attr.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 font-medium">
              {product.short_description}
            </p>

            {/* Controles de Compra */}
            <div className="space-y-5 pt-2">
              <div className="flex items-center justify-between bg-muted/30 p-2 rounded-2xl border border-black/[0.03]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4">Cantidad</span>
                <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    type="button"
                    className="h-9 w-9 rounded-lg hover:bg-muted transition-all"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-black text-lg w-10 text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    type="button"
                    className="h-9 w-9 rounded-lg hover:bg-muted transition-all"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={handleAddToCart}
                  type="button"
                  className="flex-1 h-16 rounded-3xl bg-primary text-white font-black text-lg gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <ShoppingCart className="w-6 h-6" /> Añadir al Carrito
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  type="button"
                  className="h-16 w-16 rounded-3xl border-secondary text-secondary hover:bg-secondary/5 transition-colors"
                >
                  <Heart className="w-6 h-6" />
                </Button>
              </div>
            </div>
            
            <p className="text-center text-[9px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40">
              🔒 Transacción Protegida por MyDog Store
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}