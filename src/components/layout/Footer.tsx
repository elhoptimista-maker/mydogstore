"use client";

import Link from 'next/link';
import { Instagram, Dog, MessageCircle, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Footer() {
  const whatsappNumber = "56912345678";
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="w-full bg-primary text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="flex items-center gap-4 group">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-md group-hover:scale-110 transition-transform">
                <Dog className="w-8 h-8 text-white" />
              </div>
              <div className="flex flex-col -space-y-1">
                <span className="font-black text-2xl tracking-tighter leading-none uppercase">MyDog</span>
                <span className="text-[9px] font-bold text-secondary uppercase tracking-[0.2em]">Un Hogar para Mascotas</span>
              </div>
            </Link>
            
            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-sm">
              Nacimos como un pequeño pet shop familiar y hoy somos una distribuidora con corazón. Nuestra bodega en La Cisterna es el hogar de MyDog 2.0, donde cuidamos cada producto como si fuera para nuestra propia mascota.
            </p>

            <div className="flex items-center gap-4">
              <a 
                href="https://www.instagram.com/mydog_distribuidora" 
                target="_blank" 
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all group"
              >
                <Instagram className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
              <a 
                href={whatsappUrl} 
                target="_blank" 
                className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#25D366]/20 hover:border-[#25D366]/40 transition-all group"
              >
                <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Regalonear</h4>
            <ul className="space-y-4">
              {['Alimentos', 'Snacks', 'Higiene', 'Juguetes', 'Oportunidades'].map((item) => (
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
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Nuestra Familia</h4>
            <ul className="space-y-4">
              {['Nuestra Historia', 'Blog de Mascotas', 'Zona de Socios B2B', 'Trabaja con nosotros'].map((item) => (
                <li key={item}>
                  <Link href={item === 'Zona de Socios B2B' ? '/b2b' : '#'} className="text-sm font-bold text-white/70 hover:text-secondary transition-all flex items-center gap-2 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Conversemos</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <MapPin className="w-5 h-5 text-secondary shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest">Nuestra Bodega</p>
                  <p className="text-xs text-white/60 font-medium">La Cisterna, RM. ¡Vengan a vernos!</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <Phone className="w-5 h-5 text-secondary shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest">Llámanos con confianza</p>
                  <p className="text-xs text-white/60 font-medium">+56 9 1234 5678</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                <Mail className="w-5 h-5 text-secondary shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase tracking-widest">Correo del Hogar</p>
                  <p className="text-xs text-white/60 font-medium">hola@mydog.cl</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
              © 2024 DISTRIBUIDORA MYDOG - HECHO CON ❤️ EN SANTIAGO
            </p>
            <div className="flex justify-center md:justify-start gap-4 text-[9px] font-bold text-white/20 uppercase tracking-widest">
              <Link href="#" className="hover:text-white transition-colors">Términos y Condiciones</Link>
              <span className="opacity-50">•</span>
              <Link href="#" className="hover:text-white transition-colors">Privacidad</Link>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
            <div className="bg-white px-3 py-1.5 rounded-lg text-black font-sans font-black text-[10px] tracking-tighter">VISA</div>
            <div className="bg-white px-3 py-1.5 rounded-lg text-black font-sans font-black text-[10px] tracking-tighter">MASTERCARD</div>
            <div className="bg-white px-3 py-1.5 rounded-lg text-black font-sans font-black text-[10px] tracking-tighter">WEBPAY</div>
            <div className="bg-white px-3 py-1.5 rounded-lg text-black font-sans font-black text-[10px] tracking-tighter">TRANSBANK</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
