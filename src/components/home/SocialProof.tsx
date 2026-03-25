import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote } from 'lucide-react';

/**
 * @fileOverview Sección de testimonios y prueba social refinada.
 * Implementa la estética de "Overlapping Avatars" y carrusel de tipografía fluida.
 */

const TESTIMONIALS = [
  {
    text: "Excelente servicio de distribución. Los productos siempre llegan frescos y en el tiempo acordado. Mi tienda ha crecido un 40% gracias a su soporte técnico.",
    author: "Carolina Méndez",
    role: "Dueña de PetShop 'El Refugio'",
    avatar: "https://picsum.photos/seed/testi-1/120/120"
  },
  {
    text: "Como veterinario, solo confío en marcas certificadas. MyDog me ofrece el mix perfecto entre calidad médica y precios competitivos para mis pacientes.",
    author: "Dr. Ricardo Lagos",
    role: "Director Clínica 'Vida Animal'",
    avatar: "https://picsum.photos/seed/testi-2/120/120"
  },
  {
    text: "El despacho es increíblemente rápido. Compro para mi perro y mi gato y siempre encuentro ofertas que no están en el supermercado.",
    author: "Andrea Valdés",
    role: "Cliente desde 2019",
    avatar: "https://picsum.photos/seed/testi-3/120/120"
  }
];

export default function SocialProof() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 text-center space-y-16 relative z-10">
        
        {/* Overlapping Avatars Group */}
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center -space-x-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white overflow-hidden bg-muted shadow-2xl transition-all duration-500 hover:scale-110 hover:z-20 cursor-default",
                i === 3 ? "scale-125 z-10 ring-4 ring-secondary/20" : "opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
              )}>
                <Image 
                  src={`https://picsum.photos/seed/user-${i+50}/120/120`} 
                  alt="user" 
                  width={80} 
                  height={80} 
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            ⭐ 100K+ Clientes Felices en Chile
          </div>
        </div>

        {/* Carrusel de Testimonios */}
        <Carousel 
          opts={{ loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {TESTIMONIALS.map((t, i) => (
              <CarouselItem key={i}>
                <div className="space-y-10 px-4 md:px-12">
                  <div className="relative">
                    <Quote className="absolute -top-8 -left-4 md:-left-8 w-12 h-12 text-primary/10 -z-10" />
                    <p className="text-xl md:text-3xl lg:text-4xl font-medium italic text-foreground leading-[1.4] tracking-tight">
                      "{t.text}"
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-foreground uppercase tracking-tight">{t.author}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">{t.role}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="hidden md:block">
            <CarouselPrevious className="h-14 w-14 -left-16 bg-white text-primary border-black/5 shadow-xl hover:bg-primary hover:text-white transition-all" />
            <CarouselNext className="h-14 w-14 -right-16 bg-white text-primary border-black/5 shadow-xl hover:bg-primary hover:text-white transition-all" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
