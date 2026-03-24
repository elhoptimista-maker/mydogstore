"use client";

import { useWishlist } from '@/context/WishlistContext';
import { Heart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import WishlistProductCard from '@/components/WishlistProductCard';
import { useCart } from '@/context/CartContext';
import { SanitizedProduct } from '@/types/product';
import { toast } from '@/hooks/use-toast';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemove = (id: string) => {
    // Encontramos el producto para dar un feedback correcto en el toast
    const product = wishlist.find(p => p.id === id);
    if (product) toggleWishlist(product);
  };

  const handleAddToCart = (product: SanitizedProduct) => {
    addToCart(product);
    toast({
      title: "¡Añadido!",
      description: `${product.name} está en tu carrito.`
    });
  };

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {uniqueWishlist.map((product) => (
              <WishlistProductCard 
                key={`wishlist-item-${product.id}`} 
                product={product}
                onRemove={handleRemove}
                onAddToCart={handleAddToCart}
              />
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
