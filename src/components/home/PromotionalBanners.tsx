
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

/**
 * @fileOverview Super-Cards Promocionales siguiendo el punto 4 del PRD.
 */

export default function PromotionalBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tarjeta 1: Fondo Blanco */}
        <div className="bg-white rounded-[3rem] p-10 md:p-14 flex items-center relative overflow-hidden border border-black/5 shadow-xl shadow-black/[0.02] group">
          <div className="relative z-10 space-y-6 max-w-[60%]">
            <Badge className="bg-yellow-400 text-black border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">
              Colección 2024
            </Badge>
            <h3 className="text-3xl md:text-5xl font-black text-foreground leading-[1.1] tracking-tighter">
              Alimento <span className="text-primary">Holístico</span> Natural
            </h3>
            <Button className="rounded-full bg-primary text-white font-black px-8 h-12 shadow-lg shadow-primary/20 hover:scale-105 transition-all">
              Comprar Ahora <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full">
            <Image 
              src="https://picsum.photos/seed/promo1/600/600" 
              alt="Promo 1" 
              fill 
              className="object-contain object-right-bottom transition-transform duration-700 group-hover:scale-110"
              data-ai-hint="dog food"
            />
          </div>
        </div>

        {/* Tarjeta 2: Fondo Accent (Amarillo) */}
        <div className="bg-accent rounded-[3rem] p-10 md:p-14 flex items-center relative overflow-hidden shadow-xl shadow-accent/10 group">
          <div className="relative z-10 space-y-6 max-w-[60%]">
            <Badge className="bg-white text-primary border-none font-black text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full">
              Novedades
            </Badge>
            <h3 className="text-3xl md:text-5xl font-black text-primary-foreground leading-[1.1] tracking-tighter">
              Accesorios de <span className="text-white">Alta Montaña</span>
            </h3>
            <Button className="rounded-full bg-white text-primary font-black px-8 h-12 shadow-lg shadow-black/5 hover:scale-105 transition-all">
              Ver Colección <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 h-full">
            <Image 
              src="https://picsum.photos/seed/promo2/600/600" 
              alt="Promo 2" 
              fill 
              className="object-contain object-right-bottom transition-transform duration-700 group-hover:scale-110"
              data-ai-hint="dog leash"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
