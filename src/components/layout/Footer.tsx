"use client";

import Link from 'next/link';
import { Instagram, MessageCircle, MapPin, Phone, Mail, ArrowRight, ShieldCheck, Facebook } from 'lucide-react';
import BrandLogo from './BrandLogo';

/**
 * @fileOverview Pie de página con autoridad de 15 años y tono familiar.
 */
export default function Footer() {
  const whatsappUrl = `https://wa.me/+56957889012?text=Hola,%20buenos%20días!`;
  const facebookUrl = "https://web.facebook.com/DistribuidoraMyDog";
  const instagramUrl = "https://www.instagram.com/distribuidoramydog2.0";
  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Presidente+Arturo+Alessandri+palma+9243,+San+Bernardo,+Santiago,+Chile";
  const emailUrl = "mailto:admin@mydog.cl";

  return (
    <footer className="w-full bg-primary text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          <div className="lg:col-span-4 space-y-8">
            <BrandLogo variant="footer" size="lg" />
            
            <p className="text-white/60 text-sm font-medium leading-relaxed max-sm:max-w-sm">
              Nacimos como un pequeño pet shop familiar. Hoy somos una distribuidora sólida con la misma vocación: darte la mejor asesoría nutricional y despachar rápido a la puerta de tu casa.
            </p>

            <div className="flex items-center gap-4">
              <a 
                href={facebookUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all group"
              >
                <span className="sr-only">Facebook</span>
                <Facebook className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
              <a 
                href={instagramUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all group"
              >
                <span className="sr-only">Instagram</span>
                <Instagram className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366]/20 hover:border-[#25D366]/40 transition-all group"
              >
                <span className="sr-only">WhatsApp</span>
                <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Comprar</h4>
            <ul className="space-y-4">
              {['Alimentos', 'Snacks', 'Higiene', 'Juguetes', 'Ofertas de Bodega'].map((item) => (
                <li key={item}>
                  <Link href="/catalogo" className="text-sm font-bold text-white/70 hover:text-secondary transition-all flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Nuestra Trayectoria</h4>
            <ul className="space-y-4">
              {['Historia Familiar', 'Blog Nutricional', 'Portal Mayorista B2B', 'Trabaja con nosotros'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Portal Mayorista B2B' ? '/b2b' : '#'} className="text-sm font-bold text-white/70 hover:text-secondary transition-all flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Ayuda</h4>
            <div className="space-y-6">
              <a 
                href={mapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group"
              >
                <MapPin className="w-5 h-5 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest">Nuestra Bodega</p>
                  <p className="text-xs text-white/60 font-medium">Presidente Arturo Alessandri palma 9243 bodega 9, San Bernardo, Santiago, Chile</p>
                </div>
              </a>
              
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group"
              >
                <MessageCircle className="w-5 h-5 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest">Escríbenos con confianza</p>
                  <p className="text-xs text-white/60 font-medium">+569 5788 9012</p>
                </div>
              </a>

              <a 
                href={emailUrl}
                className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group"
              >
                <Mail className="w-5 h-5 text-secondary shrink-0 group-hover:scale-110 transition-transform" />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest">Correo del Hogar</p>
                  <p className="text-xs text-white/60 font-medium">hola@mydog.cl</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 flex items-center gap-2 justify-center md:justify-start">
              <ShieldCheck className="w-3 h-3" /> COMPRA 100% SEGURA EN SANTIAGO
            </p>
            <div className="flex justify-center md:justify-start gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
              <span>© 2024 MyDog Distribuidora</span>
              <span className="opacity-50">•</span>
              <Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link>
              <span className="opacity-50">•</span>
              <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <div className="bg-white px-3 py-1.5 rounded-lg text-black font-sans font-black text-[10px] tracking-tighter">VISA</div>
            <div className="bg-white px-3 py-1.5 rounded-lg text-black font-sans font-black text-[10px] tracking-tighter">MASTERCARD</div>
            <div className="bg-white px-3 py-1.5 rounded-lg text-black font-sans font-black text-[10px] tracking-tighter">WEBPAY</div>
            <div className="bg-white px-3 py-1.5 rounded-lg text-black font-sans font-black text-[10px] tracking-tighter">KHIPU</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
