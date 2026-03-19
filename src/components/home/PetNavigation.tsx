
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SanitizedProduct } from '@/types/product';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Componente de navegación por mascota con burbujas de pensamiento interactivas.
 * Implementa el estilo de "Notas de Instagram" con posicionamiento aleatorio de punteros.
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
      'Escuchando el\nperro chocoloco 🐶',
      '¿Alguien dijo\ngalleta? 🍪',
      '¡Quiero\npaseooo! 🦴',
      'Entrenando para\nser el mejor 🎾',
      'Buscando mi cola...\notra vez 🔄'
    ]
  },
  { 
    name: 'Gatos', 
    emoji: '🐱', 
    filter: 'Gato', 
    messages: [
      'Mirando por la\nventana... 🪟',
      'Planeando la\ndominación mundial 🌍',
      'Necesito 5 min más\nde siesta 😴',
      'Ignorando a todos\ncon estilo ✨',
      'Si cabe,\nme siento 📦'
    ]
  },
  { 
    name: 'Aves', 
    emoji: '🦜', 
    filter: 'Aves', 
    messages: [
      'Practicando mi\nhit de verano 🎶',
      '¡Pío pío!\n¡Qué rico! 🌽',
      '¿Viste ese\ngusanito? 👀',
      'Libre como\nel viento 🦅',
      '¡Hola! ¿Cómo\nestás? 🦜'
    ]
  },
  { 
    name: 'Conejos y Roedores', 
    emoji: '🐰', 
    filter: 'Conejo y Roedor', 
    messages: [
      '¡Ñam!\n¡Croc croc! 🥕',
      'Saltando de\nalegría 🐇',
      'Buscando el\nescondite 🛖',
      'Mis dientes no\ndescansan 🦷',
      'Sintiéndome\nfluffy ☁️'
    ]
  },
  { 
    name: 'Peces y Tortugas', 
    emoji: '🐠', 
    filter: 'Peces y Tortugas', 
    messages: [
      'Escuchando:\nBurbujas de Amor 🫧',
      'Glup glup!\n¡Burbujas! 🐠',
      'Nadaremos,\nnadaremos... 🌊',
      'Lento pero\nseguro 🐢',
      'Buscando\na Nemo 🔍'
    ]
  },
];

export default function PetNavigation({ products }: { products: SanitizedProduct[] }) {
  const [mounted, setMounted] = useState(false);
  const [randomIndices, setRandomIndices] = useState<number[]>([]);
  const [randomSides, setRandomSides] = useState<boolean[]>([]);

  useEffect(() => {
    setMounted(true);
    setRandomIndices(SPECIES_DATA.map(s => Math.floor(Math.random() * s.messages.length)));
    setRandomSides(SPECIES_DATA.map(() => Math.random() > 0.5));
  }, []);

  return (
    <section id="navegacion-mascota" className="py-16 max-w-7xl mx-auto px-4 md:px-8 space-y-16">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.3em]">Encuentra lo mejor para tu</span>
        <h2 className="text-4xl md:text-5xl font-black tracking-tight text-foreground">
          Busca por <span className="text-primary">Mascota</span>
        </h2>
      </div>

      <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-8 md:gap-16 no-scrollbar pb-4 snap-x pt-12">
        {SPECIES_DATA.map((species, i) => {
          const count = products.filter(p => p.species === species.filter).length;
          const message = mounted ? species.messages[randomIndices[i]] : species.messages[0];
          const isLeft = mounted ? randomSides[i] : true;

          return (
            <Link 
              key={i} 
              href={`/catalogo?especie=${encodeURIComponent(species.filter)}`}
              className="flex flex-col items-center gap-5 group cursor-pointer snap-center shrink-0 relative"
            >
              {/* Burbuja de Pensamiento (Contenedor Principal) */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 transition-all duration-300 pointer-events-none z-30">
                <div className="bg-white px-5 py-4 rounded-[1.8rem] border border-black/[0.06] relative min-w-[140px] max-w-[180px] text-center shadow-none">
                  <span className="text-[11px] font-medium text-zinc-800 uppercase tracking-tight leading-snug block whitespace-pre-line">
                    {message}
                  </span>
                  
                  {/* Círculo Mediano de conexión */}
                  <div className={cn(
                    "absolute -bottom-1 w-4 h-4 bg-white border border-black/[0.06] rounded-full",
                    isLeft ? "left-6" : "right-6"
                  )} />
                  
                  {/* Círculo Pequeño de conexión (el que solapa el avatar) */}
                  <div className={cn(
                    "absolute -bottom-4 w-2.5 h-2.5 bg-white border border-black/[0.06] rounded-full",
                    isLeft ? "left-10" : "right-10"
                  )} />
                </div>
              </div>

              {/* Icono Mascota */}
              <div className="relative">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:border-primary/20 relative z-10 overflow-hidden">
                  <span className="text-5xl md:text-6xl">{species.emoji}</span>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                </div>
              </div>

              {/* Información Inferior */}
              <div className="flex flex-col items-center gap-1">
                <span className="text-sm font-black text-foreground uppercase tracking-widest group-hover:text-primary transition-colors">
                  {species.name}
                </span>
                <span className="text-[10px] font-bold text-muted-foreground opacity-60 uppercase tracking-tighter">
                  ({count} productos)
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
