
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * @fileOverview Super-Cards Promocionales siguiendo el punto 4 del PRD.
 * Rediseñado por el Arquitecto de Frontend para máxima armonía y responsividad.
 */

export default function PromotionalBanners() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Tarjeta 1: Alimento Holístico (Fondo Blanco) */}
        <div className="group relative bg-white rounded-[2.5rem] p-8 md:p-12 flex flex-col sm:flex-row items-center overflow-hidden border border-black/[0.03] shadow-xl shadow-black/[0.02] transition-all duration-500 hover:shadow-2xl hover:shadow-black/[0.05] hover:-translate-y-1">
          <div className="relative z-10 space-y-5 md:space-y-6 w-full sm:w-[60%] text-center sm:text-left">
            <Badge className="bg-secondary text-primary border-none font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full inline-flex">
              Colección 2024
            </Badge>
            <h3 className="text-3xl lg:text-5xl font-black text-foreground leading-[1.1] tracking-tighter">
              Alimento <span className="text-primary">Holístico</span> Natural
            </h3>
            <p className="text-xs md:text-sm font-medium text-muted-foreground leading-relaxed max-w-[250px] mx-auto sm:mx-0">
              Nutrición balanceada sin colorantes ni preservantes artificiales.
            </p>
            <Link href="/catalogo" className="inline-block pt-2">
              <Button className="rounded-full bg-primary text-white font-black px-8 h-12 text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Comprar Ahora <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="relative mt-8 sm:mt-0 w-full sm:absolute sm:right-0 sm:bottom-0 sm:w-1/2 sm:h-full min-h-[200px] pointer-events-none">
            <Image 
              src="https://picsum.photos/seed/promo1/600/600" 
              alt="Alimento Holístico" 
              fill 
              className="object-contain object-bottom sm:object-right-bottom transition-transform duration-700 group-hover:scale-110 group-hover:-rotate-2"
              data-ai-hint="dog food"
            />
          </div>
        </div>

        {/* Tarjeta 2: Accesorios Alta Montaña (Fondo Amarillo) */}
        <div className="group relative bg-accent rounded-[2.5rem] p-8 md:p-12 flex flex-col sm:flex-row items-center overflow-hidden shadow-xl shadow-accent/10 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-1">
          <div className="relative z-10 space-y-5 md:space-y-6 w-full sm:w-[60%] text-center sm:text-left">
            <Badge className="bg-white text-primary border-none font-black text-[9px] uppercase tracking-widest px-4 py-1.5 rounded-full inline-flex">
              Novedades
            </Badge>
            <h3 className="text-3xl lg:text-5xl font-black text-primary-foreground leading-[1.1] tracking-tighter">
              Accesorios de <span className="text-white">Alta Montaña</span>
            </h3>
            <p className="text-xs md:text-sm font-medium text-primary-foreground/70 leading-relaxed max-w-[250px] mx-auto sm:mx-0">
              Equipamiento técnico para las aventuras más exigentes.
            </p>
            <Link href="/catalogo" className="inline-block pt-2">
              <Button className="rounded-full bg-white text-primary font-black px-8 h-12 text-[10px] uppercase tracking-widest shadow-lg shadow-black/5 hover:scale-105 active:scale-95 transition-all">
                Ver Colección <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="relative mt-8 sm:mt-0 w-full sm:absolute sm:right-0 sm:bottom-0 sm:w-1/2 sm:h-full min-h-[200px] pointer-events-none">
            <Image 
              src="https://picsum.photos/seed/promo2/600/600" 
              alt="Accesorios" 
              fill 
              className="object-contain object-bottom sm:object-right-bottom transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
              data-ai-hint="dog leash"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
