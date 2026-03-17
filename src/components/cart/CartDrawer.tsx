
"use client";

import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, Package, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export default function CartDrawer({ children }: { children: React.ReactNode }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent 
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 border-none shadow-2xl bg-[#f9f9f9] overflow-hidden rounded-l-[1.5rem] md:rounded-l-[2.5rem]"
      >
        {/* Cabecera Profesional */}
        <SheetHeader className="p-5 md:p-8 bg-primary text-white shrink-0 relative">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-inner">
              <ShoppingCart className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex flex-col items-start">
              <SheetTitle className="text-white text-xl md:text-2xl font-black tracking-tighter leading-none">
                Mi Carrito
              </SheetTitle>
              <span className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-1">
                {cartCount} {cartCount === 1 ? 'Producto' : 'Productos'} seleccionados
              </span>
            </div>
          </div>
        </SheetHeader>

        {/* Listado de Productos */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full px-4 py-6 md:px-8">
            <div className="space-y-4 pb-10">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-24 space-y-6 opacity-60">
                  <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl shadow-black/5 flex items-center justify-center">
                    <Package className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-black text-lg text-foreground tracking-tight">Tu carrito está vacío</h3>
                    <p className="text-sm text-muted-foreground max-w-[200px] mx-auto leading-relaxed">
                      Parece que aún no has agregado productos a tu orden.
                    </p>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id + (item.isSubscription ? '-sub' : '')} 
                    className="group bg-white p-3 md:p-4 rounded-[1.5rem] shadow-sm border border-border/40 transition-all hover:shadow-md flex gap-4 items-center"
                  >
                    {/* Imagen del Producto */}
                    <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-sm border border-border/20">
                      <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                        sizes="(max-width: 768px) 80px, 96px"
                      />
                    </div>

                    {/* Información del Producto */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-1">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-bold text-sm md:text-base leading-tight text-foreground line-clamp-2 pr-2">
                            {item.name}
                          </h4>
                          <button 
                            onClick={() => removeFromCart(item.id)}
                            className="text-muted-foreground/30 hover:text-destructive transition-colors p-1 -mt-1 -mr-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.isSubscription && (
                          <Badge variant="secondary" className="bg-primary/5 text-primary text-[9px] font-black uppercase py-0 px-2 rounded-md border-none">
                            Suscripción Activa (-10%)
                          </Badge>
                        )}
                      </div>

                      {/* Controles de Cantidad y Precio */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1 bg-muted/30 rounded-xl p-1 border border-border/10">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-white hover:text-primary transition-all disabled:opacity-20"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black w-7 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-white hover:text-primary transition-all"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-primary text-sm md:text-lg tracking-tighter">
                            ${((item.isSubscription ? item.price * 0.9 : item.price) * item.quantity).toLocaleString('es-CL')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer con Jerarquía Corregida */}
        {cart.length > 0 && (
          <div className="p-6 md:p-8 bg-white border-t border-border/50 shrink-0 flex flex-col gap-0 shadow-[0_-20px_40px_rgba(0,0,0,0.04)]">
            {/* Desglose de Totales */}
            <div className="w-full space-y-3 mb-6">
              <div className="flex justify-between items-center text-muted-foreground font-medium text-xs md:text-sm">
                <span>Subtotal Estimado</span>
                <span className="font-bold text-foreground tracking-tight">
                  ${cartTotal.toLocaleString('es-CL')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium text-xs md:text-sm">Despacho</span>
                  <Badge variant="outline" className="text-[9px] font-black bg-green-50 text-green-600 border-green-100 uppercase tracking-tighter px-1.5 py-0">
                    Sujeto a Zona
                  </Badge>
                </div>
                <span className="font-black text-green-600 text-xs md:text-sm">GRATIS*</span>
              </div>
              
              <Separator className="bg-border/40 my-2" />
              
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total a Pagar</span>
                  <span className="text-3xl md:text-4xl font-black text-primary tracking-tighter leading-none mt-1">
                    ${cartTotal.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                  IVA Incluido
                </div>
              </div>
            </div>

            {/* Acciones de Pago e Indicadores de Confianza */}
            <div className="space-y-4">
               <p className="text-[10px] text-center text-muted-foreground font-bold flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-green-500" />
                Pago 100% Seguro vía Webpay Plus
              </p>
              
              <Button className="w-full h-14 md:h-16 rounded-[1.5rem] bg-primary text-white font-black text-base md:text-xl shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                Continuar al Pago
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
