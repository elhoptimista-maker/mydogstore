/**
 * @fileOverview Componente de Resumen de Orden en el Checkout.
 * Actualizado para manejar costos de envío nulos (pendientes de calcular)
 * y asegurar la reactividad del total final.
 */
"use client";

import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Ticket, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function OrderSummary({ shippingCost }: { shippingCost: number | null }) {
  const { cart, cartTotal, cartType, coupon, applyCoupon, removeCoupon, discountAmount } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  // Subtotal bruto de los productos
  const subtotal = useMemo(() => 
    cart.reduce((acc, item) => acc + (item.priceAtAddition * item.quantity), 0),
    [cart]
  );

  // El total final es reactivo a los cambios en el prop shippingCost
  const displayTotal = cartTotal + (shippingCost || 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplying(true);
    const success = await applyCoupon(couponCode);
    if (success) {
      toast({ title: "¡Cupón aplicado!" });
      setCouponCode("");
    } else {
      toast({ variant: "destructive", title: "Cupón inválido" });
    }
    setIsApplying(false);
  };

  return (
    <Card className="rounded-[2.5rem] border-none shadow-xl bg-white sticky top-28">
      <CardHeader className="p-8 pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-black uppercase tracking-tighter">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <ShoppingCart className="w-5 h-5" />
          </div>
          Tu Pedido {cartType === 'wholesale' && <span className="text-secondary">(B2B)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 pt-0 space-y-6">
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 no-scrollbar">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-16 h-16 bg-muted/30 rounded-2xl overflow-hidden shrink-0 border border-black/5">
                <Image src={item.main_image} alt={item.name} fill className="object-contain p-2" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold truncate">{item.name}</h4>
                <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mt-1">
                  {item.quantity} x ${item.priceAtAddition.toLocaleString('es-CL')}
                </p>
              </div>
              <div className="text-sm font-black text-primary shrink-0 self-center">
                ${(item.priceAtAddition * item.quantity).toLocaleString('es-CL')}
              </div>
            </div>
          ))}
        </div>

        <Separator className="bg-black/5" />

        <div className="space-y-3">
          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Código de descuento</Label>
          {!coupon ? (
            <div className="flex gap-2">
              <Input 
                placeholder="CÓDIGO" 
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="h-11 rounded-xl border-black/5 bg-muted/30 font-black uppercase text-xs" 
              />
              <Button 
                onClick={handleApplyCoupon}
                disabled={isApplying || !couponCode}
                className="h-11 rounded-xl bg-primary text-white font-black text-[10px] uppercase px-4"
              >
                {isApplying ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aplicar"}
              </Button>
            </div>
          ) : (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 flex items-center justify-between">
               <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-primary" />
                  <p className="text-[10px] font-black uppercase">{coupon.code}</p>
               </div>
               <button onClick={removeCoupon} className="p-1 hover:bg-primary/10 rounded-full text-primary">
                  <X className="w-4 h-4" />
               </button>
            </div>
          )}
        </div>

        <Separator className="bg-black/5" />

        <div className="space-y-3">
          <div className="flex justify-between text-sm font-bold text-muted-foreground">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString('es-CL')}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm font-bold text-primary">
              <span>Descuento</span>
              <span>-${discountAmount.toLocaleString('es-CL')}</span>
            </div>
          )}
          <div className="flex justify-between text-sm font-bold text-muted-foreground">
            <span>Envío</span>
            <span className={cn(shippingCost === 0 && "text-green-600")}>
              {shippingCost === null 
                ? 'Por calcular' 
                : shippingCost === 0 
                  ? 'Gratis' 
                  : `$${shippingCost.toLocaleString('es-CL')}`}
            </span>
          </div>
          <Separator className="bg-black/5 my-4" />
          <div className="flex justify-between items-end">
            <span className="text-sm font-black uppercase tracking-widest">Total</span>
            <div className="text-right">
              <span className="block text-3xl font-black text-primary tracking-tighter">
                ${displayTotal.toLocaleString('es-CL')}
              </span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase">
                {cartType === 'wholesale' ? '+ IVA' : 'IVA Incluido'}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
