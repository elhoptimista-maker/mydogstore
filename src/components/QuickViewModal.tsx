
"use client";

import Image from 'next/image';
import { Product } from '@/lib/mock-db';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Star, ShoppingCart, Scale, Dog, Briefcase, Heart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

interface QuickViewModalProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuickViewModal({ product, open, onOpenChange }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Reseteamos la cantidad cada vez que el modal se cierra
  useEffect(() => {
    if (!open) {
      setQuantity(1);
    }
  }, [open]);

  const handleAddToCart = () => {
    addToCart(product, false, quantity);
    toast({
      title: "¡Añadido al carrito!",
      description: `${quantity}x ${product.metadata.name}`,
      className: "bg-primary text-white rounded-2xl border-none font-bold shadow-2xl",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl p-0 overflow-hidden rounded-[2.5rem] border-none"
        onPointerDownOutside={(e) => {
          // Evitamos que el modal se cierre si el usuario hace clic muy rápido justo después de abrirlo
          // Esto previene el error de "abre y cierra" en condiciones de lag o eventos rápidos.
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Image Section */}
          <div className="relative aspect-square bg-[#fdfdfd] p-12">
            <Image
              src={product.media.main_image}
              alt={product.metadata.name}
              fill
              className="object-contain p-8"
              data-ai-hint={product.media.imageHint}
            />
          </div>

          {/* Info Section */}
          <div className="p-8 md:p-12 flex flex-col justify-center space-y-6 bg-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="px-3 py-1 bg-primary text-white border-none text-[9px] font-black uppercase tracking-widest rounded-full">
                  {product.attributes.brand}
                </Badge>
                <div className="flex items-center gap-1 text-secondary">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-black text-foreground">4.8</span>
                </div>
              </div>

              <DialogTitle className="text-2xl md:text-3xl font-black text-foreground tracking-tighter leading-tight">
                {product.metadata.name}
              </DialogTitle>

              <div className="text-3xl font-black text-primary tracking-tighter">
                ${product.financials.pricing.base_price.toLocaleString('es-CL')}
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
              {product.content.short_description}
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: <Scale className="w-3 h-3" />, label: "Peso", val: `${product.attributes.weight_kg}kg` },
                { icon: <Dog className="w-3 h-3" />, label: "Etapa", val: product.attributes.life_stage },
                { icon: <Briefcase className="w-3 h-3" />, label: "Formato", val: product.attributes.format }
              ].map((attr, i) => (
                <div key={i} className="bg-muted/30 p-2 rounded-xl text-center space-y-1">
                  <div className="flex items-center justify-center gap-1 text-primary">
                    {attr.icon}
                  </div>
                  <p className="font-black text-[10px] uppercase truncate">{attr.val}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-4">
              {/* Selector de Cantidad */}
              <div className="flex items-center justify-between bg-muted/30 p-3 rounded-2xl border border-black/[0.03]">
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Cantidad</span>
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    type="button"
                    className="h-8 w-8 rounded-lg hover:bg-white transition-all shadow-sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-black text-lg w-6 text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    type="button"
                    className="h-8 w-8 rounded-lg hover:bg-white transition-all shadow-sm"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleAddToCart}
                  type="button"
                  className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-base gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
                >
                  <ShoppingCart className="w-5 h-5" /> Añadir al Carrito
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  type="button"
                  className="h-14 w-14 rounded-2xl border-secondary text-secondary hover:bg-secondary/5"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
