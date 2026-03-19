import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

/**
 * @fileOverview Sección de testimonios y prueba social.
 */

export default function SocialProof() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 text-center space-y-16">
        <div className="flex justify-center -space-x-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={cn(
              "w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-muted shadow-lg transition-all duration-500",
              i === 3 ? "scale-125 z-10 border-primary/20" : "opacity-40"
            )}>
              <Image src={`https://picsum.photos/seed/testi-${i}/120/120`} alt="user" width={80} height={80} />
            </div>
          ))}
        </div>
        <Carousel className="w-full">
          <CarouselContent>
            {[1, 2, 3].map(i => (
              <CarouselItem key={i}>
                <div className="space-y-8">
                  <p className="text-2xl md:text-4xl font-medium italic text-foreground leading-relaxed px-12">
                    "Excelente servicio de distribución. Los productos siempre llegan frescos y en el tiempo acordado. Mi tienda ha crecido un 40% gracias a su soporte técnico."
                  </p>
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-foreground">Carolina Méndez</h4>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Dueña de PetShop "El Refugio"</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="h-16 w-16 bg-black text-white hover:bg-primary border-none shadow-xl" />
          <CarouselNext className="h-16 w-16 bg-black text-white hover:bg-primary border-none shadow-xl" />
        </Carousel>
      </div>
    </section>
  );
}
