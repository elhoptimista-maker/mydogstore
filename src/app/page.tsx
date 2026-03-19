
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Truck,
  ShieldCheck,
  Headphones,
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

  // Lista de especies con mensajes aleatorios y temáticos
  const speciesList = [
    { 
      name: 'Perros', 
      emoji: '🐶', 
      filter: 'Perro', 
      messages: [
        'Escuchando el perro chocoloco 🐶',
        '¿Alguien dijo galleta? 🍪',
        '¡Quiero paseooo! 🦴',
        'Entrenando para ser el mejor amigo 🎾',
        'Buscando mi cola... otra vez 🔄'
      ]
    },
    { 
      name: 'Gatos', 
      emoji: '🐱', 
      filter: 'Gato', 
      messages: [
        'Mirando por la ventana... 🪟',
        'Planeando la dominación mundial 🌍',
        'Necesito 5 min más de siesta 😴',
        'Ignorando a todos con estilo ✨',
        'Si cabe, me siento 📦'
      ]
    },
    { 
      name: 'Aves', 
      emoji: '🦜', 
      filter: 'Aves', 
      messages: [
        'Practicando mi hit de verano 🎶',
        '¡Pío pío! ¡Qué rico! 🌽',
        '¿Viste ese gusanito? 👀',
        'Sintiéndome libre como el viento 🦅',
        '¡Hola! ¿Cómo estás? 🦜'
      ]
    },
    { 
      name: 'Conejos y Roedores', 
      emoji: '🐰', 
      filter: 'Conejo y Roedor', 
      messages: [
        '¡Ñam! ¡Croc croc! 🥕',
        'Saltando de alegría 🐇',
        'Buscando el escondite perfecto 🛖',
        'Mis dientes nunca descansan 🦷',
        'Sintiéndome muy fluffy hoy ☁️'
      ]
    },
    { 
      name: 'Peces y Tortugas', 
      emoji: '🐠', 
      filter: 'Peces y Tortugas', 
      messages: [
        'Juan Luis Guerra - Burbujas de Amor 🫧',
        'Glup glup! ¡Burbujas! 🐠',
        'Nadaremos, nadaremos... 🌊',
        'Lento pero seguro 🐢',
        'Buscando a Nemo 🔍'
      ]
    },
  ].map((s, index) => {
    // Selección estable para evitar errores de hidratación
    // En una iteración futura, esto podría ser un componente cliente con useEffect para azar real
    const message = s.messages[index % s.messages.length];
    return {
      ...s,
      message,
      count: products.filter(p => p.species === s.filter).length
    };
  });

  return (
    <div className="bg-[#F6F6F6] min-h-screen">
      
      {/* 2. Bloque Hero - Armonizado */}
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
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#FEF9F3] overflow-hidden bg-muted shadow-sm ring-1 ring-black/5">
                      <Image src={`https://picsum.photos/seed/${i+20}/80/80`} alt="usuario" width={40} height={40} />
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

      {/* 3. Navegación por Mascota con Burbujas Interactivas (Estilo IG Notes) */}
      <section id="navegacion-mascota" className="py-16 max-w-7xl mx-auto px-4 md:px-8 space-y-16">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Encuentra lo mejor para tu</span>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
            Busca por <span className="text-primary">Mascota</span>
          </h2>
        </div>
        <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-8 md:gap-16 no-scrollbar pb-4 snap-x pt-12">
          {speciesList.map((species, i) => (
            <Link 
              key={i} 
              href={`/catalogo?especie=${encodeURIComponent(species.filter)}`}
              className="flex flex-col items-center gap-5 group cursor-pointer snap-center shrink-0 relative"
            >
              {/* Burbuja de Pensamiento (Instagram Notes Style) */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-2 transition-all duration-300 pointer-events-none z-30">
                <div className="bg-white px-5 py-3 rounded-[1.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-black/[0.05] relative min-w-[140px] text-center">
                  <span className="text-[11px] font-bold text-zinc-800 uppercase tracking-tight whitespace-nowrap leading-relaxed">
                    {species.message}
                  </span>
                  {/* Cola de la burbuja refinada */}
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b border-r border-black/[0.05] rotate-45 rounded-sm" />
                </div>
              </div>

              {/* Icono Mascota */}
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:border-primary/20 relative z-10 overflow-hidden">
                <span className="text-5xl md:text-6xl">{species.emoji}</span>
                {/* Overlay sutil al hover */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
              </div>

              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-black text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
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
      <section className="pb-24 pt-12 max-w-7xl mx-auto px-4 md:px-8 space-y-12">
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
