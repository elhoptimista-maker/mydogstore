'use client';

import { useState, useEffect, useMemo } from 'react';
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
      'Yo perreo solo\n(literalmente) 🐕',
      '¿Alguien dijo\ngalleta? 🍪',
      'Mi bebito fiu fiu\nversión canina 🐶',
      'Who let the dogs out?\n(Yo no fui) 🐾',
      'Buscando mi cola...\nOtra vez 🔄',
      'Tengo un gato en la garganta...\nNo, espera, es un snack 🦴',
      'Haciendo un Marley & Me\n(pero sin el final triste) 😢🍿',
      'TikTok: *Dog voice*\n"¡Hellouu!" 👋',
      'Hachiko... pero para ir al parque 🌳',
      'I can buy myself flowers...\nand treats 💐🦴',
      'Guardianes de la Galaxia?\nNo, de la casa 🌌🏠',
      '¡Guau guau!\nDame un snack 🦴'
    ]
  },
  { 
    name: 'Gatos', 
    emoji: '🐱', 
    filter: 'Gato', 
    messages: [
      'Miau miau miau\nComo dice la gatita 🐱',
      'Planeando la\ndominación mundial (como Thanos) 🌍',
      'Te felicito qué bien\nactúas (miau) 💃',
      'Si cabe en la caja,\nentonces me siento 📦',
      'No soy tu Michi, soy tu King 👑',
      'Motomami, Motomiau 🏍️🐱',
      'Tengo un gato en\nla garganta (es real) 🎤',
      'Gatúbela, ¿quién te conoce? 🐱💅',
      'El Padrino Cat: "Miau..." 🌹🐾',
      'Bajo mi patita\nmiau miau 🐾🎵',
      'Me pareció ver un lindo...\n¡snack! 🐦🚫',
      'Necesito cinco minutos\nmás de siesta 😴'
    ]
  },
  { 
    name: 'Aves', 
    emoji: '🦜', 
    filter: 'Aves', 
    messages: [
      'Volaré oh oh\ncantaré oh oh oh 🎶',
      'Un pajarito me dijo\nque hay ofertas 🐦Offers',
      '¿Viste ese\ngusanito? 👀🐛',
      'Libre como\nel viento (como Shakira) 🦅',
      'Up, una aventura...\nde plumas 🎈🐦',
      'Río, ¿dónde está mi Samba? 🇧🇷🦜',
      'Un gran poder conlleva\nun gran... gusanito 🕷️ Corn',
      'Haciendo un Angry Bird... \na mi manera 😡🐦',
      'El Planeta de los Simios...\ny Aves 🐵🦜',
      'Me siento el Rey del mundo...\ndel cielo 🚢🦅',
      '¡Pío pío!\n¡Qué rico! 🌽'
    ]
  },
  { 
    name: 'Conejos y Roedores', 
    emoji: '🐰', 
    filter: 'Conejo y Roedor', 
    messages: [
      'Bad bunny bebé\nBe-be-be 🐰',
      'Más rápido que\nSpeedy González 🐭💨',
      'Titi me preguntó... if I have carrots 🥕🐰',
      'Dumbo... pero de orejas cortas 🐘🐰',
      'El Padrino... de los Hamsters 🌹🐹',
      'Saltando de\nalegría (como Rosalía) 🐇',
      'Ratatouille? No, gracias 👋👨‍🍳🐭',
      'Zanahoria de mi\ncorazón (My heart skips a beat) 🥕❤️',
      'Misión Imposible...\ncon mis dientes 🦷🐇',
      'Zootopia: Judy Hopps\nstyle! 🐰👮‍♀️',
      'Mis dientes no\ndescansan nunca 🦷'
    ]
  },
  { 
    name: 'Peces y Tortugas', 
    emoji: '🐠', 
    filter: 'Peces y Tortugas', 
    messages: [
      'Escuchando:\nBurbujas de amor 🫧🐠',
      '¡Glup glup!\n¡Muchas burbujas! 🐠',
      'Bajo el mar\nvivo mucho mejor (literal) 🌊🐚',
      'Lento pero seguro...\nComo Rayo McQueen 🐢⚡',
      'Titanic? No, gracias 👋🚢🌊',
      'En el mar, la vida\nes más sabrosa... y mojada 🐠',
      'Mi burbuja es mi castillo 🫧🏰',
      'Buscando a Nemo...\ny a Dory 🔍🐠',
      'Como pez en el agua...\ny en la tienda! 🐠 Offers',
      'Glup... y a comer!',
      'Un mundo ideal...\nbajo el agua 🫧🐠'
    ]
  },
];

export default function PetNavigation({ products }: { products: SanitizedProduct[] }) {
  // Estado consolidado para evitar renderizados innecesarios y parpadeos en el montaje.
  const [mountedState, setMountedState] = useState<{
    randomIndices: number[];
    randomSides: boolean[];
  } | null>(null);

  useEffect(() => {
    // Generamos los datos aleatorios solo una vez al montar el componente.
    setMountedState({
      randomIndices: SPECIES_DATA.map(s => Math.floor(Math.random() * s.messages.length)),
      randomSides: SPECIES_DATA.map(() => Math.random() > 0.5),
    });
  }, []);

  // Pre-calculamos el conteo de productos para mejorar el rendimiento.
  const productCountsBySpecies = useMemo(() => {
    return products.reduce((acc, product) => {
      const species = product.species;
      acc[species] = (acc[species] || 0) + 1;
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

      <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-8 md:gap-16 no-scrollbar pb-4 snap-x pt-12">
        {SPECIES_DATA.map((species, i) => {
          const count = productCountsBySpecies[species.filter] || 0;
          
          // Lógica robusta para manejar el estado antes y después del montaje, previniendo errores de hidratación.
          const message = mountedState 
            ? species.messages[mountedState.randomIndices[i]] 
            : species.messages[0];
          
          const isLeft = mountedState 
            ? mountedState.randomSides[i] 
            : true;

          return (
            <Link 
              key={i} 
              href={`/catalogo?especie=${encodeURIComponent(species.filter)}`}
              className="flex flex-col items-center gap-5 group cursor-pointer snap-center shrink-0 relative"
            >
              {/* Burbuja de Pensamiento (Contenedor Principal) - Estética mantenida */}
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
                  
                  {/* Círculo Pequeño de conexión */}
                  <div className={cn(
                    "absolute -bottom-5 w-2.5 h-2.5 bg-white border border-black/[0.06] rounded-full",
                    isLeft ? "left-10" : "right-10"
                  )} />
                </div>
              </div>

              {/* Icono Mascota - Estética mantenida */}
              <div className="relative">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-white shadow-sm border border-black/5 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-2xl group-hover:border-primary/20 relative z-10 overflow-hidden">
                  <span className="text-5xl md:text-6xl">{species.emoji}</span>
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                </div>
              </div>

              {/* Información Inferior - Estética mantenida */}
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