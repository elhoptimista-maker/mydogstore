"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, ChevronDown, User as UserIcon, X, ArrowRight, Sparkles, ShoppingBag, Truck } from 'lucide-react';
import { auth } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth';
import { CATEGORIES, PET_TYPES } from '@/lib/mock-db';
import TopBar from './header/TopBar';
import HeaderLogo from './header/HeaderLogo';
import NavActions from './header/NavActions';
import SmartSearch from './SmartSearch';
import Image from 'next/image';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Orquestador del Header Global con Mega Menú Desktop.
 */
export default function Header() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Cerrar mega menú al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMegaMenuOpen(false);
      }
    }
    if (megaMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [megaMenuOpen]);

  const mainNav = [
    { label: 'Inicio', href: '/' },
    { label: 'La Tiendita', href: '/catalogo' },
    { label: 'Ofertas de Bodega', href: '/catalogo?sort=price-asc' },
    { label: 'Zona Mayorista', href: '/b2b' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full shadow-sm" ref={menuRef}>
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
      <div className="h-14 bg-primary border-t border-white/10 flex items-center px-4 md:px-8 relative">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-full">
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between w-full h-full">
            <div className="flex items-center gap-8 h-full">
              {/* Botón Gatillo del Mega Menú */}
              <button 
                onClick={() => setMegaMenuOpen(!megaMenuOpen)}
                className={cn(
                  "h-10 px-6 flex items-center gap-3 transition-all font-bold text-[10px] uppercase tracking-[0.15em] rounded-full shrink-0 outline-none self-center",
                  megaMenuOpen ? "bg-white text-primary" : "bg-white/10 text-white hover:bg-white/20"
                )}
              >
                {megaMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                Catálogo Completo
              </button>

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
              <Link href="/cuenta" className="flex items-center gap-2 text-[11px] font-bold text-white hover:text-white/80 uppercase tracking-widest transition-all">
                <UserIcon className="w-4 h-4" /> 
                {currentUser ? (currentUser.displayName || 'Mi Perfil') : 'Mi Espacio MyDog'}
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="flex md:hidden flex-1">
            <SmartSearch variant="mobile" />
          </div>
        </div>

        {/* MEGA MENÚ DESKTOP */}
        {megaMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-black/5 animate-in slide-in-from-top-2 duration-300 overflow-hidden hidden md:block">
            <div className="max-w-7xl mx-auto grid grid-cols-12 gap-12 p-12">
              
              {/* Columna 1: Especies */}
              <div className="col-span-3 space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Selecciona a tu compañero
                </h4>
                <ul className="space-y-3">
                  {PET_TYPES.map((pet) => (
                    <li key={pet}>
                      <Link 
                        href={`/catalogo?especie=${encodeURIComponent(pet)}`}
                        onClick={() => setMegaMenuOpen(false)}
                        className="text-sm font-bold text-muted-foreground hover:text-primary transition-all flex items-center justify-between group"
                      >
                        {pet}
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Columna 2: Categorías Populares */}
              <div className="col-span-3 space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Todo para su bienestar
                </h4>
                <div className="grid grid-cols-1 gap-x-8 gap-y-3">
                  {CATEGORIES.slice(0, 8).map((cat) => (
                    <Link 
                      key={cat} 
                      href={`/catalogo?categoria=${encodeURIComponent(cat)}`}
                      onClick={() => setMegaMenuOpen(false)}
                      className="text-sm font-bold text-muted-foreground hover:text-primary transition-all flex items-center justify-between group"
                    >
                      {cat}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Columna 3: Zona Mayorista y Servicios */}
              <div className="col-span-2 space-y-8">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                    Portal Socios
                  </h4>
                  <ul className="space-y-3">
                    <li>
                      <Link href="/b2b" onClick={() => setMegaMenuOpen(false)} className="text-sm font-bold text-muted-foreground hover:text-primary transition-all flex items-center gap-2">
                        <Truck className="w-4 h-4" /> Distribución RM
                      </Link>
                    </li>
                    <li>
                      <Link href="/b2b/portal" onClick={() => setMegaMenuOpen(false)} className="text-sm font-bold text-muted-foreground hover:text-primary transition-all flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4" /> Pedidos B2B
                      </Link>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-primary/5 p-4 rounded-2xl space-y-2">
                   <p className="text-[9px] font-black uppercase tracking-widest text-primary opacity-60">Asesoría Directa</p>
                   <p className="text-[11px] font-bold text-primary">+56 9 5788 9012</p>
                </div>
              </div>

              {/* Columna 4: Banner Promocional Destacado */}
              <div className="col-span-4">
                <div className="relative h-full min-h-[280px] rounded-[2rem] overflow-hidden group bg-muted/30">
                  <Image 
                    src="https://picsum.photos/seed/mega-promo/800/600" 
                    alt="Oferta Especial MyDog" 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    data-ai-hint="happy dog"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
                    <div className="inline-flex items-center gap-2 bg-secondary text-primary px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                      <Sparkles className="w-3 h-3 fill-current" /> Súper Oferta
                    </div>
                    <h5 className="text-2xl font-black text-white leading-tight">
                      Nutrición Clínica <br /> con 25% de Descuento
                    </h5>
                    <Link 
                      href="/catalogo?categoria=Farmacia"
                      onClick={() => setMegaMenuOpen(false)}
                      className="inline-flex items-center gap-2 text-white font-black text-[10px] uppercase tracking-widest group/link"
                    >
                      Ver productos <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
            
            {/* Footer del Mega Menú */}
            <div className="bg-[#F9FAFB] border-t border-black/5 p-6 text-center">
               <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.4em]">
                 Distribuidora MyDog - 15 años cuidando a tu mascota en Santiago
               </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
