"use client";

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import LogoImg from '@/img/imagotipo.png';

interface HeaderLogoProps {
  className?: string;
}

/**
 * @fileOverview Componente atómico de identidad de marca.
 * Reemplazado icono por imagotipo oficial optimizado.
 */
export default function HeaderLogo({ className }: HeaderLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 shrink-0 group", className)}>
      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform relative overflow-hidden">
        <Image 
          src={LogoImg} 
          alt="MyDog" 
          fill 
          className="object-contain p-1.5"
          sizes="(max-width: 768px) 40px, 48px"
          priority
        />
      </div>
      <div className="flex flex-col -space-y-1">
        <span className="font-black text-lg md:text-2xl tracking-tighter leading-none uppercase text-white">MyDog</span>
        <span className="text-[7px] md:text-[9px] font-bold text-white/60 uppercase tracking-[0.2em]">Distribuidora</span>
      </div>
    </Link>
  );
}
