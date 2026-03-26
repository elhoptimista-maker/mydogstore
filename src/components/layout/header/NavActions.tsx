"use client";

import Link from 'next/link';
import { Heart, ShoppingCart, Menu, Dog } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import CartDrawer from '@/components/cart/CartDrawer';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CATEGORIES } from '@/lib/mock-db';

/**
 * @fileOverview Componente que agrupa las acciones de conversión del usuario.
 */
export default function NavActions() {
  const { cartCount, cartType } = useCart();
  const { wishlist } = useWishlist();

  const mainNav = [
    { label: 'Home', href: '/' },
    { label: 'Tienda', href: '/catalogo' },
    { label: 'Ofertas', href: '/catalogo' },
    { label: 'Blog', href: '#' },
    { label: 'Mayoristas', href: '/b2b' },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
      {/* Wishlist */}
      <Link href="/wishlist" className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all group">
        <Heart className={cn("w-4 h-4 sm:w-5 sm:h-5", wishlist.length > 0 && "fill-current text-secondary")} />
        {wishlist.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-secondary text-primary font-black text-[8px] sm:text-[10px] w-4 border-2 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-primary rounded-full">
            {wishlist.length}
          </span>
        )}
      </Link>

      {/* Carrito */}
      <CartDrawer>
        <button className={cn(
          "relative w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all",
          cartType === 'wholesale' ? "bg-secondary text-primary" : "bg-white text-primary"
        )}>
          <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground font-black text-[8px] sm:text-[10px] w-4 border-2 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-primary rounded-full animate-in zoom-in">
              {cartCount}
            </span>
          )}
        </button>
      </CartDrawer>

      {/* Menú Burger (Mobile Only) */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="md:hidden text-white hover:bg-white/10 p-2 rounded-xl transition-colors">
            <Menu className="w-7 h-7" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[85%] sm:max-w-md p-0 border-none bg-background overflow-hidden flex flex-col">
          <SheetHeader className="p-8 bg-primary text-white shrink-0">
            <div className="flex items-center gap-3 mb-2">
              <Dog className="w-8 h-8 text-secondary" />
              <SheetTitle className="text-white font-black text-2xl tracking-tighter text-left uppercase leading-none">Menú MyDog</SheetTitle>
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F6F6F6]">
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Explorar</span>
              {mainNav.map((item) => (
                <Link key={item.label} href={item.href} className="flex items-center p-4 bg-white rounded-2xl border border-black/5 shadow-sm font-black text-xs uppercase tracking-widest text-foreground">
                  {item.label}
                </Link>
              ))}
            </div>
            <div className="space-y-3">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Categorías Técnicas</span>
              {CATEGORIES.map((category) => (
                <Link key={category} href={`/catalogo?categoria=${encodeURIComponent(category)}`} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:border-primary/20 transition-all group">
                  <span className="font-black text-xs uppercase tracking-widest text-foreground group-hover:text-primary">{category}</span>
                  <ShoppingCart className="w-4 h-4 text-muted-foreground -rotate-90 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
