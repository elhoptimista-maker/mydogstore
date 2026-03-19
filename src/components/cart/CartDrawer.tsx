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
import { Progress } from '@/components/ui/progress';

export default function CartDrawer({ children }: { children: React.ReactNode }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  
  const FREE_SHIPPING_THRESHOLD = 50000;
  const progress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remaining = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent 
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0 gap-0 border-none shadow-2xl bg-background overflow-hidden rounded-l-[2.5rem] focus:outline-none focus:ring-0"
      >
        {/* Cabecera Teal */}
        <SheetHeader className="px-6 pt-10 pb-6 bg-primary text-white shrink-0 border-none space-y-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <ShoppingCart className="w-6 h-6 text-secondary" />
            </div>
            <div className="flex flex-col items-start text-left">
              <SheetTitle className="text-white text-xl font-black tracking-tight leading-none">
                Mi Carrito
              </SheetTitle>
              <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-1">
                {cartCount} Productos seleccionados
              </span>
            </div>
          </div>
        </SheetHeader>

        {/* Gamificación: El Carrito Hambriento con Emojis SOBRE la barra */}
        {cart.length > 0 && (
          <div className="px-6 py-8 bg-secondary/10 border-b border-black/5">
            <div className="flex justify-between items-end mb-6">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary leading-tight">
                {progress < 100 
                  ? `¡Faltan $${remaining.toLocaleString('es-CL')} para el envío gratis!`
                  : "¡GUAU! ¡ENVÍO GRATIS DESBLOQUEADO! 🦴"
                }
              </span>
              <span className="text-[10px] font-bold text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            
            <div className="relative h-12 flex items-center">
              {/* Barra de progreso base */}
              <Progress value={progress} className="h-4 bg-white/50 border border-white" />
              
              {/* Perrito caminando SOBRE la barra */}
              <div 
                className="absolute transition-all duration-700 ease-out z-10 flex items-center justify-center"
                style={{ 
                  left: `calc(${progress}% - 24px)`,
                  top: '50%',
                  transform: 'translateY(-50%)'
                }}
              >
                <span className="text-4xl animate-bounce leading-none drop-shadow-md">🐶</span>
              </div>

              {/* Hueso meta SOBRE la barra */}
              <div 
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
              >
                <span className={cn(
                  "text-4xl leading-none transition-transform duration-500",
                  progress >= 100 ? "scale-125 rotate-12" : "scale-100 opacity-60"
                )}>
                  🦴
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Listado de Productos */}
        <div className="flex-1 overflow-hidden bg-[#f9f9f9] flex flex-col m-0 p-0 border-none">
          <ScrollArea className="flex-1 h-full">
            <div className="px-6 py-2">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-32 space-y-4">
                  <div className="w-20 h-20 bg-white rounded-3xl shadow-sm flex items-center justify-center border border-border/50">
                    <Package className="w-8 h-8 text-muted-foreground/40" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-bold text-foreground">Carrito vacío</h3>
                    <p className="text-xs text-muted-foreground max-w-[180px] leading-relaxed">
                      Explora nuestro catálogo y añade productos aquí.
                    </p>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 items-start py-6 border-b border-black/[0.03] last:border-0"
                  >
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-white shrink-0 border border-border/30 shadow-sm">
                      <Image 
                        src={item.main_image} 
                        alt={item.name} 
                        fill 
                        className="object-contain p-2"
                        sizes="80px"
                      />
                    </div>

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

                      <div className="flex items-center justify-between">
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
                          ${(item.sellingPrice * item.quantity).toLocaleString('es-CL')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Resumen Final */}
        {cart.length > 0 && (
          <div className="px-6 py-8 md:px-8 bg-white shrink-0 border-none shadow-[0_-20px_50px_rgba(0,0,0,0.1)] relative z-10">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground font-medium">Subtotal</span>
                <span className="font-bold text-foreground">
                  ${(cartTotal / 1.19).toLocaleString('es-CL', { maximumFractionDigits: 0 })}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-medium text-sm">Despacho</span>
                  <Badge variant="outline" className="text-[9px] font-black bg-primary/5 text-primary border-primary/20 uppercase tracking-tighter px-2">
                    <Truck className="w-3 h-3 mr-1" /> {progress >= 100 ? "Gratis" : "Por calcular"}
                  </Badge>
                </div>
                <span className="font-black text-primary text-xs tracking-widest">{progress >= 100 ? "GRATIS" : "-"}</span>
              </div>
              
              <Separator className="bg-border/40" />
              
              <div className="flex justify-between items-end">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-1">Total a Pagar</span>
                  <span className="text-3xl font-black text-primary tracking-tighter leading-none">
                    ${cartTotal.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="text-[10px] font-bold text-primary/60 bg-primary/5 px-3 py-1.5 rounded-lg border border-primary/10">
                  IVA INCLUIDO
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/15 hover:scale-[1.01] active:scale-[0.98] transition-all">
                Pagar Ahora
              </Button>
              <div className="flex items-center justify-center gap-2 opacity-50">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-[9px] font-bold uppercase tracking-widest">Pago Seguro Webpay Plus</span>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
