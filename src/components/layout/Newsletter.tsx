"use client";

import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Mail, Sparkles } from 'lucide-react';

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
              <Sparkles className="w-3 h-3" /> Hagamos Manada
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-none">
              Únete a la <span className="text-primary">Familia MyDog</span>
            </h2>
            <p className="text-muted-foreground text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
              Recibe consejos con todo nuestro cariño, ofertas exclusivas y entérate antes que nadie cuando lleguen cositas nuevas.
            </p>
          </div>

          <form 
            onSubmit={(e) => e.preventDefault()}
            className="relative max-w-lg mx-auto group"
          >
            <div className="relative flex items-center bg-white rounded-full p-2 shadow-2xl shadow-primary/5 border border-black/5 focus-within:border-primary/20 transition-all">
              <div className="pl-6 text-muted-foreground">
                <Mail className="w-5 h-5" />
              </div>
              <input 
                type="email" 
                placeholder="tu@correo.cl" 
                className="flex-1 h-14 bg-transparent outline-none px-4 font-bold text-sm text-foreground placeholder:text-muted-foreground/40" 
                required
              />
              <Button 
                type="submit"
                className="rounded-full bg-primary text-white font-black px-8 h-14 text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Ser parte
              </Button>
            </div>
            
            <p className="mt-4 text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
              🔒 Prometemos no molestarte, solo enviarte puro amor animal.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
