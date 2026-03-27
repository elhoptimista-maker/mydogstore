import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Quote, Star } from 'lucide-react';

/**
 * @fileOverview Sección de Prueba Social (Testimonios) refinada.
 * Implementa un carrusel donde el avatar y el texto están vinculados y transitan juntos.
 */

const TESTIMONIALS = [
  {
    text: "Llevo años comprándole a la familia MyDog. Siempre me atienden con una sonrisa y se nota que aman lo que hacen. Mi perro salta de alegría cada vez que llega el despacho.",
    author: "Carolina Méndez",
    role: "Vecina de La Cisterna",
    avatar: "https://picsum.photos/seed/testi-1/200/200"
  },
  {
    text: "Encontré a MyDog buscando precios y me quedé por el cariño. Me asesoraron súper bien para el cambio de comida de mi gatita viejita. ¡Son un amor!",
    author: "Andrea Valdés",
    role: "Amiga de la casa desde 2019",
    avatar: "https://picsum.photos/seed/testi-3/200/200"
  },
  {
    text: "Rapidez y responsabilidad. Como feriante, valoro mucho que cumplan con los tiempos, pero como dueño de mascota, valoro más el cuidado que ponen en los productos.",
    author: "Juan Pablo Soto",
    role: "Feriante y amante de los quiltros",
    avatar: "https://picsum.photos/seed/testi-2/200/200"
  }
];

export default function SocialProof() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 text-center space-y-12 relative z-10">
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            ❤️ Historias de nuestra gran familia
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-foreground leading-none">
            Confianza que se <span className="text-primary">Siente</span>
          </h2>
        </div>

        <Carousel 
          opts={{ loop: true }}
          className="w-full"
        >
          <CarouselContent>
            {TESTIMONIALS.map((t, i) => (
              <CarouselItem key={i}>
                <div className="flex flex-col items-center space-y-10 px-4 md:px-12 py-10">
                  
                  {/* Avatar Section - Animates with slide */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-colors -z-10" />
                    <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white overflow-hidden bg-muted shadow-2xl transition-all duration-500 hover:scale-110 aspect-square">
                      <Image 
                        src={t.avatar} 
                        alt={t.author} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    {/* Stars Indicator */}
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-white px-4 py-1.5 rounded-full shadow-xl border border-black/5 flex items-center gap-0.5 whitespace-nowrap">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className="w-3 h-3 fill-secondary text-secondary" />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Text */}
                  <div className="relative max-w-3xl">
                    <Quote className="absolute -top-10 -left-4 md:-left-12 w-16 h-16 text-primary/5 -z-10" />
                    <p className="text-xl md:text-3xl lg:text-4xl font-medium italic text-foreground leading-[1.4] tracking-tight">
                      "{t.text}"
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="space-y-2">
                    <h4 className="text-xl font-black text-foreground uppercase tracking-tight">{t.author}</h4>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">{t.role}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <div className="hidden md:block">
            <CarouselPrevious className="h-14 w-14 -left-16 bg-white text-primary border-none shadow-xl hover:bg-primary hover:text-white transition-all" />
            <CarouselNext className="h-14 w-14 -right-16 bg-white text-primary border-none shadow-xl hover:bg-primary hover:text-white transition-all" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
