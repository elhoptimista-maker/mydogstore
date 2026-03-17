
"use client";

import Link from 'next/link';
import { ShoppingBag, Search, Menu, User } from 'lucide-react';
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
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out px-4 py-3 md:px-8",
      scrolled ? "glass h-16" : "bg-transparent h-20"
    )}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-6 h-6" />
          </Button>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-headline font-bold text-primary tracking-tight">
              My<span className="text-accent">dog</span>Store
            </span>
          </Link>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-medium text-sm">
          <Link href="/products" className="hover:text-primary transition-colors">Catálogo</Link>
          <Link href="#" className="hover:text-primary transition-colors">Favoritos</Link>
          <Link href="#" className="hover:text-primary transition-colors">Nosotros</Link>
        </nav>

        <div className="flex items-center gap-1 md:gap-4">
          <Button variant="ghost" size="icon">
            <Search className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <User className="w-5 h-5" />
          </Button>
          <Link href="#">
            <Button variant="default" size="icon" className="relative bg-primary hover:bg-primary/90 rounded-full">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-accent text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
                2
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
