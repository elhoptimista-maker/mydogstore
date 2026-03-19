'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SanitizedProduct } from '@/types/product';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import ProductAssistant from '@/components/ProductAssistant';

/**
 * @fileOverview Componente de navegación por mascota con integración de Asistente IA para venta consultiva.
 */

interface SpeciesData {
  name: string;
  emoji: string;
  filter: string;
  messages: string[];
}

const SPECIES_DATA: SpeciesData[] = [
  { 
    name: 'Perros', 
    emoji: '🐶', 
    filter: 'Perro', 
    messages: [
      '¿Escuchaste eso?\n¡Shakira dijo que las perras ya no lloran, facturan! 💃🐾',
      'Pensando:\n¿A qué hora vamos al parque? 🌳',
      'Viendo:\nMarley y Yo (preparando pañuelos) 😢',
      'Comiendo:\nUn rico huesito 🦴'
    ]
  },
  { 
    name: 'Gatos', 
    emoji: '🐱', 
    filter: 'Gato', 
    messages: [
      'Escuchando:\nLa gata bajo la lluvia 🌧️',
      'Pensando:\nPlaneando la dominación mundial 🌍',
      'Viendo:\nEl Gato con Botas 👢',
      'Comiendo:\nAtún premium (obvio) 🐟'
    ]
  },
  { 
    name: 'Aves', 
    emoji: '🦜', 
    filter: 'Aves', 
    messages: [
      'Cucurrucucú paloma...\n¡Y que nadie me diga cómo volar! 🎶🕊️',
      'Viendo:\nRio (buscando mi samba) 🇧🇷',
      'Comiendo:\nSemillas y más semillas 🌻'
    ]
  },
  { 
    name: 'Conejos y Roedores', 
    emoji: '🐰', 
    filter: 'Conejo y Roedor', 
    messages: [
      'Escuchando:\nEl ratón vaquero 🤠🐭',
      'Bad Bunny...\n¡Yo no soy conejo malo, soy el más tierno! 🥕🐰',
      'Comiendo:\nZanahoria de mi corazón 🥕'
    ]
  },
  { 
    name: 'Peces y Tortugas', 
    emoji: '🐠', 
    filter: 'Peces y Tortugas', 
    messages: [
      'Juan Luis Guerra...\n¡Quisiera ser un pez para tocar mi nariz en tu pecera! 🫧🎵',
      'Viendo:\nBuscando a Nemo 🔍',
      'Pensando:\nMi burbuja es mi castillo 🏰'
    ]
  },
];

export default function PetNavigation({ products }: { products: SanitizedProduct[] }) {
  const [mountedState, setMountedState] = useState<{
    randomIndices: number[];
    randomSides: boolean[];
  } | null>(null);

  useEffect(() => {
    setMountedState({
      randomIndices: SPECIES_DATA.map(s => Math.floor(Math.random() * s.messages.length)),
      randomSides: SPECIES_DATA.map(() => Math.random() > 0.5),
    });
  }, []);

  const productCountsBySpecies = useMemo(() => {
    return products.reduce((acc, product) => {
      const species = product.species; 
      if (species) {
        acc[species] = (acc[species] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  return (
    <section id="navegacion-mascota" className="py-16 max-w-7xl mx-auto px-4 md:px-8 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Encuentra lo mejor para tu</span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          Busca por <span className="text-primary">Mascota</span>
        </h2>
      </div>

      <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-8 md:gap-16 no-scrollbar pb-4 snap-x">
        {SPECIES_DATA.map((species, i) => {
          const count = productCountsBySpecies[species.filter] || 0;
          const message = mountedState ? species.messages[mountedState.randomIndices[i]] : species.messages[0];
          const isLeft = mountedState ? mountedState.randomSides[i] : true;

          return (
            <div key={i} className="flex flex-col items-center gap-5 group snap-center shrink-0 relative">
              {/* Burbuja de Pensamiento Estilo Comic */}
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 transition-all duration-300 pointer-events-none z-30">
                <div className="bg-white px-5 py-4 rounded-[1.8rem] border border-black/[0.06] relative min-w-[140px] max-w-[180px] text-center shadow-none">
                  <span className="text-[11px] font-medium text-zinc-800 tracking-tight leading-snug block whitespace-pre-line">
                    {message}
                  </span>
                  <div className={cn("absolute -bottom-2 w-4 h-4 bg-white border border-black/[0.06] rounded-full", isLeft ? "left-6" : "right-6")} />
                  <div className={cn("absolute -bottom-5 w-2.5 h-2.5 bg-white border border-black/[0.06] rounded-full", isLeft ? "left-10" : "right-10")} />
                </div>
              </div>

              {/* Icono de Mascota */}
              <Link 
                href={`/catalogo?especie=${encodeURIComponent(species.filter)}`}
                className="relative"
              >
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:border-primary/20 relative z-10 overflow-hidden">
                  <span className="text-5xl md:text-6xl">{species.emoji}</span>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                </div>
              </Link>

              {/* Info y Botón IA */}
              <div className="flex flex-col items-center gap-3">
                <div className="text-center">
                  <span className="text-sm font-black text-foreground uppercase tracking-widest block">
                    {species.name}
                  </span>
                  <span className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase tracking-tighter">
                    ({count} productos)
                  </span>
                </div>

                {/* Trigger del Asistente Consultivo */}
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 bg-secondary/10 hover:bg-secondary text-primary px-4 py-1.5 rounded-full transition-all group/btn">
                      <Sparkles className="w-3 h-3 text-secondary group-hover/btn:text-primary" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Asesoría IA</span>
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl p-0 overflow-hidden rounded-[3rem] border-none">
                    <DialogTitle className="sr-only">Asesoría de Productos para {species.name}</DialogTitle>
                    <ProductAssistant species={species.filter} emoji={species.emoji} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
