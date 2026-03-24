"use client";

import { useState, useEffect } from "react";
import { LayoutGrid, Truck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DynamicHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // El header mide 176px. Cuando el usuario scrollea 176px, el Hero llega al top de la ventana.
  const distanceToComplete = 176;
  const progress = Math.max(0, Math.min(scrollY / distanceToComplete, 1));

  // Alturas: de 256px a 48px
  const currentHeight = 256 - (256 - 48) * progress;

  return (
    <div 
      className="sticky top-0 z-[60] w-full overflow-hidden transition-colors duration-300"
      style={{ 
        height: `${currentHeight}px`,
        // El color cambia gradualmente o al final
        backgroundColor: progress > 0.9 ? '#FFD600' : '#FEF9F3',
        // Sutil sombra cuando se vuelve barra
        boxShadow: progress > 0.9 ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
      }}
    >
      {/* Fondo Decorativo */}
      <div 
        className="absolute top-0 right-0 w-1/3 h-full opacity-5 pointer-events-none transition-opacity duration-300"
        style={{ opacity: 0.05 * (1 - progress) }}
      >
        <LayoutGrid className="w-full h-full text-primary" />
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 h-full flex items-center relative">
        
        {/* CONTENIDO HERO: Título grande */}
        <div 
          className="absolute inset-0 flex flex-col justify-center px-4 lg:px-8 transition-all duration-300"
          style={{ 
            opacity: 1 - progress * 2,
            transform: `translateY(${-20 * progress}px)`,
            display: progress > 0.8 ? 'none' : 'flex'
          }}
        >
          <div className="space-y-1 md:space-y-2">
            <span className="text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.3em]">Explora nuestra tienda</span>
            <h1 className="text-4xl md:text-7xl font-black text-foreground tracking-tighter leading-none">
              Nuestro <span className="text-primary">Catálogo</span>
            </h1>
          </div>
        </div>

        {/* CONTENIDO STICKY: Mensaje de despacho */}
        <div 
          className="absolute inset-0 flex items-center justify-center transition-all duration-300"
          style={{ 
            opacity: progress > 0.5 ? (progress - 0.5) * 2 : 0,
            transform: `translateY(${20 * (1 - progress)}px)`,
            display: progress < 0.2 ? 'none' : 'flex'
          }}
        >
          <div className="flex items-center gap-3 text-[10px] md:text-xs font-black text-primary uppercase tracking-[0.2em]">
            <div className="bg-primary text-white p-1 rounded-sm shadow-sm">
              <Truck className="w-3 h-3 md:w-4 md:h-4" />
            </div>
            <span className="drop-shadow-sm">Despacho Gratis sobre $50.000 en Región Metropolitana</span>
          </div>
        </div>
      </div>
    </div>
  );
}
