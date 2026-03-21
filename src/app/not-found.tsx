import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Dog, ArrowLeft } from 'lucide-react';

// Forzamos que la página de 404 sea dinámica para evitar que el build intente 
// estatizarla usando los proveedores de Firebase en el layout.
export const dynamic = 'force-dynamic';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center space-y-8 bg-[#F6F6F6]">
      <div className="relative">
        <div className="w-48 h-48 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
          <Dog className="w-24 h-24 text-primary" />
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg border border-primary/20">
          <span className="text-4xl">🦴</span>
        </div>
      </div>
      
      <div className="space-y-4 max-w-md">
        <h1 className="text-6xl font-black text-primary tracking-tighter">404</h1>
        <h2 className="text-2xl font-black text-foreground">¡Ups! Olfateamos por todas partes...</h2>
        <p className="text-muted-foreground font-medium leading-relaxed">
          Pero no encontramos esta página. O nos comimos el link, o lo enterramos muy profundo en el patio.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <Link href="/">
          <Button className="h-14 px-8 rounded-full bg-primary font-black text-lg gap-3 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
            Volver a territorio conocido <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <Link href="/catalogo">
          <Button variant="outline" className="h-14 px-8 rounded-full border-2 border-primary/20 font-black text-lg">
            Ir a la tienda
          </Button>
        </Link>
      </div>
      
      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-40">
        MYDOG DISTRIBUIDORA - EL MEJOR AMIGO DE TU COMPRA
      </p>
    </div>
  );
}
