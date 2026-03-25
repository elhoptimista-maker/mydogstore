import { Clock, Truck, ShieldCheck, Headphones } from 'lucide-react';

/**
 * @fileOverview Barra de beneficios y confianza (Trust Bar) refinada por el Arquitecto de Frontend.
 * Implementa una cuadrícula técnica con micro-ilustraciones y tipografía balanceada.
 */

export default function TrustBar() {
  const items = [
    { 
      icon: <Clock className="w-7 h-7" />, 
      t: 'Entrega Flash', 
      s: 'Comprando antes de las 14:00',
      badge: 'Hoy mismo'
    },
    { 
      icon: <Truck className="w-7 h-7" />, 
      t: 'Envío Gratis', 
      s: 'En compras sobre $50.000',
      badge: 'Región Metr.'
    },
    { 
      icon: <ShieldCheck className="w-7 h-7" />, 
      t: 'Garantía MyDog', 
      s: 'Productos 100% certificados',
      badge: 'Calidad'
    },
    { 
      icon: <Headphones className="w-7 h-7" />, 
      t: 'Soporte 24/7', 
      s: 'Asesoría técnica inmediata',
      badge: 'Vía WhatsApp'
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-[#FEF9F3] border-y border-black/[0.03]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-6 group">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] bg-secondary/15 flex items-center justify-center text-primary shrink-0 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 shadow-inner">
              {item.icon}
            </div>
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="font-black text-foreground text-lg tracking-tight leading-none uppercase">{item.t}</h4>
              </div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">{item.s}</p>
              <span className="text-[8px] font-black text-primary/40 uppercase tracking-[0.2em] pt-1">{item.badge}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
