
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SanitizedProduct } from '@/types/product';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Componente de navegación por mascota con burbujas de pensamiento interactivas.
 * Implementa el estilo de "Notas de Instagram" / "Comic" con posicionamiento aleatorio de punteros.
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
      'yo perreo solo\n(literalmente) 🐕',
      '¿alguien dijo\ngalleta? 🍪',
      'mi bebito fiu fiu\nversión canina 🐶',
      'who let the dogs out?\n(yo no fui) 🐾',
      'buscando mi cola...\notra vez 🔄',
      'guau guau guau\nsi me dan snack 🦴'
    ]
  },
  { 
    name: 'Gatos', 
    emoji: '🐱', 
    filter: 'Gato', 
    messages: [
      'miau miau miau\ncomo dice la gatita 🐱',
      'planeando la\ndominación mundial 🌍',
      'te felicito qué bien\nactúas (miau) 💃',
      'si cabe,\nme siento 📦',
      'necesito 5 min más\nde siesta 😴',
      'tengo un gato en\nla garganta 🎤'
    ]
  },
  { 
    name: 'Aves', 
    emoji: '🦜', 
    filter: 'Aves', 
    messages: [
      'volaré oh oh\ncantaré oh oh oh 🎶',
      'un pajarito me dijo\nque hay ofertas 🐦',
      '¿viste ese\ngusanito? 👀',
      'libre como\nel viento 🦅',
      '¡pío pío!\n¡qué rico! 🌽'
    ]
  },
  { 
    name: 'Conejos y Roedores', 
    emoji: '🐰', 
    filter: 'Conejo y Roedor', 
    messages: [
      'bad bunny bebé\nbe-be-be 🐰',
      'más rápido que\nspeedy gonzález 🐭',
      'saltando de\nalegría 🐇',
      'zanahoria de mi\ncorazón 🥕',
      'mis dientes no\ndescansan 🦷'
    ]
  },
  { 
    name: 'Peces y Tortugas', 
    emoji: '🐠', 
    filter: 'Peces y Tortugas', 
    messages: [
      'escuchando:\nburbujas de amor 🫧',
      'glup glup!\n¡burbujas! 🐠',
      'bajo el mar\nvivo mucho mejor 🌊',
      'lento pero seguro\ncomo rayo mcqueen 🐢',
      'buscando\na nemo 🔍'
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
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 transition-all duration-300 pointer-events-none z-30">
                <div className="bg-white px-5 py-4 rounded-[1.8rem] border border-black/[0.06] relative min-w-[140px] max-w-[180px] text-center shadow-none">
                  <span className="text-[11px] font-medium text-zinc-800 tracking-tight leading-snug block whitespace-pre-line">
                    {message}
                  </span>
                  
                  {/* Círculo Mediano de conexión */}
                  <div className={cn(
                    "absolute -bottom-2 w-4 h-4 bg-white border border-black/[0.06] rounded-full",
                    isLeft ? "left-6" : "right-6"
                  )} />
                  
                  {/* Círculo Pequeño de conexión (el que solapa el avatar) */}
                  <div className={cn(
                    "absolute -bottom-5 w-2.5 h-2.5 bg-white border border-black/[0.06] rounded-full",
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
