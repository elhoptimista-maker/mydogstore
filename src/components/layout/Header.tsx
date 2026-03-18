
"use client";

import Link from 'next/link';
import { ShoppingCart, Menu, Dog, Search, Heart, Phone, ChevronDown, User, SearchIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import { Badge } from '@/components/ui/badge';

export default function Header() {
  const { cartCount } = useCart();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-sm">
      {/* 1. Top Bar (Utilidad) - Amarillo Accent */}
      <div className="h-10 bg-accent text-accent-foreground flex justify-between items-center px-4 md:px-8 text-[10px] md:text-xs font-bold uppercase tracking-widest">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span>🚚 Envíos gratis sobre $30.000</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1 cursor-pointer">
              <span>CLP</span>
              <ChevronDown className="w-3 h-3" />
            </div>
            <Link href="#" className="hover:underline">Seguimiento</Link>
            <Link href="#" className="hover:underline">Login</Link>
          </div>
        </div>
      </div>

      {/* 2. Main Header (Búsqueda y Acciones) - Verde Primary */}
      <div className="h-20 bg-primary text-white flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-8 md:gap-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg">
              <Dog className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-2xl tracking-tighter leading-none uppercase">MyDog</span>
              <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.2em]">Distribuidora</span>
            </div>
          </Link>

          {/* Search Pill (Expansivo) */}
          <div className="flex-1 hidden md:flex max-w-2xl relative">
            <div className="relative flex items-center bg-white rounded-full w-full h-12 overflow-hidden">
              <div className="flex items-center px-5 border-r border-black/5 cursor-pointer hover:bg-black/5 transition-colors h-full text-foreground">
                <span className="text-xs font-black uppercase tracking-wider mr-2">Todas</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-40" />
              </div>
              <input 
                type="text" 
                placeholder="Busca alimento, snacks o accesorios..." 
                className="flex-1 h-full px-5 text-sm font-medium text-foreground bg-transparent outline-none placeholder:text-muted-foreground/60"
              />
              <button className="h-10 w-10 bg-primary rounded-full mr-1 flex items-center justify-center text-white hover:bg-primary/90 transition-all">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6 shrink-0">
            <div className="hidden lg:flex items-center gap-3">
              <Phone className="w-5 h-5 text-white" />
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-white/60 uppercase">Soporte</span>
                <span className="text-sm font-black tracking-tight">+56 9 1234 5678</span>
              </div>
            </div>
            
            <button className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
              <Heart className="w-5 h-5" />
            </button>

            <CartDrawer>
              <button className="relative w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground font-black text-[10px] w-5 h-5 flex items-center justify-center border-2 border-primary rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>
            </CartDrawer>
          </div>
        </div>
      </div>

      {/* 3. Menu Bar (Navegación) - Gris Claro */}
      <div className="h-12 bg-[#F6F6F6] border-b border-black/5 hidden md:flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-8 h-full">
            <div className="bg-primary text-white h-full px-6 flex items-center gap-3 cursor-pointer hover:bg-primary/95 transition-all font-black text-[11px] uppercase tracking-[0.1em] rounded-t-xl">
              <Menu className="w-4 h-4" />
              Todas las Categorías
            </div>
            <nav className="flex items-center gap-10">
              {['Home', 'Tienda', 'Ofertas', 'Blog'].map((label) => (
                <Link 
                  key={label} 
                  href={label === 'Home' ? '/' : `/${label.toLowerCase()}`}
                  className="text-[11px] font-black text-foreground/70 hover:text-primary uppercase tracking-widest transition-all"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            Soporte Técnico: <span className="text-primary">+56 2 2345 6789</span>
          </div>
        </div>
      </div>
    </header>
  );
}
