"use client";

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { Heart, ArrowRight, ShoppingCart, Trash2, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Aseguramos unicidad absoluta por ID para evitar errores de duplicidad de llaves en React
  const uniqueWishlist = Array.from(
    new Map(wishlist.map(item => [item.id, item])).values()
  );

  return (
    <div className="bg-[#F6F6F6] min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative h-48 md:h-64 flex items-center bg-[#FEF9F3] overflow-hidden mb-12 border-b border-black/5">
        <div className="absolute top-0 right-0 w-1/4 h-full opacity-5 pointer-events-none">
          <Heart className="w-full h-full text-primary" />
        </div>
        <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full relative z-10">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">Mis favoritos</span>
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter leading-none">
              Tu Lista de <span className="text-primary">Deseos</span>
            </h1>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {uniqueWishlist.length > 0 ? (
          <div className="flex flex-col gap-6">
            {uniqueWishlist.map((product) => (
              <div 
                key={`wishlist-item-${product.id}`} 
                className="bg-white border border-border/50 rounded-[2.5rem] p-6 md:p-8 flex flex-col md:flex-row gap-8 hover:shadow-xl transition-all group relative overflow-hidden"
              >
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />

                {/* Image Section */}
                <Link 
                  href={`/catalogo/${product.id}`} 
                  className="relative w-full md:w-56 aspect-square bg-muted/20 rounded-[2rem] overflow-hidden shrink-0 border border-black/[0.03]"
                >
                   <Image 
                     src={product.main_image} 
                     alt={product.name} 
                     fill 
                     className="object-contain p-6 group-hover:scale-105 transition-transform duration-500" 
                     sizes="(max-width: 768px) 100vw, 224px"
                   />
                   {product.currentStock < 5 && product.currentStock > 0 && (
                     <Badge className="absolute top-4 left-4 bg-orange-500 text-white border-none rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest shadow-lg">
                       Últimas unidades
                     </Badge>
                   )}
                </Link>
                
                {/* Info Section */}
                <div className="flex-1 flex flex-col justify-center space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary/10 text-primary border-none rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest">
                        {product.brand}
                      </Badge>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {product.category}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter leading-tight hover:text-primary transition-colors">
                      <Link href={`/catalogo/${product.id}`}>{product.name}</Link>
                    </h3>
                  </div>
                  
                  <p className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed max-w-2xl">
                    {product.short_description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-8">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Precio Distribución</span>
                        <span className="text-3xl font-black text-primary tracking-tighter leading-none">
                          ${product.sellingPrice.toLocaleString('es-CL')}
                        </span>
                     </div>
                     <div className="hidden sm:block h-12 w-px bg-border/50" />
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Disponibilidad</span>
                        <div className="flex items-center gap-2">
                           <div className={cn("w-2 h-2 rounded-full", product.currentStock > 0 ? "bg-green-500 animate-pulse" : "bg-destructive")} />
                           <span className={cn("text-[10px] font-black uppercase tracking-widest", product.currentStock > 0 ? "text-green-600" : "text-destructive")}>
                             {product.currentStock > 0 ? `${product.currentStock} unidades en bodega` : 'Sin stock momentáneamente'}
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-muted-foreground/40">
                      <ShieldCheck className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Garantía MyDog</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground/40">
                      <Truck className="w-4 h-4" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Despacho Express</span>
                    </div>
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex flex-row md:flex-col gap-3 justify-center items-stretch md:w-56 md:border-l md:border-black/5 md:pl-8 pt-6 md:pt-0">
                   <Button 
                     onClick={() => addToCart(product)} 
                     disabled={product.currentStock === 0} 
                     className="flex-1 md:flex-none rounded-2xl h-14 bg-primary text-white font-black text-sm uppercase tracking-widest gap-3 shadow-xl shadow-primary/15 hover:scale-[1.02] active:scale-95 transition-all"
                   >
                      <ShoppingCart className="w-5 h-5" /> Agregar
                   </Button>
                   <Button 
                     variant="ghost" 
                     onClick={() => toggleWishlist(product)} 
                     className="flex-1 md:flex-none rounded-2xl h-14 text-red-500 hover:bg-red-50 font-black text-[10px] uppercase tracking-[0.2em] gap-3 transition-colors"
                   >
                      <Trash2 className="w-4 h-4" /> Eliminar
                   </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border border-black/5 shadow-xl shadow-black/[0.02] space-y-8">
            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto">
              <Heart className="w-10 h-10 text-primary/20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black tracking-tight text-foreground">Tu lista está vacía</h2>
              <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                Guarda los productos que más te gustan para comprarlos más tarde.
              </p>
            </div>
            <Link href="/catalogo">
              <Button className="h-14 px-8 rounded-full bg-primary font-black text-base gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                Explorar catálogo <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
