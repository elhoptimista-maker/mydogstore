"use client";

import Link from 'next/link';
import { Menu, ChevronDown, User, Building2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/mock-db';
import TopBar from './header/TopBar';
import HeaderLogo from './header/HeaderLogo';
import NavActions from './header/NavActions';
import SmartSearch from './SmartSearch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * @fileOverview Orquestador del Header Global.
 * Divide responsabilidades en TopBar, MainHeader y MenuBar siguiendo SRP y CRO.
 */
export default function Header() {
  const mainNav = [
    { label: 'Inicio', href: '/' },
    { label: 'La Tiendita', href: '/catalogo' },
    { label: 'Ofertas de Bodega', href: '/catalogo?sort=price-asc' },
    { label: 'Zona Mayorista', href: '/b2b' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-sm">
      <TopBar />

      {/* Main Header Row */}
      <div className="h-20 bg-primary text-white flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-6 md:gap-12">
          <HeaderLogo />
          
          <div className="flex-1 hidden md:flex max-w-2xl">
            <SmartSearch variant="desktop" />
          </div>

          <NavActions />
        </div>
      </div>

      {/* Menu Bar Row */}
      <div className="h-14 bg-primary border-t border-white/10 flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-full">
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between w-full h-full">
            <div className="flex items-center gap-8 h-full">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="bg-secondary text-primary h-10 px-6 items-center gap-3 cursor-pointer hover:bg-secondary/90 transition-all font-bold text-[10px] uppercase tracking-[0.15em] rounded-full shrink-0 outline-none self-center shadow-md flex">
                    <Menu className="w-4 h-4" />
                    Catálogo Completo
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
                <User className="w-4 h-4" /> Mi Espacio MyDog
              </Link>
              <Link href="/b2b/portal" className="flex items-center gap-2 text-[11px] font-bold text-secondary hover:text-secondary/80 uppercase tracking-widest transition-all">
                <Building2 className="w-4 h-4" /> Portal B2B
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="flex md:hidden flex-1">
            <SmartSearch variant="mobile" />
          </div>

        </div>
      </div>
    </header>
  );
}
