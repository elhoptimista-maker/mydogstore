'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SanitizedProduct } from '@/types/product';
import { cn } from '@/lib/utils';
import { useChat } from '@/context/ChatContext';

/**
 * @fileOverview Componente de navegación transformado en selector de vendedores expertos.
 * El clic en el círculo dispara el asistente de ventas IA.
 * Rediseñado para máxima armonía visual y responsividad técnica.
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
  const { toggleChat } = useChat();
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
    <section id="navegacion-mascota" className="py-20 md:py-28 max-w-7xl mx-auto px-4 md:px-8 space-y-20 overflow-hidden">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2">
          🎯 Asesoría técnica especializada
        </div>
        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-foreground leading-none">
          Conversa con un <span className="text-primary">Guía Experto</span>
        </h2>
        <p className="text-base md:text-lg font-medium text-muted-foreground/80 leading-relaxed">
          Nacimos como pet shop y sabemos lo que tu mascota necesita. Selecciona una especie para iniciar una consulta inteligente.
        </p>
      </div>

      <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-8 md:gap-16 no-scrollbar pt-16 -mt-16 pb-12 snap-x px-4 -mx-4 md:px-0 md:mx-0">
        {SPECIES_DATA.map((species, i) => {
          const count = productCountsBySpecies[species.filter] || 0;
          const message = mountedState ? species.messages[mountedState.randomIndices[i]] : species.messages[0];
          const isLeft = mountedState ? mountedState.randomSides[i] : true;

          return (
            <div key={i} className="flex flex-col items-center gap-6 group snap-center shrink-0 relative animate-in fade-in slide-in-from-bottom-10 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
              {/* Burbuja de Pensamiento Estilo Comic - Refinada */}
              <div className="absolute -top-14 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 transition-all duration-500 pointer-events-none z-30">
                <div className="bg-white px-6 py-5 rounded-[2rem] border border-black/[0.08] relative min-w-[160px] max-w-[200px] text-center shadow-2xl shadow-black/10">
                  <span className="text-[11px] font-bold text-zinc-800 tracking-tight leading-snug block whitespace-pre-line">
                    {message}
                  </span>
                  {/* Punteros de burbuja */}
                  <div className={cn("absolute -bottom-2 w-4 h-4 bg-white border border-black/[0.08] rounded-full", isLeft ? "left-8" : "right-8")} />
                  <div className={cn("absolute -bottom-5 w-2.5 h-2.5 bg-white border border-black/[0.08] rounded-full", isLeft ? "left-12" : "right-12")} />
                </div>
              </div>

              {/* Botón de Mascota - Ingeniería de Círculos */}
              <button 
                onClick={() => toggleChat(species.filter)}
                className="relative outline-none focus-visible:ring-4 focus-visible:ring-primary/20 rounded-full transition-all"
                aria-label={`Hablar con experto en ${species.name}`}
              >
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-xl shadow-black/[0.02] border border-black/5 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:border-primary/20 relative z-10 overflow-hidden">
                  <span className="text-6xl md:text-7xl drop-shadow-sm select-none">{species.emoji}</span>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                </div>
                
                {/* Aura decorativa trasera */}
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-0" />
              </button>

              {/* Info y Link al Catálogo - Jerarquía Limpia */}
              <div className="flex flex-col items-center gap-2">
                <span className="text-sm md:text-base font-black text-foreground uppercase tracking-widest block transition-colors group-hover:text-primary">
                  {species.name}
                </span>
                <Link 
                  href={`/catalogo?especie=${encodeURIComponent(species.filter)}`}
                  className="inline-flex items-center gap-1.5 text-[9px] md:text-[10px] font-black text-muted-foreground/60 uppercase tracking-tighter hover:text-primary hover:opacity-100 transition-all px-3 py-1 rounded-full border border-transparent hover:border-primary/10 hover:bg-white"
                >
                  <span className="w-1 h-1 rounded-full bg-primary/30" />
                  {count} Productos disponibles
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
