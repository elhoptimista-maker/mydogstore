
"use client";

import Link from 'next/link';
import { 
  ShoppingCart, 
  Menu, 
  Dog, 
  Search, 
  Heart, 
  Phone, 
  ChevronDown, 
  User, 
  Package,
  Globe,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CATEGORIES } from '@/lib/mock-db';
import { useState } from 'react';

/**
 * @fileOverview Header global de 3 niveles siguiendo la anatomía del PRD.
 * 1. Top Bar: Utilidad y promociones.
 * 2. Main Header: Marca, búsqueda y acciones de usuario.
 * 3. Menu Bar: Navegación principal y categorías.
 */

export default function Header() {
  const { cartCount } = useCart();
  const [searchCategory, setSearchCategory] = useState("Todas");

  const mainNav = [
    { label: 'Home', href: '/' },
    { label: 'Tienda', href: '/catalogo' },
    { label: 'Ofertas', href: '/catalogo' },
    { label: 'Blog', href: '#' },
    { label: 'B2B Mayoristas', href: '/b2b' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-sm">
      {/* 1. Top Bar (Utilidad) */}
      <div className="h-10 bg-accent text-accent-foreground flex items-center px-4 md:px-8 text-[10px] font-bold uppercase tracking-widest border-b border-black/5">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-flex items-center gap-2">
              <Truck className="w-3 h-3" />
              Envíos gratis sobre $50.000
            </span>
            <span className="sm:hidden">🚚 Envío Gratis en Stgo</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-4 border-r border-black/10 pr-4">
              <button className="flex items-center gap-1.5 hover:opacity-70 transition-opacity">
                <Globe className="w-3 h-3" />
                <span>CLP</span>
                <ChevronDown className="w-2.5 h-2.5 opacity-50" />
              </button>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="#" className="hover:opacity-70 transition-opacity">Seguimiento</Link>
              <Link href="#" className="hover:opacity-70 transition-opacity">Login</Link>
            </nav>
          </div>
        </div>
      </div>

      {/* 2. Main Header (Búsqueda y Acciones) */}
      <div className="h-20 bg-primary text-white flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-6 md:gap-12">
          {/* Logo Corporativo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
              <Dog className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-2xl tracking-tighter leading-none uppercase">MyDog</span>
              <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.2em]">Distribuidora</span>
            </div>
          </Link>

          {/* Search Pill - Centro Expansivo */}
          <div className="flex-1 hidden md:flex max-w-2xl">
            <div className="relative flex items-center bg-white rounded-full w-full h-12 overflow-hidden shadow-inner">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center px-5 border-r border-black/5 cursor-pointer hover:bg-black/5 transition-colors h-full text-foreground shrink-0 outline-none">
                    <span className="text-[10px] font-bold uppercase tracking-wider mr-2 whitespace-nowrap">
                      {searchCategory}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 opacity-40" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56 rounded-xl border-none shadow-2xl p-2 bg-white z-[60]">
                  <DropdownMenuItem 
                    onClick={() => setSearchCategory("Todas")}
                    className="cursor-pointer font-bold text-[10px] uppercase tracking-widest p-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                  >
                    Todas
                  </DropdownMenuItem>
                  {CATEGORIES.map((category) => (
                    <DropdownMenuItem 
                      key={category} 
                      onClick={() => setSearchCategory(category)}
                      className="cursor-pointer font-bold text-[10px] uppercase tracking-widest p-3 rounded-lg hover:bg-primary/5 hover:text-primary transition-colors"
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <input 
                type="text" 
                placeholder="Busca alimento, snacks o accesorios..." 
                className="flex-1 h-full px-5 text-sm font-medium text-foreground bg-transparent outline-none placeholder:text-muted-foreground/60"
              />
              <button className="h-10 w-10 bg-primary rounded-full mr-1 flex items-center justify-center text-white hover:bg-primary/90 transition-all shadow-md">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Actions & Contact */}
          <div className="flex items-center gap-4 md:gap-6 shrink-0">
            <div className="hidden lg:flex items-center gap-3 pr-2">
              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-white/60 uppercase leading-none mb-1">WhatsApp</span>
                <span className="text-sm font-black tracking-tight text-white">+56 9 1234 5678</span>
              </div>
            </div>
            
            <button className="relative w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white">
              <Heart className="w-5 h-5" />
            </button>

            <CartDrawer>
              <button className="relative w-12 h-12 bg-white text-primary rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-all">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground font-black text-[10px] w-5 h-5 flex items-center justify-center border-2 border-primary rounded-full animate-in zoom-in">
                    {cartCount}
                  </span>
                )}
              </button>
            </CartDrawer>
            
            <button className="md:hidden text-white">
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Menu Bar (Navegación) */}
      <div className="h-14 bg-[#F8F9FA] border-t border-black/[0.03] flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-full">
          <div className="flex items-center gap-8 h-full">
            {/* Categorías Destacadas */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="bg-primary text-white h-10 px-6 flex items-center gap-3 cursor-pointer hover:bg-primary/90 transition-all font-bold text-[10px] uppercase tracking-[0.15em] rounded-full shrink-0 outline-none self-center shadow-md">
                  <Menu className="w-4 h-4" />
                  Todas las Categorías
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 rounded-2xl border-none shadow-2xl p-2 mt-2 bg-white animate-in slide-in-from-top-2 duration-300">
                {CATEGORIES.map((category) => (
                  <DropdownMenuItem key={category} asChild>
                    <Link 
                      href={`/catalogo?categoria=${encodeURIComponent(category)}`}
                      className="cursor-pointer font-bold text-xs uppercase tracking-widest p-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-between group"
                    >
                      {category}
                      <ChevronDown className="w-3 h-3 -rotate-90 opacity-0 group-hover:opacity-40 transition-all" />
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Enlaces de Navegación */}
            <nav className="hidden md:flex items-center gap-8">
              {mainNav.map((item) => (
                <Link 
                  key={item.label} 
                  href={item.href}
                  className="text-[11px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-all relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Soporte Técnico / Mi Cuenta */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/b2b" className="flex items-center gap-2 text-[11px] font-bold text-primary hover:text-primary/70 uppercase tracking-widest transition-all">
              <Package className="w-4 h-4" />
              Portal B2B
            </Link>
            <Link href="#" className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground hover:text-primary uppercase tracking-widest transition-all">
              <User className="w-4 h-4" />
              Mi Cuenta
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
