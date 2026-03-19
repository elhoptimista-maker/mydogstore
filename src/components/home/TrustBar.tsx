import { Clock, Truck, ShieldCheck, Headphones } from 'lucide-react';

/**
 * @fileOverview Barra de beneficios y confianza (Trust Bar).
 */

export default function TrustBar() {
  return (
    <section className="py-24 bg-[#FEF9F3] border-y border-black/5">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
        {[
          { icon: <Clock className="w-8 h-8" />, t: 'Entrega Flash', s: 'Comprando antes de las 14:00' },
          { icon: <Truck className="w-8 h-8" />, t: 'Envío Gratis', s: 'Sobre $50.000 netos' },
          { icon: <ShieldCheck className="w-8 h-8" />, t: 'Garantía MyDog', s: 'Productos certificados' },
          { icon: <Headphones className="w-8 h-8" />, t: 'Soporte 24/7', s: 'Asistencia garantizada' }
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center text-primary shrink-0">
              {item.icon}
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold text-foreground text-lg">{item.t}</h4>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">{item.s}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
