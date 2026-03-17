"use client";

import Link from 'next/link';
import { ShoppingCart, Menu, Dog, Search, Heart, User, Truck, Phone, ChevronDown } from 'lucide-react';
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
      {/* 1. Top Bar (Anuncios y Links menores) */}
      <div className="bg-secondary py-1.5 px-4 text-center">
        <p className="text-[10px] md:text-xs font-black text-foreground uppercase tracking-wider">
          PAGANDO CON TRANSFERENCIA OBTIENES 5% DE DESCUENTO ADICIONAL
        </p>
      </div>

      {/* 2. Main Header (Logo, Search, Actions) */}
      <div className={cn(
        "bg-primary transition-all duration-500 px-4",
        scrolled ? "h-16" : "h-20"
      )}>
        <div className="max-w-7xl mx-auto h-full flex items-center gap-4 md:gap-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 md:w-11 md:h-11 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Dog className="w-6 h-6 md:w-7 md:h-7 text-primary" />
            </div>
            <span className="hidden sm:block font-black text-xl md:text-2xl text-white tracking-tighter">
              My<span className="text-secondary">dog</span>Distribuidora
            </span>
          </Link>

          {/* Search Bar - PRIORIDAD MÁXIMA */}
          <div className="flex-1 max-w-2xl relative group">
            <div className="relative flex items-center bg-white rounded-full overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-secondary transition-all">
              <input 
                type="text" 
                placeholder="Busca marcas, productos o necesidades..." 
                className="w-full h-10 md:h-11 px-5 text-sm font-medium text-foreground bg-transparent outline-none placeholder:text-muted-foreground/60"
              />
              <button className="h-full px-4 text-primary hover:text-secondary transition-colors">
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-1 sm:gap-4">
            <div className="hidden lg:flex items-center gap-4 text-white">
              <Link href="#" className="flex flex-col items-center gap-0.5 group">
                <Truck className="w-5 h-5 group-hover:text-secondary transition-colors" />
                <span className="text-[9px] font-bold uppercase">Rastrear</span>
              </Link>
              <Link href="#" className="flex flex-col items-center gap-0.5 group">
                <User className="w-5 h-5 group-hover:text-secondary transition-colors" />
                <span className="text-[9px] font-bold uppercase">Mi Cuenta</span>
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 rounded-full">
                <Heart className="w-6 h-6" />
              </Button>
              
              <CartDrawer>
                <button className="relative p-2 text-white hover:text-secondary transition-colors">
                  <ShoppingCart className="w-7 h-7" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-secondary text-foreground font-black text-[10px] min-w-[1.2rem] h-[1.2rem] flex items-center justify-center border-2 border-primary rounded-full">
                      {cartCount}
                    </Badge>
                  )}
                </button>
              </CartDrawer>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Navigation Bar (Categorías y Menú) */}
      <div className="hidden md:block bg-white border-b border-black/[0.05] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-11 flex items-center">
          {/* Categorías Dropdown */}
          <div className="h-full border-r border-black/[0.05] pr-6 mr-6 flex items-center gap-2 cursor-pointer group">
            <Menu className="w-5 h-5 text-primary" />
            <span className="font-black text-xs uppercase tracking-widest text-primary">Categorías</span>
            <ChevronDown className="w-4 h-4 text-primary group-hover:rotate-180 transition-transform" />
          </div>

          {/* Menú Principal */}
          <nav className="flex items-center gap-8 h-full">
            {[
              { label: 'Productos', href: '/catalogo' },
              { label: 'Alimentación', href: '/catalogo?cat=Alimento' },
              { label: 'Higiene', href: '/catalogo?cat=Higiene' },
              { label: 'Accesorios', href: '/catalogo?cat=Accesorios' },
              { label: 'Marcas', href: '#' },
              { label: 'Ofertas', href: '#', highlight: true },
            ].map((link) => (
              <Link 
                key={link.label} 
                href={link.href}
                className={cn(
                  "text-[11px] font-black uppercase tracking-widest transition-colors h-full flex items-center border-b-2 border-transparent hover:border-primary",
                  link.highlight ? "text-secondary hover:text-secondary/80" : "text-foreground/70 hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
