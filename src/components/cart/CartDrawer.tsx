
"use client";

import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, Package, ShieldCheck, Truck } from 'lucide-react';
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
        className="w-full sm:max-w-md flex flex-col p-0 border-none shadow-2xl bg-background overflow-hidden rounded-l-[2rem]"
      >
        {/* Cabecera Corporativa */}
        <SheetHeader className="p-6 bg-primary text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <ShoppingCart className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex flex-col items-start">
                <SheetTitle className="text-white text-xl font-black tracking-tight leading-none">
                  Mi Orden
                </SheetTitle>
                <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">
                  {cartCount} Ítems seleccionados
                </span>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* Listado de Productos Optimizado */}
        <div className="flex-1 overflow-hidden bg-muted/5">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-24 space-y-4">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-border/50">
                    <Package className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground">Carrito vacío</h3>
                    <p className="text-xs text-muted-foreground max-w-[180px] leading-relaxed">
                      Agregue productos para comenzar su gestión de compra.
                    </p>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id + (item.isSubscription ? '-sub' : '')} 
                    className="flex gap-4 items-start pb-6 border-b border-border/50 last:border-0"
                  >
                    {/* Imagen con Aspect Ratio Fijo */}
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0 border border-border/30 shadow-sm">
                      <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>

                    {/* Información y Controles */}
                    <div className="flex-1 min-w-0 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm leading-tight text-foreground line-clamp-2">
                            {item.name}
                          </h4>
                          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                            {item.brand}
                          </span>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted-foreground/40 hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {item.isSubscription && (
                        <Badge className="bg-primary/10 text-primary text-[9px] font-black border-none hover:bg-primary/20">
                          AHORRO SUSCRIPCIÓN (-10%)
                        </Badge>
                      )}

                      <div className="flex items-center justify-between">
                        {/* Selector de Cantidad Estilizado */}
                        <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-border/60 shadow-sm">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-all disabled:opacity-20"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted transition-all"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-black text-primary text-base tracking-tighter">
                          ${((item.isSubscription ? item.price * 0.9 : item.price) * item.quantity).toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Footer con Jerarquía y Legibilidad Corregida */}
        {cart.length > 0 && (
          <div className="p-6 md:p-8 bg-white border-t border-border/50 shrink-0 shadow-[0_-15px_30px_rgba(0,0,0,0.03)]">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Subtotal Neto</span>
                <span className="font-bold text-foreground">
                  ${(cartTotal / 1.19).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium text-sm">Despacho</span>
                  <Badge variant="outline" className="text-[9px] font-black bg-primary/5 text-primary border-primary/20 uppercase tracking-tighter px-2">
                    <Truck className="w-3 h-3 mr-1" /> Sujeto a Zona
                  </Badge>
                </div>
                <span className="font-black text-primary text-xs tracking-widest">GRATIS*</span>
              </div>
              
              <Separator className="bg-border/40" />
              
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Total Final</span>
                  <span className="text-3xl font-black text-primary tracking-tighter leading-none">
                    ${cartTotal.toLocaleString('es-CL')}
                  </span>
                </div>
                {/* Badge con legibilidad mejorada: texto oscuro sobre fondo muy claro */}
                <Badge className="bg-muted text-foreground/80 hover:bg-muted/80 border-none font-bold text-[10px] px-3 py-1 rounded-full">
                  IVA INCLUIDO
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/15 hover:scale-[1.01] active:scale-[0.98] transition-all">
                Finalizar Compra
              </Button>
              <div className="flex items-center justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Transacción Segura Webpay Plus</span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
