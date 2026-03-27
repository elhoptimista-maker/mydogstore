"use client";

import Link from 'next/link';
import { Heart, ShoppingCart, Menu, ChevronRight } from 'lucide-react';
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
import BrandLogo from '../BrandLogo';

/**
 * @fileOverview Acciones de navegación unificadas con contenedor circular para el logo.
 */
export default function NavActions() {
  const { cartCount, cartType } = useCart();
  const { wishlist } = useWishlist();

  const mainNav = [
    { label: 'Inicio', href: '/' },
    { label: 'La Tiendita', href: '/catalogo' },
    { label: 'Ofertas de Bodega', href: '/catalogo?sort=price-asc' },
    { label: 'Zona Mayorista', href: '/b2b' },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-4 md:gap-6 shrink-0">
      <Link href="/wishlist" title="Tus Favoritos" className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all group">
        <Heart className={cn("w-4 h-4 sm:w-5 sm:h-5", wishlist.length > 0 && "fill-current text-secondary")} />
        {wishlist.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-secondary text-primary font-black text-[8px] sm:text-[10px] w-4 border-2 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-primary rounded-full animate-in zoom-in">
            {wishlist.length}
          </span>
        )}
      </Link>

      <CartDrawer>
        <button title="Ir a la Caja" className={cn(
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

      <Sheet>
        <SheetTrigger asChild>
          <button className="md:hidden text-white hover:bg-white/10 p-2 rounded-xl transition-colors">
            <Menu className="w-7 h-7" />
          </button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[85%] sm:max-w-md p-0 border-none bg-background overflow-hidden flex flex-col">
          <SheetHeader className="p-8 bg-primary text-white shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="relative z-10 text-left">
              <BrandLogo variant="mobile" size="lg" />
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#F6F6F6]">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Explorar Catálogo</span>
              <div className="grid grid-cols-1 gap-2">
                {mainNav.map((item) => (
                  <Link 
                    key={item.label} 
                    href={item.href} 
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:border-primary/20 transition-all group"
                  >
                    <span className="font-black text-xs uppercase tracking-widest text-foreground group-hover:text-primary">{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between ml-2">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Oportunidades</span>
                <Link href="/catalogo" className="text-[9px] font-bold text-primary uppercase tracking-widest hover:underline">Ver Todo</Link>
              </div>
              <div className="grid grid-cols-1 gap-2 pb-10">
                {CATEGORIES.map((category) => (
                  <Link 
                    key={category} 
                    href={`/catalogo?categoria=${encodeURIComponent(category)}`} 
                    className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:border-primary/20 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <ShoppingCart className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">{category}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-primary" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 bg-white border-t border-black/5">
            <Link 
              href="/cuenta" 
              className="flex items-center justify-center gap-3 w-full h-14 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              Entrar a Mi Cuenta
            </Link>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
