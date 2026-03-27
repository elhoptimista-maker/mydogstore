"use client";

import { useCart } from '@/context/CartContext';
import { useShippingRates } from '@/hooks/use-shipping-rates';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, Package, Truck, ArrowRight, Store, Sparkles, HeartPulse } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import HealthySwitch from './HealthySwitch';

/**
 * @fileOverview Carrito lateral blindado con validación de stock, gamificación de envío gratis
 * e INNOVACIÓN: "Healthy Switch" integrado.
 */
export default function CartDrawer({ children }: { children: React.ReactNode }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount, cartType, userData } = useCart();
  const { getRateForComuna, isLoading: loadingRates } = useShippingRates();
  const router = useRouter();
  
  // Lógica de Gamificación (Envío Gratis)
  const FREE_SHIPPING_THRESHOLD = 50000;
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0);
  const isFreeShipping = progress >= 100;

  // Resolución de Comuna del usuario
  const userComuna = userData?.addresses?.find((a: any) => a.isDefault)?.commune || userData?.addresses?.[0]?.commune; 
  
  // Cálculo dinámico de despacho basado en datos del ERP
  const baseShippingCost = getRateForComuna(userComuna);
  const actualShippingCost = isFreeShipping ? 0 : baseShippingCost;
  
  const finalTotal = cartTotal + (actualShippingCost || 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent 
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 gap-0 border-none shadow-2xl bg-background overflow-hidden rounded-l-[2.5rem] focus:outline-none focus:ring-0"
      >
        {/* Cabecera con Identidad MyDog */}
        <SheetHeader className="px-6 py-4 bg-primary text-white shrink-0 border-none space-y-0 relative min-h-[80px] flex flex-row items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                <ShoppingCart className="w-5 h-5 text-secondary" />
              </div>
              <div className="flex flex-col items-start text-left">
                <SheetTitle className="text-white text-lg font-black tracking-tight leading-none flex items-center gap-2">
                  Mi Pedido MyDog
                  {cartType === 'wholesale' && (
                    <Badge className="bg-secondary text-primary border-none text-[8px] uppercase font-black px-1.5 py-0 shadow-sm">B2B</Badge>
                  )}
                </SheetTitle>
                <span className="text-white/70 text-[9px] font-bold uppercase tracking-widest mt-1">
                  {cartCount} Productos en camino
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Gamificación: Envío Gratis (Solo Retail) */}
        {cart.length > 0 && cartType === 'retail' && (
          <div className={cn(
            "px-6 py-4 border-b border-black/5 shrink-0 transition-colors duration-500",
            isFreeShipping ? "bg-green-50" : "bg-secondary/10"
          )}>
            <div className="flex justify-between items-center mb-2">
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest leading-tight",
                isFreeShipping ? "text-green-600" : "text-primary"
              )}>
                {!isFreeShipping 
                  ? `Estás a solo $${remaining.toLocaleString('es-CL')} del envío gratis`
                  : "¡ENVÍO GRATIS GANADO! 🚚"
                }
              </span>
              <span className={cn(
                "text-[9px] font-bold",
                isFreeShipping ? "text-green-600" : "text-muted-foreground"
              )}>
                {Math.round(progress)}%
              </span>
            </div>
            <Progress 
              value={progress} 
              className={cn(
                "h-2 border",
                isFreeShipping ? "bg-green-200 border-green-300 [&>div]:bg-green-500" : "bg-white/50 border-white [&>div]:bg-primary"
              )} 
            />
          </div>
        )}

        {/* Listado de Productos con ScrollArea */}
        <div className="flex-1 overflow-hidden bg-[#f9f9f9] relative">
          <ScrollArea className="h-full w-full">
            <div className="px-6 py-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-32 space-y-6">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-border/50">
                    <Package className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-base text-foreground">Tu pedido está vacío</h3>
                    <p className="text-[11px] text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                      Explora nuestro catálogo y empieza a regalonear a tu mascota.
                    </p>
                  </div>
                  <SheetTrigger asChild>
                    <Button 
                      onClick={() => router.push('/catalogo')}
                      className="rounded-2xl font-black uppercase text-[10px] tracking-widest px-8 shadow-md"
                    >
                      <Store className="w-4 h-4 mr-2" /> Ir a vitrinear
                    </Button>
                  </SheetTrigger>
                </div>
              ) : (
                <>
                  <div className="space-y-1 mb-4">
                    {cart.map((item) => {
                      const isMaxStockReached = item.quantity >= (item.currentStock || 99);
                      const itemTotal = item.priceAtAddition * item.quantity;

                      return (
                        <div key={item.id} className="flex gap-3 items-center py-4 border-b border-black/[0.03] last:border-0 group">
                          <button 
                            onClick={() => removeFromCart(item.id)} 
                            aria-label="Eliminar producto"
                            className="text-muted-foreground/30 hover:text-red-500 transition-colors p-1 shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-border/30 shadow-sm">
                            <Image src={item.main_image} alt={item.name} fill className="object-contain p-1.5" sizes="64px" />
                          </div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex flex-col gap-0.5">
                              <h4 className="font-bold text-xs leading-tight text-foreground line-clamp-2">{item.name}</h4>
                              <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-wider">{item.brand}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-border/60 shadow-sm">
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                                  className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-30" 
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="w-2.5 h-2.5" />
                                </button>
                                <span className="text-[10px] font-bold w-5 text-center">{item.quantity}</span>
                                <button 
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                                  className="w-6 h-6 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted disabled:opacity-30"
                                  disabled={isMaxStockReached}
                                >
                                  <Plus className="w-2.5 h-2.5" />
                                </button>
                              </div>
                              
                              <div className="flex flex-col items-end">
                                <span className="font-black text-primary text-sm tracking-tighter">
                                  ${itemTotal.toLocaleString('es-CL')}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  
                  {/* INNOVACIÓN: Healthy Switch Nudge */}
                  <HealthySwitch />
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Resumen Final y CTA de Pago */}
        {cart.length > 0 && (
          <div className="px-6 py-6 bg-white shrink-0 shadow-[0_-15px_40px_rgba(0,0,0,0.08)] relative z-10">
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-medium">Subtotal del pedido</span>
                <span className="font-bold text-foreground">${cartTotal.toLocaleString('es-CL')}</span>
              </div>
              
              {cartType === 'retail' && (
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-medium text-xs">
                      Despacho {userComuna ? `a ${userComuna}` : 'en RM'}
                    </span>
                    <Badge variant="outline" className={cn(
                      "text-[8px] font-black uppercase px-1.5 h-4",
                      isFreeShipping ? "bg-green-50" : "bg-primary/5 text-primary",
                      loadingRates && "animate-pulse"
                    )}>
                      <Truck className="w-2.5 h-2.5 mr-1" /> 
                      {isFreeShipping ? "Gratis" : (actualShippingCost !== null ? "Calculado" : "Por calcular")}
                    </Badge>
                  </div>
                  <span className={cn(
                    "font-black text-[10px] tracking-widest",
                    isFreeShipping ? "text-green-600" : "text-primary"
                  )}>
                    {isFreeShipping ? "GRATIS" : (actualShippingCost !== null ? `$${actualShippingCost.toLocaleString('es-CL')}` : "-")}
                  </span>
                </div>
              )}
              
              <Separator className="bg-border/40" />
              
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-[0.15em] mb-0.5">Total a Pagar</span>
                  <span className="text-2xl font-black text-primary tracking-tighter leading-none">
                    ${finalTotal.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="text-[8px] font-bold text-primary/60 bg-primary/5 px-2 py-1 rounded-md border border-primary/10 uppercase">
                  {cartType === 'wholesale' ? '+ IVA' : 'IVA INCLUIDO'}
                </div>
              </div>
            </div>

            <SheetTrigger asChild>
              <Button 
                onClick={() => router.push('/checkout')} 
                className="w-full h-14 rounded-2xl bg-primary text-white font-black text-base shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-0.98 transition-all flex items-center justify-center gap-2"
              >
                Ir a Pagar Seguro <ArrowRight className="w-5 h-5" />
              </Button>
            </SheetTrigger>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
