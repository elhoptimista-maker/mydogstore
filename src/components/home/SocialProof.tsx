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

const TESTIMONIALS = [
  {
    text: "Llevo años comprándole a la familia MyDog. Siempre me atienden con una sonrisa y se nota que aman lo que hacen. Mi perro salta de alegría cada vez que llega el despacho.",
    author: "Carolina Méndez",
    role: "Vecina de La Cisterna",
    avatar: "https://picsum.photos/seed/testi-1/120/120"
  },
  {
    text: "Encontré a MyDog buscando precios y me quedé por el cariño. Me asesoraron súper bien para el cambio de comida de mi gatita viejita. ¡Son un amor!",
    author: "Andrea Valdés",
    role: "Amiga de la casa desde 2019",
    avatar: "https://picsum.photos/seed/testi-3/120/120"
  },
  {
    text: "Rapidez y responsabilidad. Como feriante, valoro mucho que cumplan con los tiempos, pero como dueño de mascota, valoro más el cuidado que ponen en los productos.",
    author: "Juan Pablo Soto",
    role: "Feriante y amante de los quiltros",
    avatar: "https://picsum.photos/seed/testi-2/120/120"
  }
];

export default function SocialProof() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none">
        <svg width="100%" height="100%"><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/></pattern><rect width="100%" height="100%" fill="url(#grid)" /></svg>
      </div>

      <div className="max-w-5xl mx-auto px-4 text-center space-y-16 relative z-10">
        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center -space-x-4">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-white overflow-hidden bg-muted shadow-2xl transition-all duration-500 hover:scale-110 hover:z-20 cursor-default",
                i === 3 ? "scale-125 z-10 ring-4 ring-secondary/20" : "opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
              )}>
                <Image 
                  src={`https://picsum.photos/seed/user-${i+50}/120/120`} 
                  alt="Familia MyDog" 
                  width={80} 
                  height={80} 
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            ❤️ Historias de nuestra gran familia
          </div>
        </div>

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
