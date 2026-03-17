"use client";

import Link from 'next/link';
import { ShoppingCart, Menu, Dog, Search, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { cartCount } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300">
      {/* Promo Bar - Solid Background, high visibility */}
      <div className="bg-primary py-2 px-4 text-center relative z-20">
        <p className="text-[10px] md:text-xs font-bold text-white uppercase tracking-widest flex items-center justify-center gap-2">
          <span className="animate-bounce">🚚</span> DESPACHO GRATIS POR COMPRAS SOBRE $50.000 EN SANTIAGO
        </p>
      </div>

      {/* Main Header */}
      <div className={cn(
        "bg-white transition-all duration-500 px-4 md:px-8 border-b border-black/[0.03]",
        scrolled ? "h-16 shadow-lg" : "h-20"
      )}>
        <div className="max-w-7xl mx-auto h-full flex items-center gap-4 md:gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Dog className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="hidden sm:flex flex-col -space-y-1">
              <span className="font-black text-xl md:text-2xl text-primary tracking-tighter leading-none">
                MyDog
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                Distribuidora
              </span>
            </div>
          </Link>

          {/* Navigation - Center */}
          <nav className="hidden lg:flex items-center gap-10">
            {[
              { label: 'Inicio', href: '/' },
              { label: 'Catálogo', href: '/catalogo' },
              { label: 'Mayoristas', href: '/b2b' },
              { label: 'Nosotros', href: '#' },
            ].map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className="text-sm font-bold text-foreground/70 hover:text-primary transition-colors tracking-tight"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search & Actions */}
          <div className="flex-1 flex items-center justify-end gap-2 md:gap-6">
            <div className="hidden md:flex flex-1 max-w-md relative group">
              <div className="relative flex items-center bg-muted rounded-full w-full overflow-hidden focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/20 transition-all border border-transparent focus-within:border-primary/10">
                <input 
                  type="text" 
                  placeholder="¿Qué necesita tu mascota hoy?" 
                  className="w-full h-10 px-5 text-sm font-medium bg-transparent outline-none"
                />
                <button className="h-full px-4 text-muted-foreground hover:text-primary">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-1 md:gap-3">
              <Button variant="ghost" size="icon" className="md:hidden text-primary">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hidden sm:flex text-primary hover:bg-primary/5 rounded-full">
                <User className="w-5 h-5" />
              </Button>
              
              <CartDrawer>
                <button className="relative p-2.5 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  <ShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-secondary text-primary font-black text-[9px] min-w-[1.2rem] h-[1.2rem] flex items-center justify-center border-2 border-white rounded-full">
                      {cartCount}
                    </Badge>
                  )}
                </button>
              </CartDrawer>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Header - Categorías */}
      <div className={cn(
        "hidden md:block transition-all duration-300",
        scrolled ? "h-0 overflow-hidden opacity-0" : "h-10 bg-white/80 backdrop-blur-md border-b border-black/[0.02]"
      )}>
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <div className="flex items-center gap-8 h-full">
            <div className="h-full flex items-center gap-2 cursor-pointer group text-primary font-bold text-xs uppercase tracking-widest border-r border-black/[0.05] pr-8">
              <Menu className="w-4 h-4" />
              Categorías
              <ChevronDown className="w-3 h-3 transition-transform group-hover:rotate-180" />
            </div>
            <div className="flex items-center gap-6">
              {['Alimento Seco', 'Higiene', 'Snacks', 'Accesorios', 'Ofertas'].map(cat => (
                <Link key={cat} href={`/catalogo?cat=${cat}`} className="text-[10px] font-bold text-muted-foreground hover:text-primary uppercase tracking-wider transition-colors">
                  {cat}
                </Link>
              ))}
            </div>
          </div>
          <div className="text-[10px] font-black text-secondary uppercase tracking-widest animate-pulse">
            🔥 Ofertas de la semana
          </div>
        </div>
      </div>
    </header>
  );
}
