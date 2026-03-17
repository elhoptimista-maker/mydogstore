"use client";

import Link from 'next/link';
import { ShoppingBag, Search, Menu, User, Dog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 py-2 md:px-8",
      scrolled ? "glass h-14" : "bg-transparent h-16"
    )}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden text-primary">
            <Menu className="w-5 h-5" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary p-1.5 rounded-lg">
              <Dog className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary tracking-tight hidden sm:block">
              My<span className="text-accent">dog</span>Store
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm text-primary/80">
          <Link href="/productos" className="hover:text-primary transition-colors">Catálogo</Link>
          <Link href="/favoritos" className="hover:text-primary transition-colors">Favoritos</Link>
          <Link href="/nosotros" className="hover:text-primary transition-colors">Nosotros</Link>
        </nav>

        <div className="flex items-center gap-1 md:gap-3">
          <Button variant="ghost" size="icon" className="text-primary">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex text-primary">
            <User className="w-5 h-5" />
          </Button>
          <Button variant="default" size="icon" className="relative bg-primary hover:bg-primary/90 rounded-full h-9 w-9">
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-background">
              0
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}