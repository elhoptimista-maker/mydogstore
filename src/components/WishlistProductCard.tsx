import { SanitizedProduct } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WishlistProductCardProps {
  product: SanitizedProduct;
  onRemove: (id: string) => void;
  onAddToCart: (product: SanitizedProduct) => void;
}

export default function WishlistProductCard({ product, onRemove, onAddToCart }: WishlistProductCardProps) {
  return (
    <div className="group relative bg-white rounded-3xl p-4 border border-black/5 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Botón de quitar (Corazón roto al hover) */}
      <button 
        onClick={() => onRemove(product.id)}
        className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:bg-red-50 hover:scale-110 transition-all border border-red-100"
        title="Quitar de favoritos"
      >
        <Heart className="w-4 h-4 fill-current" />
      </button>

      {/* Imagen */}
      <Link 
        href={`/catalogo/${product.slug || product.id}`} 
        className="relative aspect-square mb-4 bg-muted/20 rounded-2xl overflow-hidden block"
      >
        <Image 
          src={product.main_image} 
          alt={product.name} 
          fill 
          className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {product.currentStock <= 0 && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
            <Badge variant="destructive" className="font-black uppercase tracking-widest text-[10px]">Agotado</Badge>
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1 mb-4">
          <p className="text-[9px] font-black text-primary uppercase tracking-[0.2em]">{product.brand}</p>
          <h3 className="font-bold text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/catalogo/${product.slug || product.id}`}>{product.name}</Link>
          </h3>
        </div>

        <div className="space-y-3 mt-auto pt-4 border-t border-black/5">
          <div className="flex items-end justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Precio</span>
              <span className="text-xl font-black text-foreground tracking-tighter">${product.sellingPrice.toLocaleString('es-CL')}</span>
            </div>
            <span className="text-[10px] font-bold text-muted-foreground">{product.weight_kg}kg</span>
          </div>

          <Button 
            onClick={() => onAddToCart(product)}
            disabled={product.currentStock <= 0}
            className="w-full h-10 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-md shadow-primary/20 hover:scale-[1.02] transition-all"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
