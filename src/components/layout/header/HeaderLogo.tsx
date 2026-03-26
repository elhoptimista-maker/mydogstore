"use client";

import Link from 'next/link';
import { Dog } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderLogoProps {
  className?: string;
}

/**
 * @fileOverview Componente atómico de identidad de marca.
 */
export default function HeaderLogo({ className }: HeaderLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 shrink-0 group", className)}>
      <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg backdrop-blur-sm group-hover:scale-110 transition-transform">
        <Dog className="w-6 h-6 md:w-8 md:h-8 text-white" />
      </div>
      <div className="flex flex-col -space-y-1">
        <span className="font-black text-lg md:text-2xl tracking-tighter leading-none uppercase text-white">MyDog</span>
        <span className="text-[7px] md:text-[9px] font-bold text-white/60 uppercase tracking-[0.2em]">Distribuidora</span>
      </div>
    </Link>
  );
}
