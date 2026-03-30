"use client";

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail, Sparkles } from 'lucide-react';

/**
 * @fileOverview Captación de leads con promesa de valor transaccional.
 * Actualizado para una respuesta adaptativa impecable en todas las dimensiones.
 */
export default function Newsletter() {
  const pathname = usePathname();
  const excludedRoutes = ['/checkout', '/b2b/portal', '/cuenta'];
  const isExcluded = excludedRoutes.some(route => pathname?.startsWith(route));

  if (isExcluded) return null;

  return (
    <section className="w-full bg-[#FEF9F3] py-16 md:py-24 border-t border-black/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-primary/5 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3" /> Beneficios Exclusivos
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-none">
              Únete a La Manada y <span className="text-primary">recibe un regalo</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
              Déjanos tu correo y recibe un beneficio sorpresa en tu primera compra, además de consejos de nutrición de nuestros expertos.
            </p>
          </div>

          <form 
            onSubmit={(e) => e.preventDefault()}
            className="relative max-w-lg mx-auto group"
          >
            {/* Contenedor Adaptativo: Stack en mobile, Row en desktop */}
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:bg-white md:rounded-full md:p-2 md:shadow-2xl md:shadow-primary/5 md:border md:border-black/5 md:focus-within:border-primary/20 transition-all">
              
              {/* Campo de Correo con estilo consistente */}
              <div className="relative flex items-center bg-white rounded-full border border-black/5 md:border-none md:shadow-none flex-1">
                <div className="pl-6 text-muted-foreground">
                  <Mail className="w-5 h-5" />
                </div>
                <input 
                  type="email" 
                  placeholder="tu@correo.cl" 
                  className="flex-1 h-14 bg-transparent outline-none px-4 font-bold text-sm text-foreground placeholder:text-muted-foreground/40" 
                  required
                />
              </div>

              {/* Botón de Acción Principal */}
              <Button 
                type="submit"
                className="rounded-full bg-primary text-white font-black px-8 h-14 text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all w-full md:w-auto shrink-0"
              >
                Quiero mis beneficios
              </Button>
            </div>
            
            <p className="mt-6 text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              🔒 Prometemos cuidar tus datos tanto como a tu mascota.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
