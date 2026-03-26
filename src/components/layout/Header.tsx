"use client";

import Link from 'next/link';
import { 
  ShoppingCart, 
  Menu, 
  Dog, 
  Search, 
  Heart, 
  ChevronDown, 
  User, 
  Package,
  Instagram,
  X,
  MessageCircle,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import CartDrawer from '@/components/cart/CartDrawer';
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
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { fetchAllProducts } from '@/actions/products';
import { SanitizedProduct } from '@/types/product';
import { Badge } from '@/components/ui/badge';

const SEARCH_PLACEHOLDERS = [
  "Buscando 'el juguete indestructible' 🦴...",
  "Buscando 'catnip para un viernes' 🌿...",
  "Buscando 'comida para perros mañosos' 🐕...",
  "Buscando 'el mejor rascador del mundo' 🌿...",
  "Buscando 'arena que no huela a arena' ✨...",
];

export default function Header() {
  const { cartCount, cartType } = useCart();
  const { wishlist } = useWishlist();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);
  
  const [allProducts, setAllProducts] = useState<SanitizedProduct[]>([]);
  const [searchResults, setSearchResults] = useState<SanitizedProduct[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const whatsappNumber = "56912345678";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  // Cargar productos para la búsqueda instantánea
  useEffect(() => {
    fetchAllProducts().then(products => {
      setAllProducts(products.filter(p => p.currentStock > 0));
    });
  }, []);

  // Efecto de escritura para el buscador
  useEffect(() => {
    const handleTyping = () => {
      const fullText = SEARCH_PLACEHOLDERS[placeholderIndex];
      
      if (!isDeleting) {
        setCurrentPlaceholder(fullText.substring(0, currentPlaceholder.length + 1));
        setTypingSpeed(100);
        
        if (currentPlaceholder === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentPlaceholder(fullText.substring(0, currentPlaceholder.length - 1));
        setTypingSpeed(50);
        
        if (currentPlaceholder === "") {
          setIsDeleting(false);
          setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentPlaceholder, isDeleting, placeholderIndex, typingSpeed]);

  // Filtrado de resultados en tiempo real
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const query = searchTerm.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      ).slice(0, 6);
      
      setSearchResults(filtered);
      setShowResults(filtered.length > 0);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchTerm, allProducts]);

  // Cerrar resultados al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
    }
  };

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
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity flex items-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
            <a 
              href="https://www.instagram.com/mydog_distribuidora" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-70 transition-opacity flex items-center gap-1.5"
            >
              <Instagram className="w-4 h-4" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header - Búsqueda y Acciones */}
      <div className="h-20 bg-primary text-white flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-6 md:gap-12">
          {/* Burger Menu (Mobile Only) */}
          <Sheet>
            <SheetTrigger asChild>
              <button className="md:hidden text-white hover:bg-white/10 p-2 rounded-xl transition-colors">
                <Menu className="w-7 h-7" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:max-w-md p-0 border-none bg-background overflow-hidden flex flex-col">
              <SheetHeader className="p-8 bg-primary text-white shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <Dog className="w-8 h-8 text-secondary" />
                  <SheetTitle className="text-white font-black text-2xl tracking-tighter text-left uppercase">Menú Principal</SheetTitle>
                </div>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F6F6F6]">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Navegación</span>
                  {mainNav.map((item) => (
                    <Link 
                      key={item.label}
                      href={item.href}
                      className="flex items-center p-4 bg-white rounded-2xl border border-black/5 shadow-sm font-black text-xs uppercase tracking-widest text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">Categorías</span>
                  {CATEGORIES.map((category) => (
                    <Link 
                      key={category} 
                      href={`/catalogo?categoria=${encodeURIComponent(category)}`}
                      className="flex items-center justify-between p-4 bg-white rounded-2xl border border-black/5 shadow-sm hover:border-primary/20 transition-all group"
                    >
                      <span className="font-black text-xs uppercase tracking-widest text-foreground group-hover:text-primary">{category}</span>
                      <ChevronDown className="w-4 h-4 text-muted-foreground -rotate-90 group-hover:text-primary transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
              <Dog className="w-8 h-8 text-white" />
            </div>
            <div className="flex flex-col -space-y-1 hidden sm:flex">
              <span className="font-black text-2xl tracking-tighter leading-none uppercase">MyDog</span>
              <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.2em]">Distribuidora</span>
            </div>
          </Link>

          {/* Search (Desktop) */}
          <div className="flex-1 hidden md:flex max-w-2xl relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white rounded-full w-full h-12 overflow-hidden shadow-inner border border-transparent focus-within:border-secondary/30 transition-all">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.length > 1 && searchResults.length > 0 && setShowResults(true)}
                placeholder={currentPlaceholder}
                className="flex-1 h-full px-8 text-sm font-medium text-foreground bg-transparent outline-none placeholder:text-muted-foreground/40"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  onClick={() => setSearchTerm("")}
                  className="p-2 text-muted-foreground/40 hover:text-primary transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button type="submit" className="h-10 w-10 bg-primary rounded-full mr-1 flex items-center justify-center text-white hover:bg-primary/90 transition-all shadow-md">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Resultados de búsqueda instantánea */}
            {showResults && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2.5rem] shadow-2xl border border-black/[0.03] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-[120]">
                <div className="p-4 bg-primary/5 border-b border-black/[0.03] flex justify-between items-center">
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Encontramos estos productos</span>
                  {cartType === 'wholesale' && (
                    <Badge className="bg-primary text-white text-[8px] border-none font-black uppercase">Modo Mayorista</Badge>
                  )}
                </div>
                <div className="max-h-[420px] overflow-y-auto">
                  {searchResults.map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/catalogo/${product.slug || product.id}`}
                      onClick={() => setShowResults(false)}
                      className="flex items-center gap-4 p-5 hover:bg-primary/5 transition-colors group border-b border-black/[0.02] last:border-0"
                    >
                      <div className="relative w-14 h-14 rounded-2xl bg-muted/30 overflow-hidden shrink-0 border border-black/[0.05]">
                        <Image 
                          src={product.main_image} 
                          alt={product.name} 
                          fill 
                          className="object-contain p-2 transition-transform group-hover:scale-110"
                          sizes="56px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">{product.brand}</span>
                          <h4 className="font-bold text-xs text-foreground truncate group-hover:text-primary transition-colors leading-tight">{product.name}</h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm font-black text-primary tracking-tighter">
                          ${(cartType === 'wholesale' ? product.wholesalePrice : product.sellingPrice).toLocaleString('es-CL')}
                        </span>
                        <span className="text-[8px] font-bold text-muted-foreground uppercase">Stock: {product.currentStock}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link 
                  href={`/catalogo?q=${encodeURIComponent(searchTerm)}`}
                  onClick={() => setShowResults(false)}
                  className="flex items-center justify-center p-5 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
                >
                  Ver todos los resultados para "{searchTerm}"
                </Link>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6 shrink-0">
            {/* User Icon Mobile */}
            <Link href="/cuenta" className="md:hidden relative w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all group">
               <User className="w-4 h-4" />
            </Link>

            {/* Wishlist Icon */}
            <Link href="/wishlist" className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white/10 text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-all group">
              <Heart className={cn("w-4 h-4 sm:w-5 sm:h-5", wishlist.length > 0 && "fill-current text-secondary")} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-secondary text-primary font-black text-[8px] sm:text-[10px] w-4 border-2 h-4 sm:w-5 sm:h-5 flex items-center justify-center border-primary rounded-full">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
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
          </div>
        </div>
      </div>

      {/* 3. Menu Bar - Navegación y Mobile Search */}
      <div className="h-14 bg-primary border-t border-white/10 flex items-center px-4 md:px-8">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between h-full">
          
          {/* Desktop Navigation */}
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

          {/* Mobile Search Bar (Solo se ve en móviles) */}
          <div className="flex md:hidden flex-1 relative w-full h-10">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center bg-white rounded-full w-full h-full overflow-hidden shadow-inner border border-transparent focus-within:border-secondary/30 transition-all">
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.length > 1 && searchResults.length > 0 && setShowResults(true)}
                placeholder={currentPlaceholder}
                className="flex-1 h-full px-5 text-xs font-bold text-foreground bg-transparent outline-none placeholder:text-muted-foreground/40"
              />
              {searchTerm && (
                <button 
                  type="button" 
                  onClick={() => setSearchTerm("")}
                  className="p-1.5 text-muted-foreground/40 hover:text-primary transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button type="submit" className="h-8 w-8 bg-primary rounded-full mr-1 flex items-center justify-center text-white hover:bg-primary/90 transition-all shadow-md shrink-0">
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </header>
  );
}
