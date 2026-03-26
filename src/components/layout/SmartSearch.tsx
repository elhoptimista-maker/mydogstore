"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { fetchAllProducts } from '@/actions/products';
import { SanitizedProduct } from '@/types/product';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { cn } from '@/lib/utils';

const SEARCH_PLACEHOLDERS = [
  "¿Buscas 'el juguete indestructible'? 🦴",
  "¿Catnip para un viernes? 🌿",
  "¿Comida para perros mañosos? 🐕",
  "¿El mejor rascador del mundo? 🐈",
  "¿Arena que no huela a arena? ✨",
];

interface SmartSearchProps {
  variant: 'desktop' | 'mobile';
}

/**
 * @fileOverview Motor de búsqueda inteligente aislado.
 * Encapsula la lógica de placeholder dinámico y filtrado instantáneo.
 */
export default function SmartSearch({ variant }: SmartSearchProps) {
  const router = useRouter();
  const { cartType } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [allProducts, setAllProducts] = useState<SanitizedProduct[]>([]);
  const [searchResults, setSearchResults] = useState<SanitizedProduct[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Estados para el efecto de escritura (Aislados para evitar parpadeos globales)
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // 1. Carga de datos inicial
  useEffect(() => {
    fetchAllProducts().then(products => {
      setAllProducts(products.filter(p => p.currentStock > 0));
    });
  }, []);

  // 2. Efecto de Escritura (Optimizado)
  useEffect(() => {
    const fullText = SEARCH_PLACEHOLDERS[index];
    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setPlaceholder(fullText.substring(0, placeholder.length + 1));
        if (placeholder === fullText) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setPlaceholder(fullText.substring(0, placeholder.length - 1));
        if (placeholder === "") {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, index]);

  // 3. Lógica de filtrado en tiempo real
  useEffect(() => {
    if (searchTerm.trim().length > 1) {
      const query = searchTerm.toLowerCase();
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.brand.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      ).slice(0, 6);
      
      setSearchResults(filtered);
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  }, [searchTerm, allProducts]);

  // 4. Click outside para cerrar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/catalogo?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowResults(false);
    }
  };

  return (
    <div className={cn("relative w-full", variant === 'mobile' ? 'h-10' : 'h-12')} ref={searchRef}>
      <form 
        onSubmit={handleSubmit} 
        className={cn(
          "relative flex items-center bg-white rounded-full w-full h-full overflow-hidden shadow-inner border border-transparent focus-within:border-secondary/30 transition-all",
          variant === 'mobile' ? 'px-1' : 'px-1'
        )}
      >
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => { if (searchResults.length > 0) setShowResults(true); }}
          placeholder={placeholder}
          className={cn(
            "flex-1 h-full font-medium text-foreground bg-transparent outline-none placeholder:text-muted-foreground/40",
            variant === 'mobile' ? 'px-4 text-xs' : 'px-8 text-sm'
          )}
        />
        
        {searchTerm && (
          <button 
            type="button" 
            onClick={() => setSearchTerm("")} 
            className="p-2 text-muted-foreground/40 hover:text-primary transition-colors"
          >
            <X className={variant === 'mobile' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </button>
        )}

        <button 
          type="submit" 
          className={cn(
            "bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-all shadow-md shrink-0",
            variant === 'mobile' ? 'w-8 h-8 mr-0.5' : 'w-10 h-10 mr-0.5'
          )}
        >
          <Search className={variant === 'mobile' ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
        </button>
      </form>

      {/* Panel de Resultados Instantáneos */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border border-black/[0.03] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-[120]">
          <div className="p-4 bg-primary/5 border-b border-black/[0.03] flex justify-between items-center">
            <span className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Sugerencias MyDog</span>
            {cartType === 'wholesale' && (
              <Badge className="bg-primary text-white text-[8px] border-none font-black uppercase">Modo B2B</Badge>
            )}
          </div>
          <div className="max-h-[380px] overflow-y-auto no-scrollbar">
            {searchResults.map((product) => (
              <Link 
                key={product.id} 
                href={`/catalogo/${product.slug || product.id}`}
                onClick={() => setShowResults(false)}
                className="flex items-center gap-4 p-4 md:p-5 hover:bg-primary/5 transition-colors group border-b border-black/[0.02] last:border-0"
              >
                <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-muted/30 overflow-hidden shrink-0 border border-black/[0.05]">
                  <Image 
                    src={product.main_image} 
                    alt={product.name} 
                    fill 
                    className="object-contain p-2 transition-transform group-hover:scale-110"
                    sizes="56px"
                  />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <span className="text-[8px] md:text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5 block">{product.brand}</span>
                  <h4 className="font-bold text-[11px] md:text-xs text-foreground truncate group-hover:text-primary transition-colors leading-tight">{product.name}</h4>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-xs md:text-sm font-black text-primary tracking-tighter">
                    ${(cartType === 'wholesale' ? product.wholesalePrice : product.sellingPrice).toLocaleString('es-CL')}
                  </span>
                  <span className="text-[7px] md:text-[8px] font-bold text-muted-foreground uppercase">Stock: {product.currentStock}</span>
                </div>
              </Link>
            ))}
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full flex items-center justify-center p-4 md:p-5 bg-primary text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-primary/90 transition-colors"
          >
            Ver todos los resultados para "{searchTerm}"
          </button>
        </div>
      )}
    </div>
  );
}
