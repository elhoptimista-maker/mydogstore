"use client";

import { Button } from '@/components/ui/button';
import { Heart, Share2 } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { SanitizedProduct } from '@/types/product';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function ProductHeaderActions({ product }: { product: SanitizedProduct }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `MyDog: ${product.name}`,
          text: product.short_description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({ title: "Enlace copiado", description: "URL copiada al portapapeles." });
      }
    } catch (error) {
      // Fallo silencioso si el usuario cancela
    }
  };

  return (
    <div className="flex gap-2">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toggleWishlist(product)}
              className={cn(
                "w-10 h-10 rounded-full shadow-sm border transition-all",
                inWishlist 
                  ? "bg-red-50 border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600" 
                  : "bg-white border-border/50 text-muted-foreground hover:text-red-500"
              )}
            >
              <Heart className={cn("w-5 h-5", inWishlist && "fill-current")} />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="font-bold text-[10px] uppercase tracking-widest bg-black text-white">
            {inWishlist ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-white shadow-sm border border-border/50 text-muted-foreground hover:text-primary transition-all"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="font-bold text-[10px] uppercase tracking-widest bg-black text-white">
            Compartir producto
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
