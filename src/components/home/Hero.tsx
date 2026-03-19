import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

/**
 * @fileOverview Componente Hero de la página de inicio.
 * Presenta la propuesta de valor principal y el llamado a la acción.
 */

export default function Hero() {
  return (
    <section className="bg-[#FEF9F3] w-full overflow-hidden relative border-b border-black/5">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center min-h-[calc(100vh-176px)] relative z-10">
        <div className="space-y-10 py-16 md:py-0 animate-in fade-in slide-in-from-left duration-1000">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              🐾 Bienestar animal garantizado
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.95] tracking-tighter">
              Comida Premium <br /> para tu <span className="text-primary">Mascota</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg leading-relaxed">
              Distribuidora líder en nutrición animal con más de 15 años de trayectoria. Calidad certificada para los que más quieres.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 pt-4">
            <Link href="/catalogo">
              <Button size="lg" className="h-16 rounded-full bg-primary text-white font-black px-10 text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-all gap-3">
                Explorar Catálogo <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#FEF9F3] overflow-hidden bg-muted shadow-sm ring-1 ring-black/5">
                    <Image src={`https://picsum.photos/seed/${i + 20}/80/80`} alt="usuario" width={40} height={40} />
                  </div>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">1K+ Clientes</span>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Felices en Chile</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex relative h-full items-end justify-center animate-in fade-in slide-in-from-right duration-1000">
          <div className="relative w-full h-[110%] -mb-16 lg:-mb-24">
            <Image
              src="https://picsum.photos/seed/happy-dog-hero/800/1000"
              alt="Mascota Feliz"
              fill
              className="object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)]"
              priority
              data-ai-hint="happy dog"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
