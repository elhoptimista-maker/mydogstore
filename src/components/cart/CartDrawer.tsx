
"use client";

import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';
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
      <SheetContent className="w-[90%] sm:max-w-md flex flex-col p-0 rounded-l-[2rem] border-none shadow-2xl overflow-hidden bg-white">
        {/* Header con diseño premium */}
        <SheetHeader className="p-5 md:p-6 bg-primary text-white shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <SheetTitle className="text-white text-lg md:text-xl font-black tracking-tight">Mi Carrito</SheetTitle>
            </div>
            <Badge className="bg-secondary text-foreground font-black rounded-full px-2 py-0.5 text-[10px] md:text-xs">
              {cartCount} {cartCount === 1 ? 'ítem' : 'ítems'}
            </Badge>
          </div>
        </SheetHeader>

        {/* Área de productos */}
        <div className="flex-1 min-h-0 bg-[#f9f9f9]">
          <ScrollArea className="h-full">
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-20 space-y-4 opacity-40">
                  <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center">
                    <Package className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-black text-base text-foreground">Carrito vacío</p>
                    <p className="text-xs text-muted-foreground">¡Agrega productos para comenzar!</p>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id + (item.isSubscription ? '-sub' : '')} className="flex gap-3 md:gap-4 group items-start bg-white p-3 rounded-2xl shadow-sm border border-border/20">
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-muted shrink-0 shadow-sm">
                      <Image 
                        src={item.imageUrl} 
                        alt={item.name} 
                        fill 
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1.5 md:space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-xs md:text-sm leading-tight text-foreground line-clamp-2">{item.name}</h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-muted/40 hover:text-destructive transition-colors p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      
                      {item.isSubscription && (
                        <Badge variant="secondary" className="bg-primary/5 text-primary text-[8px] md:text-[9px] font-black uppercase py-0 px-1.5 rounded-md">
                          Suscripción (-10%)
                        </Badge>
                      )}

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-1.5 bg-muted/50 rounded-lg px-1.5 py-0.5">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                            className="p-1 text-muted-foreground hover:text-primary transition-colors disabled:opacity-30"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-[10px] font-black w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                            className="p-1 text-muted-foreground hover:text-primary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="font-black text-primary text-xs md:text-sm">
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

        {/* Footer con Resumen */}
        {cart.length > 0 && (
          <SheetFooter className="p-5 md:p-6 bg-white border-t border-border shrink-0 sm:flex-col gap-0 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
            <div className="w-full space-y-3 mb-4 md:mb-6">
              <div className="flex justify-between items-center text-muted-foreground font-medium text-xs md:text-sm">
                <span>Subtotal</span>
                <span className="font-bold text-foreground">${cartTotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium text-xs md:text-sm">Envío</span>
                <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 text-[9px] font-black uppercase tracking-widest px-1.5 py-0">
                  Gratis
                </Badge>
              </div>
              <Separator className="bg-border/60" />
              <div className="flex justify-between items-end pt-1">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total</span>
                  <span className="text-xl md:text-2xl font-black text-primary tracking-tighter">
                    ${cartTotal.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </div>
            <Button className="w-full h-12 md:h-14 rounded-2xl bg-primary text-white font-black text-base md:text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
              Continuar al Pago
            </Button>
            <p className="text-[9px] text-center text-muted-foreground mt-3 font-medium">
              Transacciones seguras vía Webpay Plus
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
