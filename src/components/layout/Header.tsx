"use client";

import Link from 'next/link';
import { 
  ShoppingCart, 
  Menu, 
  Dog, 
  Heart, 
  ChevronDown, 
  User, 
  Instagram,
  MessageCircle,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import CartDrawer from '@/components/cart/CartDrawer';
import SmartSearch from './SmartSearch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CATEGORIES } from '@/lib/mock-db';

export default function Header() {
  const { cartCount, cartType } = useCart();
  const { wishlist } = useWishlist();

  const whatsappNumber = "56912345678";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  const mainNav = [
    { label: 'Home', href: '/' },
    { label: 'Tienda', href: '/catalogo' },
    { label: 'Ofertas', href: '/catalogo' },
    { label: 'Blog', href: '#' },
    { label: 'Mayoristas', href: '/b2b' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-sm">
      {/* 1. Top Bar - Utilidad y Contacto */}
      <div className="h-10 bg-accent text-accent-foreground flex items-center px-4 md:px-8 text-[10px] font-bold uppercase tracking-widest border-b border-black/5">
        <div className="max-w-7xl mx-auto w-full flex justify-center items-center relative">
          <div className="flex items-center gap-2">
            <span>Envíos gratis sobre $50.000 🚚</span>
          </div>
          
          <div className="absolute right-0 flex items-center gap-4">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a href="https://www.instagram.com/mydog_distribuidora" target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity flex items-center gap-1.5">
              <Instagram className="w-4 h-4" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header - Identidad y Acciones */}
      <div className="h-20 bg-primary text-white flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-6 md:gap-12">
          
          {/* Logo Corporativo (Visibilidad completa en todos los dispositivos) */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
              <Dog className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex flex-col -space-y-1">
              <span className="font-black text-lg md:text-2xl tracking-tighter leading-none uppercase">MyDog</span>
              <span className="text-[7px] md:text-[9px] font-bold text-white/60 uppercase tracking-[0.2em]">Distribuidora</span>
            </div>
          </Link>

          {/* Buscador Inteligente (Escritorio) */}
          <div className="flex-1 hidden md:flex max-w-2xl">
            <SmartSearch variant="desktop" />
          </div>

          {/* Acciones de Usuario y Carrito */}
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
                        <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 group-hover:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* 3. Menu Bar - Navegación Pro y Buscador Móvil */}
      <div className="h-14 bg-primary border-t border-white/10 flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-full">
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center justify-between w-full h-full">
            <div className="flex items-center gap-8 h-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-secondary text-primary h-10 px-6 items-center gap-3 cursor-pointer hover:bg-secondary/90 transition-all font-bold text-[10px] uppercase tracking-[0.15em] rounded-full shrink-0 outline-none self-center shadow-md flex">
                    <Menu className="w-4 h-4" />
                    Todas las Categorías
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64 rounded-2xl border-none shadow-2xl p-2 mt-2 bg-white animate-in slide-in-from-top-2 duration-300">
                  {CATEGORIES.map((category) => (
                    <DropdownMenuItem key={category} asChild>
                      <Link href={`/catalogo?categoria=${encodeURIComponent(category)}`} className="cursor-pointer font-bold text-xs uppercase tracking-widest p-3 rounded-xl hover:bg-primary/5 hover:text-primary flex items-center justify-between group">
                        {category}
                        <ChevronDown className="w-3 h-3 -rotate-90 opacity-0 group-hover:opacity-40 transition-all" />
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <nav className="flex items-center gap-8">
                {mainNav.map((item) => (
                  <Link key={item.label} href={item.href} className="text-[11px] font-bold text-white/80 hover:text-white uppercase tracking-widest transition-all relative group">
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-secondary transition-all group-hover:w-full"></span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-8">
              <Link href="/cuenta" className="flex items-center gap-2 text-[11px] font-bold text-white hover:text-secondary uppercase tracking-widest transition-all">
                <User className="w-4 h-4" /> Mi Cuenta
              </Link>
              <Link href="/b2b/portal" className="flex items-center gap-2 text-[11px] font-bold text-secondary hover:text-secondary/80 uppercase tracking-widest transition-all">
                <Building2 className="w-4 h-4" /> Portal B2B
              </Link>
            </div>
          </div>

          {/* Buscador Inteligente (Móvil) - Ahora con la misma lógica que desktop */}
          <div className="flex md:hidden flex-1">
            <SmartSearch variant="mobile" />
          </div>

        </div>
      </div>
    </header>
  );
}
