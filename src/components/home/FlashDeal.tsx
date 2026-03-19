
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * @fileOverview Sección de Oferta Relámpago con cuenta regresiva.
 */

export default function FlashDeal() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-white py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 items-center gap-12 relative z-10">
        
        {/* Imagen Izquierda */}
        <div className="hidden md:block relative aspect-square">
          <Image 
            src="https://picsum.photos/seed/flash1/800/800" 
            alt="Oferta 1" 
            fill 
            className="object-contain"
            data-ai-hint="happy cat"
          />
        </div>

        {/* Contenido Central */}
        <div className="text-center space-y-10">
          <div className="space-y-4">
            <Badge className="bg-secondary/10 text-primary border-none rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest">Oferta de Verano</Badge>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              Hasta <span className="text-primary">50%</span> <br /> de Descuento
            </h2>
          </div>

          {/* Cuenta Regresiva */}
          <div className="flex justify-center gap-4">
            {[
              { label: 'Días', val: timeLeft.days },
              { label: 'Hrs', val: timeLeft.hours },
              { label: 'Min', val: timeLeft.minutes },
              { label: 'Seg', val: timeLeft.seconds }
            ].map((unit, i) => (
              <div key={i} className="w-16 h-16 md:w-20 md:h-20 bg-muted/40 rounded-full flex flex-col items-center justify-center border border-black/5 shadow-inner">
                <span className="text-xl md:text-2xl font-black text-primary leading-none">
                  {unit.val.toString().padStart(2, '0')}
                </span>
                <span className="text-[8px] font-bold uppercase text-muted-foreground tracking-widest mt-1">{unit.label}</span>
              </div>
            ))}
          </div>

          <Button className="rounded-full bg-primary text-white font-black px-12 h-16 text-lg shadow-2xl shadow-primary/20 hover:scale-105 transition-all">
            ¡Aprovechar Ahora!
          </Button>
        </div>

        {/* Imagen Derecha */}
        <div className="hidden md:block relative aspect-square">
          <Image 
            src="https://picsum.photos/seed/flash2/800/800" 
            alt="Oferta 2" 
            fill 
            className="object-contain"
            data-ai-hint="dog accessories"
          />
        </div>
      </div>

      {/* Decoración de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-primary/5 -rotate-3 -z-0" />
    </section>
  );
}
