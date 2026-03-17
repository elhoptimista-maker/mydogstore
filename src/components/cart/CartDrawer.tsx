
"use client";

import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, Package, X } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CartDrawer({ children }: { children: React.ReactNode }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 rounded-l-[2rem] border-none shadow-2xl overflow-hidden bg-white">
        {/* Header con diseño premium */}
        <SheetHeader className="p-6 bg-primary text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <SheetTitle className="text-white text-xl font-black tracking-tight">Mi Carrito</SheetTitle>
            </div>
            <Badge className="bg-secondary text-foreground font-black rounded-full px-3 py-1">
              {cartCount} {cartCount === 1 ? 'ítem' : 'ítems'}
            </Badge>
          </div>
        </SheetHeader>

        {/* Área de productos con ScrollArea para mejor UX en desktop */}
        <div className="flex-1 min-h-0">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 space-y-4 opacity-40">
                  <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center">
                    <Package className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-lg text-foreground">Tu carrito está vacío</p>
                    <p className="text-sm text-muted-foreground">¡Aún no has agregado productos!</p>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id + (item.isSubscription ? '-sub' : '')} className="flex gap-4 group items-start">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-sm border border-border/50">
                      <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm leading-tight text-foreground line-clamp-2">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted/40 hover:text-destructive transition-colors p-1"
                          aria-label="Eliminar ítem"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      {item.isSubscription && (
                        <Badge variant="secondary" className="bg-primary/5 text-primary text-[9px] font-black uppercase py-0 px-2 rounded-md">
                          Suscripción (-10%)
                        </Badge>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-2 py-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="p-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-black w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-primary text-sm">
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

        {/* Footer con Resumen de Compra y Botón de Acción */}
        {cart.length > 0 && (
          <SheetFooter className="p-6 bg-muted/30 border-t border-border shrink-0 sm:flex-col gap-0">
            <div className="w-full space-y-3 mb-6">
              <div className="flex justify-between items-center text-muted-foreground font-medium text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">${cartTotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium text-sm">Envío</span>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[10px] font-black uppercase tracking-widest px-2 py-0">
                  Gratis
                </Badge>
              </div>
              <Separator className="bg-border/60" />
              <div className="flex justify-between items-end pt-1">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Final</span>
                  <span className="text-2xl font-black text-primary tracking-tighter">
                    ${cartTotal.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </div>
            <Button className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform active:scale-95">
              Continuar al Pago
            </Button>
            <p className="text-[10px] text-center text-muted-foreground mt-4 font-medium">
              Transacciones seguras procesadas por Webpay Plus
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
