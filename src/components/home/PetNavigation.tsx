'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { SanitizedProduct } from '@/types/product';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Componente de navegación por mascota con burbujas de pensamiento interactivas.
 * Implementa el estilo de "Notas de Instagram" / "Comic" con referencias categorizadas (Música, Películas, Comida, Pensamientos).
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
      // Música
      'Escuchando:\nEl baile del perrito 🎺🐶',
      'Escuchando:\nPerro Fiel (Shakira) 🎧🐾',
      'Escuchando:\nCallejero (Alberto Cortez) 🐕',
      'Escuchando:\nWho let the dogs out? 🎵',
      // Películas
      'Viendo:\nLa dama y el vagabundo 🍝🐕',
      'Viendo:\nMarley y Yo (preparando pañuelos) 😢🍿',
      'Viendo:\n101 Dálmatas 🎬🐾',
      'Viendo:\nSiempre a tu lado (Hachiko) 📼',
      // Comida
      'Comiendo:\nUn rico huesito 🦴',
      'Comiendo:\nLas sobras que cayeron de la mesa 🤫🥩',
      // Pensamientos
      'Pensando:\n¿A qué hora vamos al parque? 🌳',
      'Pensando:\nBuscando mi cola... otra vez 🔄',
      'Pensando:\nSi me hago el lindo, me dan premio 🐶✨'
    ]
  },
  { 
    name: 'Gatos', 
    emoji: '🐱', 
    filter: 'Gato', 
    messages: [
      // Música
      'Escuchando:\nLa gata bajo la lluvia 🌧️🐈',
      'Escuchando:\nEl gato volador 🚁🐱',
      'Escuchando:\nMotomami, Motomiau 🏍️🐱',
      // Películas
      'Viendo:\nEl Gato con Botas 👢🤺',
      'Viendo:\nLos Aristogatos 🎹🐈',
      'Viendo:\nGarfield (con una pizza) 📼🍕',
      // Comida
      'Comiendo:\nAtún premium (obvio) 🐟👑',
      'Comiendo:\nUn snack crujiente de salmón 🍣',
      // Pensamientos
      'Pensando:\nPlaneando la dominación mundial 🌍',
      'Pensando:\nGatúbela, ¿quién te conoce? 🐱💅',
      'Pensando:\nSi cabe, me siento. Es la ley 📦',
      'Pensando:\nNecesito cinco minutos más de siesta 😴'
    ]
  },
  { 
    name: 'Aves', 
    emoji: '🦜', 
    filter: 'Aves', 
    messages: [
      // Música
      'Escuchando:\nCucurrucucú paloma 🎶🕊️',
      'Escuchando:\nVolaré (Gipsy Kings) 🎸',
      'Escuchando:\nOjalá que llueva café ☕🐦',
      // Películas
      'Viendo:\nRio (buscando mi samba) 🇧🇷🦜',
      'Viendo:\nUp (una aventura de plumas) 🎈',
      'Viendo:\nPollitos en Fuga 🐓🏃‍♂️',
      // Comida
      'Comiendo:\nUn rico gusanito 🐛',
      'Comiendo:\nSemillas y más semillas 🌻',
      // Pensamientos
      'Pensando:\nLibre como el viento 🦅',
      'Pensando:\nSoy el rey del cielo ☁️👑',
      'Pensando:\nUn pajarito me dijo que hay ofertas 👀'
    ]
  },
  { 
    name: 'Conejos y Roedores', 
    emoji: '🐰', 
    filter: 'Conejo y Roedor', 
    messages: [
      // Música
      'Escuchando:\nEl ratón vaquero (Cri-Cri) 🤠🐭',
      'Escuchando:\nTití me preguntó... 🥕🎧',
      'Escuchando:\nBad Bunny bebé 🐰',
      // Películas
      'Viendo:\nZootopia (Judy Hopps fan) 👮‍♀️🐰',
      'Viendo:\nSpace Jam (con Bugs Bunny) 🏀🐇',
      'Viendo:\nRatatouille (tomando notas) 👨‍🍳🐭',
      // Comida
      'Comiendo:\nZanahoria de mi corazón 🥕❤️',
      'Comiendo:\nQuesito premium 🧀',
      // Pensamientos
      'Pensando:\nMás rápido que Speedy González 💨',
      'Pensando:\nMis dientes no descansan nunca 🦷',
      'Pensando:\nSaltando de alegría 🐇✨'
    ]
  },
  { 
    name: 'Peces y Tortugas', 
    emoji: '🐠', 
    filter: 'Peces y Tortugas', 
    messages: [
      // Música
      'Escuchando:\nBurbujas de amor 🫧🎵',
      'Escuchando:\nBajo el mar (Cumbia Remix) 🦀🎶',
      'Escuchando:\nEn el mar la vida es más sabrosa 🌊',
      // Películas
      'Viendo:\nBuscando a Nemo 🔍🐠',
      'Viendo:\nLas Tortugas Ninja (cowabunga) 🍕🐢',
      'Viendo:\nEl Espantatiburones 🎬🐡',
      // Comida
      'Comiendo:\nHojuelas sabor océano 🌿',
      'Comiendo:\nLechuga fresca (soy fitness) 🥬🐢',
      // Pensamientos
      'Pensando:\nBajo el mar vivo mucho mejor (literal) 🌊🐚',
      'Pensando:\nMi burbuja es mi castillo 🏰',
      'Pensando:\nTengo memoria de pez... ¿qué decía? 🤔',
      'Pensando:\nLento pero seguro, como Rayo McQueen 🐢⚡'
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
      // Nota: Asumimos que product.attributes.species es donde vive el dato según la sanitización.
      // Ajusta 'product.attributes.species' si la propiedad está en la raíz (product.species).
      const species = product.attributes?.species || product.species; 
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

      <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-8 md:gap-16 no-scrollbar pb-4 snap-x pt-12">
        {SPECIES_DATA.map((species, i) => {
          const count = productCountsBySpecies[species.filter] || 0;
          
          // Lógica robusta para manejar el estado antes y después del montaje.
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
                  
                  {/* Círculo Pequeño de conexión */}
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