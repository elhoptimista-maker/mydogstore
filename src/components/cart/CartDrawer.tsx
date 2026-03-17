
"use client";

import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, Plus, Minus, Package } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

export default function CartDrawer({ children }: { children: React.ReactNode }) {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0 rounded-l-[2.5rem] border-none shadow-2xl overflow-hidden">
        <SheetHeader className="p-6 bg-primary text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <SheetTitle className="text-white text-2xl font-bold">Tu Carrito</SheetTitle>
            <Badge className="ml-auto bg-secondary text-foreground font-black rounded-full">
              {cartCount} items
            </Badge>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center">
                <Package className="w-10 h-10" />
              </div>
              <p className="font-bold">Tu carrito está vacío</p>
              <p className="text-sm">¡Tu peludo está esperando algo bakán!</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id + (item.isSubscription ? '-sub' : '')} className="flex gap-4 group">
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-muted shrink-0 shadow-sm border border-border/50">
                  <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-sm leading-tight line-clamp-2">{item.name}</h4>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-muted hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {item.isSubscription && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary text-[10px] font-bold uppercase py-0">
                      Suscripción (-10%)
                    </Badge>
                  )}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2 bg-muted rounded-full px-2 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="hover:text-primary"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="hover:text-primary"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="font-black text-primary">
                      ${((item.isSubscription ? item.price * 0.9 : item.price) * item.quantity).toLocaleString('es-CL')}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <SheetFooter className="p-6 bg-muted/30 border-t border-border mt-auto flex-col">
            <div className="w-full space-y-3 mb-6">
              <div className="flex justify-between text-muted font-medium">
                <span>Subtotal</span>
                <span>${cartTotal.toLocaleString('es-CL')}</span>
              </div>
              <div className="flex justify-between text-green-600 font-bold text-sm">
                <span>Envío</span>
                <span className="uppercase tracking-widest text-[10px]">¡Gratis!</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-black text-primary">
                <span>Total</span>
                <span>${cartTotal.toLocaleString('es-CL')}</span>
              </div>
            </div>
            <Button className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
              Finalizar Compra
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
