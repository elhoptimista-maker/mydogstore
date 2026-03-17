"use client";

import Link from 'next/link';
import { ShoppingCart, Bell, Menu, Dog } from 'lucide-react';
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
      scrolled ? "h-16 bg-white shadow-md" : "h-16 bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Dog className="text-white w-6 h-6" />
          </div>
          <Link href="/" className="font-extrabold text-xl tracking-tighter text-foreground">
            My<span className="text-primary">dog</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-2xl relative">
            <Bell className="w-6 h-6 text-foreground" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-white"></span>
          </Button>
          <Button variant="ghost" size="icon" className="rounded-2xl">
            <ShoppingCart className="w-6 h-6 text-foreground" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-2xl">
            <Menu className="w-6 h-6 text-foreground" />
          </Button>
        </div>
      </div>
    </header>
  );
}