'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { SanitizedProduct } from '@/types/product';

/**
 * @fileOverview Componente de navegación por mascota con burbujas de pensamiento interactivas.
 * Encapsula la lógica de mensajes aleatorios y estilos de hover.
 */

interface PetNavigationProps {
  products: SanitizedProduct[];
}

const SPECIES_DATA = [
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
];

export default function PetNavigation({ products }: PetNavigationProps) {
  const [mounted, setMounted] = useState(false);
  const [randomIndices, setRandomIndices] = useState<number[]>([]);

  // Efecto para manejar la aleatoriedad post-hidratación y evitar errores de servidor
  useEffect(() => {
    setMounted(true);
    setRandomIndices(SPECIES_DATA.map(s => Math.floor(Math.random() * s.messages.length)));
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
          // Si no ha montado, usamos el primer mensaje para consistencia, luego el aleatorio
          const message = mounted ? species.messages[randomIndices[i]] : species.messages[0];

          return (
            <Link 
              key={i} 
              href={`/catalogo?especie=${encodeURIComponent(species.filter)}`}
              className="flex flex-col items-center gap-5 group cursor-pointer snap-center shrink-0 relative"
            >
              {/* Burbuja de Pensamiento (Instagram Notes Style) - Solapando el círculo */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-hover:-translate-y-4 transition-all duration-300 pointer-events-none z-30">
                <div className="bg-white px-5 py-3 rounded-[1.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.15)] border border-black/[0.05] relative min-w-[140px] text-center">
                  <span className="text-[11px] font-black text-zinc-800 uppercase tracking-tight whitespace-nowrap leading-relaxed">
                    {message}
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
