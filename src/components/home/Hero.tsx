import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Importamos la imagen local para que Next.js la procese correctamente desde src/img
import HeroDogImage from '@/img/golden-retriever-gato-calico-juntos.png';

/**
 * @fileOverview Componente Hero de alta ingeniería.
 * Optimizado para eliminar el rectángulo de carga (blur) en imágenes con transparencia.
 */

export default function Hero() {
  return (
    <section className="relative w-full bg-[#FEF9F3] overflow-hidden border-b border-black/5 flex items-center min-h-[calc(100dvh-176px)]">
      
      {/* 1. Capa de Decoración Ambiental */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/5 rounded-full blur-[80px] md:blur-[120px] animate-pulse duration-[4000ms]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-secondary/10 rounded-full blur-[60px] md:blur-[100px]" />
      </div>

      {/* 2. Contenedor Principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* 3. Columna de Texto: Jerarquía Visual */}
          <div className="flex flex-col space-y-8 text-center lg:text-left items-center lg:items-start max-w-2xl mx-auto lg:mx-0 order-2 lg:order-1">
            <div className="space-y-6">
              <Badge className="bg-primary/10 text-primary border-none rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-[0.2em] animate-in fade-in slide-in-from-bottom-4 duration-500">
                🐾 El mejor amigo de tu bolsillo
              </Badge>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl xl:text-8xl font-black text-foreground leading-[0.92] tracking-tighter animate-in fade-in slide-in-from-left-6 duration-700">
                Comida Premium <br className="hidden sm:block" /> para tu <span className="text-primary">Mascota</span>
              </h1>
              
              <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg leading-relaxed animate-in fade-in slide-in-from-left-8 duration-1000">
                Llevamos más de 15 años nutriendo la felicidad de miles de hogares. 
                Calidad técnica certificada con despacho a todo Chile.
              </p>
            </div>

            {/* CTAs y Social Proof */}
            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto pt-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
              <Link href="/catalogo" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-16 rounded-full bg-primary text-white font-black px-10 text-lg shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-3">
                  Explorar Tienda <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              
              <div className="flex items-center gap-4 group cursor-default">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#FEF9F3] overflow-hidden bg-muted shadow-sm ring-1 ring-black/5">
                      <Image 
                        src={`https://picsum.photos/seed/user-${i + 100}/80/80`} 
                        alt="Cliente MyDog" 
                        width={40} 
                        height={40} 
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 fill-secondary text-secondary" />)}
                  </div>
                  <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mt-1">1K+ Miembros felices</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Columna Visual: Imagen Hero sin efecto blur para transparencia limpia */}
          <div className="relative w-full h-[320px] sm:h-[450px] lg:h-[600px] flex items-end justify-center order-1 lg:order-2 animate-in fade-in zoom-in duration-1000">
            {/* Aura de luz decorativa */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] aspect-square bg-white/40 rounded-full border border-white/60 blur-md -z-10" />
            
            <div className="relative w-full h-full lg:h-[115%] lg:-mb-20">
              <Image
                src={HeroDogImage}
                alt="Golden Retriever y Gato MyDog"
                fill
                className="object-contain drop-shadow-[0_25px_50px_rgba(0,0,0,0.15)] scale-110"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                // Hemos eliminado placeholder="blur" para evitar el cuadro difuminado en el fondo transparente
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
