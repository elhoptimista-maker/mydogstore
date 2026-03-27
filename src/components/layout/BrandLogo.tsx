"use client";

import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import LogoImg from '@/img/imagotipo.png';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'footer' | 'b2b' | 'mobile';
  title?: string;
  subtext?: string;
  href?: string;
}

/**
 * @fileOverview Componente central de Identidad de Marca MyDog.
 * Centraliza el imagotipo circular y la tipografía corporativa.
 */
export default function BrandLogo({ 
  className, 
  size = 'md', 
  variant = 'light',
  title,
  subtext,
  href = "/"
}: BrandLogoProps) {
  
  // Mapeo de dimensiones para el contenedor circular
  const containerSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10 md:w-12 md:h-12",
    lg: "w-14 h-14",
    xl: "w-20 h-20"
  };

  const titleSizes = {
    sm: "text-base",
    md: "text-lg md:text-2xl",
    lg: "text-2xl",
    xl: "text-3xl"
  };

  const subtextSizes = {
    sm: "text-[6px]",
    md: "text-[7px] md:text-[9px]",
    lg: "text-[9px]",
    xl: "text-[10px]"
  };

  // Configuración por defecto según variante
  const config = {
    light: {
      title: title || "MyDog",
      subtext: subtext || "Distribuidora",
      titleColor: "text-white",
      subtextColor: "text-white/60"
    },
    footer: {
      title: title || "MyDog Distribuidora",
      subtext: subtext || "15 años cuidando a tu mascota",
      titleColor: "text-white",
      subtextColor: "text-secondary"
    },
    b2b: {
      title: title || "MyDog",
      subtext: subtext || "B2B Portal",
      titleColor: "text-white",
      subtextColor: "text-secondary"
    },
    mobile: {
      title: title || "Mi MyDog",
      subtext: subtext || "¡Hola! Qué gusto verte",
      titleColor: "text-white",
      subtextColor: "text-secondary"
    }
  }[variant];

  return (
    <Link href={href} className={cn("flex items-center gap-1.5 shrink-0 group", className)}>
      <div className={cn(
        "rounded-full flex items-center justify-center group-hover:scale-110 transition-transform relative overflow-hidden",
        containerSizes[size]
      )}>
        <Image 
          src={LogoImg} 
          alt="MyDog" 
          fill 
          className="object-contain p-1.5 md:p-2"
          sizes="100px"
          priority
        />
      </div>
      <div className="flex flex-col -space-y-1">
        <span className={cn(
          "font-black tracking-tighter leading-none uppercase",
          config.titleColor,
          titleSizes[size]
        )}>
          {config.title}
        </span>
        <span className={cn(
          "font-bold uppercase tracking-[0.2em]",
          config.subtextColor,
          subtextSizes[size]
        )}>
          {config.subtext}
        </span>
      </div>
    </Link>
  );
}
