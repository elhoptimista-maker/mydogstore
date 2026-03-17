"use client";

import Link from 'next/link';
import { ShoppingCart, Bell, Menu, Dog, Search, User } from 'lucide-react';
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
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4",
      scrolled ? "h-16 bg-white/80 backdrop-blur-md shadow-sm" : "h-20 bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Dog className="text-white w-6 h-6" />
          </div>
          <Link href="/" className="font-extrabold text-2xl tracking-tighter text-foreground hidden sm:block">
            My<span className="text-primary">dog</span><span className="text-secondary">Store</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-sm text-foreground/80">
          <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
          <Link href="/productos" className="hover:text-primary transition-colors">Catálogo</Link>
          <Link href="#" className="hover:text-primary transition-colors">Suscripción</Link>
          <Link href="#" className="hover:text-primary transition-colors">Ofertas</Link>
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-1 sm:gap-3">
          <div className="hidden lg:flex items-center bg-white/50 rounded-full px-4 py-2 border border-border/50 focus-within:ring-2 focus-within:ring-primary transition-all">
            <Search className="w-4 h-4 text-muted mr-2" />
            <input 
              type="text" 
              placeholder="Buscar..." 
              className="bg-transparent border-none outline-none text-sm w-32 focus:w-48 transition-all font-medium"
            />
          </div>
          
          <Button variant="ghost" size="icon" className="rounded-2xl relative hover:bg-primary/10">
            <Bell className="w-6 h-6 text-foreground" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
          </Button>
          
          <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-primary/10">
            <User className="w-6 h-6 text-foreground hidden sm:flex" />
          </Button>

          <Link href="#">
            <Button className="rounded-2xl bg-primary hover:bg-primary/90 shadow-md shadow-primary/10 flex gap-2 font-bold px-4 h-11 transition-transform active:scale-95">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Carrito</span>
            </Button>
          </Link>

          <Button variant="ghost" size="icon" className="md:hidden rounded-2xl">
            <Menu className="w-6 h-6 text-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}
