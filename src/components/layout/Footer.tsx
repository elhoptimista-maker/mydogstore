'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Instagram, Dog, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

/**
 * @fileOverview Footer Masivo con integración de WhatsApp y visibilidad condicional del Newsletter.
 */

export default function Footer() {
  const pathname = usePathname();
  const whatsappNumber = "56912345678";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  // Determinamos si estamos en la página de cuenta para ocultar el Newsletter
  const isAccountPage = pathname === '/cuenta';

  return (
    <footer className="w-full min-h-[calc(100vh-176px)] flex flex-col">
      {/* 1. Newsletter Row - Solo visible fuera de la página de cuenta */}
      {!isAccountPage && (
        <div className="bg-[#F6F6F6] pt-16 pb-20 md:pb-28 text-center border-t border-black/[0.03]">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Únete a la manada <span className="text-primary">MyDog</span></h2>
              <p className="text-muted-foreground font-medium text-lg">Recibe ofertas exclusivas y consejos de nutrición para tus mascotas.</p>
            </div>
            <div className="relative max-w-xl mx-auto">
              <div className="relative flex items-center bg-white rounded-full h-14 md:h-16 px-1.5 shadow-lg border border-black/5">
                <input 
                  type="email" 
                  placeholder="Tu correo electrónico" 
                  className="flex-1 h-full bg-transparent outline-none px-6 font-bold text-sm text-foreground" 
                />
                <Button className="rounded-full bg-primary text-white font-black px-8 h-11 md:h-13 text-sm">
                  Suscribirse
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Main Footer Row */}
      <div className="bg-primary text-white py-16 px-4 md:px-8 rounded-t-[3rem] mx-4 -mt-12 relative z-20 shadow-2xl flex-1 flex flex-col justify-between">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
          {/* Logo & Social */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm">
                <Dog className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-black text-xl tracking-tighter leading-none uppercase">MyDog</span>
                <span className="text-[8px] font-bold text-white/60 uppercase tracking-[0.2em]">Distribuidora</span>
              </div>
            </Link>
            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-sm">
              Expertos en bienestar animal desde 2008. Distribución profesional de las mejores marcas para Santiago y regiones.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.instagram.com/mydog_distribuidora" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white text-white hover:text-primary transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href={whatsappUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#25D366] text-white hover:text-white transition-all"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>
          
          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-secondary">Tienda</h4>
            <ul className="space-y-3 text-sm font-bold text-white/70">
              <li><Link href="/catalogo" className="hover:text-white transition-all">Alimentos</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition-all">Snacks</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition-all">Accesorios</Link></li>
              <li><Link href="/catalogo" className="hover:text-white transition-all">Ofertas</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-secondary">Ayuda</h4>
            <ul className="space-y-3 text-sm font-bold text-white/70">
              <li><Link href="#" className="hover:text-white transition-all">Envíos</Link></li>
              <li><Link href="#" className="hover:text-white transition-all">Términos</Link></li>
              <li><Link href="#" className="hover:text-white transition-all">FAQ</Link></li>
              <li><Link href="/b2b" className="hover:text-white transition-all">Mayoristas</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-black text-[10px] uppercase tracking-[0.3em] text-secondary">Contacto</h4>
            <ul className="space-y-3 text-sm font-bold text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-secondary shrink-0" />
                <span className="leading-tight">La Cisterna, RM</span>
              </li>
              <li>
                <a 
                  href={whatsappUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-secondary transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-secondary shrink-0" />
                  <span>+56 9 1234 5678</span>
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span>hola@mydog.cl</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* 3. Bottom Row */}
        <div className="max-w-7xl mx-auto w-full mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
          <p>© 2024 MYDOG DISTRIBUIDORA SPA. TODOS LOS DERECHOS RESERVADOS.</p>
          <div className="flex gap-4 opacity-40 grayscale">
            <div className="bg-white px-2 py-1 rounded text-black font-sans font-bold">VISA</div>
            <div className="bg-white px-2 py-1 rounded text-black font-sans font-bold">MC</div>
            <div className="bg-white px-2 py-1 rounded text-black font-sans font-bold">WEBPAY</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
