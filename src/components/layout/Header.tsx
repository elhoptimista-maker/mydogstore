"use client";

import Link from 'next/link';
import { ShoppingCart, Bell, Menu, Dog, Search, User, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-4",
      scrolled ? "h-16 bg-white/90 backdrop-blur-lg shadow-sm" : "h-20 bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className={cn(
            "w-10 h-10 rounded-2xl flex items-center justify-center transition-all shadow-lg",
            scrolled ? "bg-primary shadow-primary/20" : "bg-white shadow-black/5"
          )}>
            <Dog className={cn("w-6 h-6", scrolled ? "text-white" : "text-primary")} />
          </div>
          <Link href="/" className={cn(
            "font-extrabold text-2xl tracking-tighter hidden sm:block",
            scrolled ? "text-foreground" : "text-white"
          )}>
            My<span className="text-primary">dog</span><span className="text-secondary">Store</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className={cn(
          "hidden lg:flex items-center gap-8 font-bold text-sm",
          scrolled ? "text-foreground/80" : "text-white/90"
        )}>
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <Link href="/productos" className="hover:text-primary transition-colors">Catálogo</Link>
          <Link href="#" className="hover:text-primary transition-colors">Suscripción</Link>
          <Link href="#" className="hover:text-primary transition-colors">Ofertas</Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-3">
          <div className={cn(
            "hidden md:flex items-center rounded-full px-4 py-2 border transition-all focus-within:ring-2 focus-within:ring-primary",
            scrolled ? "bg-white/50 border-border/50" : "bg-white/10 border-white/20"
          )}>
            <Search className={cn("w-4 h-4 mr-2", scrolled ? "text-muted" : "text-white/60")} />
            <input 
              type="text" 
              placeholder="Buscar para tu peludo..." 
              className={cn(
                "bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all font-medium placeholder:font-normal",
                scrolled ? "text-foreground placeholder:text-muted" : "text-white placeholder:text-white/60"
              )}
            />
          </div>
          
          <Button variant="ghost" size="icon" className={cn(
            "rounded-2xl relative hover:bg-primary/10",
            !scrolled && "text-white hover:bg-white/10"
          )}>
            <Heart className="w-6 h-6" />
          </Button>

          <Link href="#">
            <Button className={cn(
              "rounded-2xl shadow-lg flex gap-2 font-bold px-4 h-11 transition-all active:scale-95",
              scrolled ? "bg-primary hover:bg-primary/90 text-white shadow-primary/20" : "bg-white text-primary hover:bg-secondary hover:text-white shadow-black/10"
            )}>
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Carrito</span>
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className={cn(
            "md:hidden rounded-2xl",
            !scrolled && "text-white hover:bg-white/10"
          )}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}