import { SanitizedProduct } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WishlistProductCardProps {
  product: SanitizedProduct;
  onRemove: (id: string) => void;
  onAddToCart: (product: SanitizedProduct) => void;
}

export default function WishlistProductCard({ product, onRemove, onAddToCart }: WishlistProductCardProps) {
  return (
    <div className="group relative bg-white rounded-[2.5rem] p-6 border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full">
      {/* Botón de quitar (Premium floating) */}
      <button 
        onClick={() => onRemove(product.id)}
        className="absolute top-6 right-6 z-10 w-10 h-10 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 hover:bg-red-500 hover:text-white shadow-sm"
        title="Quitar de favoritos"
      >
        <Trash2 className="w-5 h-5" />
      </button>

      {/* Imagen con badge de stock */}
      <Link 
        href={`/catalogo/${product.slug || product.id}`} 
        className="relative aspect-square mb-6 bg-muted/30 rounded-[2rem] overflow-hidden block group-hover:bg-primary/5 transition-colors"
      >
        <Image 
          src={product.main_image} 
          alt={product.name} 
          fill 
          className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-out" 
          sizes="(max-width: 768px) 100vw, 25vw"
        />
        {product.currentStock <= 0 && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-[4px] flex items-center justify-center">
            <Badge className="bg-destructive text-white border-none font-black uppercase tracking-[0.2em] text-[10px] px-4 py-1.5 rounded-full">Agotado</Badge>
          </div>
        )}
      </Link>

      {/* Info Content */}
      <div className="flex-1 flex flex-col">
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2">
            <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">
              {product.brand}
            </Badge>
          </div>
          <h3 className="font-black text-base leading-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            <Link href={`/catalogo/${product.slug || product.id}`}>{product.name}</Link>
          </h3>
        </div>

        <div className="mt-auto space-y-4">
          <div className="flex items-end justify-between border-t border-black/5 pt-4">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Inversión</span>
              <span className="text-2xl font-black text-primary tracking-tighter">${product.sellingPrice.toLocaleString('es-CL')}</span>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-0.5">Peso</span>
               <span className="text-xs font-black text-foreground">{product.weight_kg}kg</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={() => onAddToCart(product)}
              disabled={product.currentStock <= 0}
              className="flex-1 h-12 rounded-2xl bg-primary text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Añadir
            </Button>
            <Link href={`/catalogo/${product.slug || product.id}`} className="shrink-0">
              <Button variant="outline" size="icon" className="w-12 h-12 rounded-2xl border-primary/10 text-primary hover:bg-primary/5">
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
