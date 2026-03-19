import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Truck,
  ShieldCheck,
  Headphones,
  Star,
  Clock,
  Dog
} from 'lucide-react';
import { getSanitizedProducts } from '@/lib/services/catalog.service';
import ProductCard from '@/components/ProductCard';
import { cn } from '@/lib/utils';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export default async function Home() {
  // Consumo del servicio de catálogo sanitizado
  const products = await getSanitizedProducts();
  
  // Seleccionamos los destacados para la home: con stock y mayor cantidad disponible
  const featuredProducts = products
    .filter(p => p.currentStock > 0)
    .sort((a, b) => b.currentStock - a.currentStock)
    .slice(0, 10);

  // Lista de especies con lógica de conteo dinámico
  const speciesList = [
    { name: 'Perros', emoji: '🐶', filter: 'Perro' },
    { name: 'Gatos', emoji: '🐱', filter: 'Gato' },
    { name: 'Aves', emoji: '🦜', filter: 'Aves' },
    { name: 'Conejos y Roedores', emoji: '🐰', filter: 'Conejo y Roedor' },
    { name: 'Peces y Tortugas', emoji: '🐠', filter: 'Peces y Tortugas' },
  ].map(s => ({
    ...s,
    count: products.filter(p => p.species === s.filter).length
  }));

  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      
      {/* 2. Bloque Hero */}
      <section className="bg-[#FEF9F3] w-full overflow-hidden relative border-b border-black/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center min-h-[calc(100vh-176px)]">
          <div className="space-y-8 py-12 md:py-0">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest">
              🐾 Bienestar animal garantizado
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground leading-[0.95] tracking-tighter">
              Comida Premium <br /> para tu <span className="text-primary">Mascota</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl font-medium max-w-lg leading-relaxed">
              Distribuidora líder en nutrición animal con más de 15 años de trayectoria. Calidad certificada para los que más quieres.
            </p>
            <div className="pt-4">
              <Link href="/catalogo">
                <Button size="lg" className="h-16 rounded-full bg-primary text-white font-black px-10 text-lg shadow-2xl hover:scale-105 transition-all gap-3">
                  Explorar Catálogo <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="flex items-center gap-4 pt-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-[#FEF9F3] overflow-hidden bg-muted shadow-sm">
                    <Image src={`https://picsum.photos/seed/${i+10}/100/100`} alt="usuario" width={48} height={48} />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                <span className="text-primary font-black">1K+</span> Clientes Felices
              </p>
            </div>
          </div>
          
          {/* Imagen oculta en móvil para priorizar el contenido */}
          <div className="hidden md:flex relative h-full items-end justify-center">
            <div className="relative w-full h-[120%] -mb-24 lg:-mb-32">
              <Image
                src="https://picsum.photos/seed/happy-dog/800/1000"
                alt="Mascota Feliz"
                fill
                className="object-contain drop-shadow-2xl"
                priority
                data-ai-hint="happy dog"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Navegación por Especies (Mascotas) */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Encuentra lo mejor para tu</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Busca por <span className="text-primary">Mascota</span>
          </h2>
        </div>
        <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-8 md:gap-16 no-scrollbar pb-4 snap-x">
          {speciesList.map((species, i) => (
            <Link 
              key={i} 
              href={`/catalogo?especie=${encodeURIComponent(species.filter)}`}
              className="flex flex-col items-center gap-5 group cursor-pointer snap-center shrink-0"
            >
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl group-hover:border-primary/20">
                <span className="text-5xl md:text-6xl">{species.emoji}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-bold text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                  {species.name}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase tracking-tighter">
                  ({species.count} productos)
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. Grilla de Productos Destacados */}
      <section className="py-24 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
        <div className="flex flex-row justify-between items-end border-b border-black/5 pb-8">
          <div className="space-y-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Selección experta</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">Productos <span className="text-primary">Destacados</span></h2>
          </div>
          <Link href="/catalogo">
            <Button variant="outline" className="rounded-full font-bold border-2 px-8 h-12 border-primary/10 hover:border-primary transition-all">Ver Todos</Button>
          </Link>
        </div>
        
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-primary/10">
            <p className="text-muted-foreground font-medium">No se encontraron productos con stock disponibles en este momento.</p>
          </div>
        )}
      </section>

      {/* 9. Prueba Social */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-16">
          <div className="flex justify-center -space-x-4">
            {[1,2,3,4,5].map(i => (
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
              {[1,2,3].map(i => (
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

      {/* 12. Barra de Confianza */}
      <section className="py-24 bg-[#FEF9F3] border-y border-black/5">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { icon: <Clock className="w-8 h-8" />, t: 'Entrega Flash', s: 'Comprando antes de las 14:00' },
            { icon: <Truck className="w-8 h-8" />, t: 'Envío Gratis', s: 'Sobre $50.000 netos' },
            { icon: <ShieldCheck className="w-8 h-8" />, t: 'Garantía MyDog', s: 'Productos certificados' },
            { icon: <Headphones className="w-8 h-8" />, t: 'Soporte 24/7', s: 'Asistencia garantizada' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-primary shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold text-foreground text-lg">{item.t}</h4>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{item.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
