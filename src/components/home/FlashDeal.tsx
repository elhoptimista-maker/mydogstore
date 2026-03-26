'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Zap } from 'lucide-react';
import Link from 'next/link';

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
    <section className="py-12 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-black/5 border border-black/5 p-8 md:p-16 relative overflow-hidden grid grid-cols-1 lg:grid-cols-3 items-center gap-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl pointer-events-none" />

          <div className="relative aspect-square lg:aspect-[4/5] rounded-[2rem] overflow-hidden group">
            <Image 
              src="https://picsum.photos/seed/flash-dog/800/1000" 
              alt="Oportunidades MyDog" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint="happy dog"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <Badge className="bg-secondary text-primary border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                PRECIOS DE BODEGA
              </Badge>
            </div>
          </div>

          <div className="text-center space-y-8 lg:space-y-10 z-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-red-50 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                <Zap className="w-3 h-3 fill-current" /> Las ofertas vuelan
              </div>
              <h2 className="text-4xl md:text-6xl xl:text-7xl font-black tracking-tighter leading-none text-foreground">
                Oportunidades <span className="text-primary">de hoy</span>
              </h2>
              <p className="text-muted-foreground font-medium text-sm md:text-base max-w-xs mx-auto">
                Precios especiales por tiempo limitado directo desde nuestro centro de distribución.
              </p>
            </div>

            <div className="flex justify-center gap-3 md:gap-4">
              {[
                { label: 'Días', val: timeLeft.days },
                { label: 'Hrs', val: timeLeft.hours },
                { label: 'Min', val: timeLeft.minutes },
                { label: 'Seg', val: timeLeft.seconds }
              ].map((unit, i) => (
                <div key={i} className="w-16 h-16 md:w-20 md:h-20 bg-[#F9FAFB] rounded-[1.5rem] flex flex-col items-center justify-center border border-black/[0.03] shadow-sm group hover:border-primary/20 transition-colors">
                  <span className="text-xl md:text-2xl font-black text-primary leading-none tabular-nums">
                    {unit.val.toString().padStart(2, '0')}
                  </span>
                  <span className="text-[8px] font-bold uppercase text-muted-foreground tracking-widest mt-1 opacity-60">{unit.label}</span>
                </div>
              ))}
            </div>

            <Link href="/catalogo" className="inline-block w-full sm:w-auto">
              <Button className="w-full sm:w-auto rounded-full bg-primary text-white font-black px-12 h-16 text-lg shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all gap-3">
                Ver ofertas de hoy <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="hidden lg:block relative aspect-[4/5] rounded-[2rem] overflow-hidden group">
            <Image 
              src="https://picsum.photos/seed/flash-cat/800/1000" 
              alt="Gatitos felices MyDog" 
              fill 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint="happy cat"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-6 left-6">
              <Badge className="bg-white text-primary border-none rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                STOCK ASEGURADO 🐱
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
