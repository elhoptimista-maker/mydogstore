"use client";

import Image from 'next/image';
import { SanitizedProduct } from '@/types/product';
import { 
  Dialog, 
  DialogContent, 
  DialogTrigger,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Scale, Dog, Briefcase, Plus, Minus, X as CloseIcon, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface QuickViewModalProps {
  product: SanitizedProduct;
  children: React.ReactNode;
}

export default function QuickViewModal({ product, children }: QuickViewModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product, false, quantity);
    toast({
      title: "¡Añadido al carrito!",
      description: `${quantity}x ${product.name}`,
    });
    setOpen(false);
  };

  const handleGoToDetail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(false);
    window.location.href = `/catalogo/${product.slug || product.id}`;
  };

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
        <button onClick={() => setOpen(false)} className="absolute top-4 right-4 z-50 w-8 h-8 rounded-full bg-black/5 hover:bg-black/10 transition-colors flex items-center justify-center">
          <CloseIcon className="w-4 h-4" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Columna Izquierda: Visual */}
          <div className="relative aspect-square bg-muted/20 flex items-center justify-center p-12 overflow-hidden">
            <Image
              src={product.main_image}
              alt={product.name}
              fill
              className="object-contain p-12 transition-transform duration-500 hover:scale-110"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Columna Derecha: Información y Acción */}
          <div className="p-8 md:p-12 flex flex-col justify-center space-y-6 bg-white relative">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge className="bg-primary text-white border-none text-[9px] font-black uppercase tracking-widest rounded-full px-3 py-1">
                  {product.brand}
                </Badge>
              </div>

              <DialogTitle className="text-2xl md:text-3xl font-black text-foreground tracking-tighter leading-[1.1]">
                {product.name}
              </DialogTitle>
              
              <DialogDescription className="text-sm text-muted-foreground line-clamp-2">
                {product.short_description}
              </DialogDescription>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-primary tracking-tighter">
                    ${product.sellingPrice.toLocaleString('es-CL')}
                  </span>
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

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between bg-muted/30 p-2 rounded-2xl border border-black/[0.03]">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-4">Cantidad</span>
                <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-sm">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1}><Minus className="w-4 h-4" /></Button>
                  <span className="font-black text-lg w-10 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}><Plus className="w-4 h-4" /></Button>
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
                  onClick={handleGoToDetail}
                  type="button"
                  variant="outline" 
                  size="icon" 
                  className="h-16 w-16 rounded-3xl border-primary/20 text-primary hover:bg-primary/5 hover:text-primary transition-colors"
                >
                   <ArrowRight className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
