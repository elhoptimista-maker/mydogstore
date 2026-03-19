'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Dog, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Footer Masivo ultra-compacto. 
 * Eliminado el espacio inutilizado y las restricciones de altura.
 */

export default function Footer() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  
  const whatsappNumber = "56912345678";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAccountPage = mounted && pathname === '/cuenta';

  return (
    <footer className="w-full">
      {/* 1. Newsletter Row - Compacto */}
      {!isAccountPage && (
        <div className="bg-[#F6F6F6] py-8 text-center border-t border-black/[0.03]">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            <div className="space-y-1">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-primary">Únete a la manada</h2>
              <p className="text-muted-foreground font-bold text-sm">Ofertas exclusivas y consejos de nutrición en tu correo.</p>
            </div>
            <div className="relative max-w-md mx-auto">
              <div className="relative flex items-center bg-white rounded-full h-12 px-1.5 shadow-sm border border-black/5">
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className="flex-1 h-full bg-transparent outline-none px-6 font-bold text-xs text-foreground" 
                />
                <Button className="rounded-full bg-primary text-white font-black px-6 h-9 text-[10px] uppercase">
                  Suscribirse
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Footer Row - Compacto y pegado */}
      <div className="bg-primary text-white py-8 px-4 md:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo & Social */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                <Dog className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-black text-lg tracking-tighter leading-none uppercase">MyDog</span>
                <span className="text-[7px] font-bold text-white/60 uppercase tracking-[0.2em]">Distribuidora</span>
              </div>
            </Link>
            <p className="text-white/60 text-xs font-medium leading-relaxed max-w-xs">
              Especialistas en nutrición animal desde 2008. Distribución profesional en todo Chile.
            </p>
            <div className="flex gap-2">
              <a href="https://www.instagram.com/mydog_distribuidora" target="_blank" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={whatsappUrl} target="_blank" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#25D366] transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Links de navegación */}
          <div className="space-y-3">
            <h4 className="font-black text-[9px] uppercase tracking-[0.3em] text-secondary">Tienda</h4>
            <ul className="space-y-1.5 text-xs font-bold text-white/70">
              <li><Link href="/catalogo" className="hover:text-white transition-all">Alimentos</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition-all">Snacks</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition-all">Accesorios</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition-all">Ofertas</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-[9px] uppercase tracking-[0.3em] text-secondary">Ayuda</h4>
            <ul className="space-y-1.5 text-xs font-bold text-white/70">
              <li><Link href="#" className="hover:text-white transition-all">Envíos</Link></li>
              <li><Link href="#" className="hover:text-white transition-all">Términos</Link></li>
              <li><Link href="#" className="hover:text-white transition-all">FAQ</Link></li>
              <li><Link href="/b2b" className="hover:text-white transition-all">Mayoristas</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black text-[9px] uppercase tracking-[0.3em] text-secondary">Contacto</h4>
            <ul className="space-y-1.5 text-xs font-bold text-white/70">
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-secondary shrink-0" />
                <span>La Cisterna, RM</span>
              </li>
              <li>
                <a href={whatsappUrl} className="flex items-center gap-2 hover:text-secondary transition-colors">
                  <MessageCircle className="w-3.5 h-3.5 text-secondary shrink-0" />
                  <span>+56 9 1234 5678</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 3. Bottom Row - Ultra-compacto */}
        <div className="max-w-7xl mx-auto w-full mt-8 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[8px] font-black text-white/20 uppercase tracking-[0.3em]">
          <p>© 2024 MYDOG DISTRIBUIDORA SPA.</p>
          <div className="flex gap-3 opacity-20 grayscale">
            <div className="bg-white px-1.5 py-0.5 rounded text-black font-sans font-bold">VISA</div>
            <div className="bg-white px-1.5 py-0.5 rounded text-black font-sans font-bold">MC</div>
            <div className="bg-white px-1.5 py-0.5 rounded text-black font-sans font-bold">WEBPAY</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
