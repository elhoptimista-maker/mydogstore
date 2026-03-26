"use client";

import { useState, useEffect } from 'react';
import { MessageCircle, Instagram } from 'lucide-react';

/**
 * @fileOverview Franja superior del Header.
 * Implementa un patrón de hidratación segura para evitar discrepancias entre servidor y cliente.
 * Mantiene el tono amable, familiar y responsable de MyDog 2.0.
 */
export default function TopBar() {
  const [mounted, setMounted] = useState(false);
  const whatsappUrl = `https://wa.me/56912345678`;

  // useEffect solo se ejecuta en el cliente después del montaje inicial
  useEffect(() => {
    setMounted(true);
  }, []);

  /**
   * Renderizamos el contenedor raíz con las mismas clases en servidor y cliente.
   * El contenido interno se muestra solo tras el montaje para evitar errores de hidratación
   * causados por discrepancias de texto o caché del entorno.
   */
  return (
    <div className="h-10 bg-accent text-accent-foreground flex items-center px-4 md:px-8 text-[10px] font-bold uppercase tracking-widest border-b border-black/5">
      <div className="max-w-7xl mx-auto w-full flex justify-center items-center relative">
        {mounted ? (
          <>
            <div className="flex items-center gap-2">
              <span className="select-none">¡Hola! Despacho gratis sobre $50.000 en toda la RM 🚚</span>
            </div>
            
            <div className="absolute right-0 flex items-center gap-4">
              <a 
                href={whatsappUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-70 transition-opacity flex items-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Hablemos</span>
              </a>
              <a 
                href="https://www.instagram.com/mydog_distribuidora" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-70 transition-opacity flex items-center gap-1.5"
              >
                <Instagram className="w-4 h-4" />
                <span className="hidden sm:inline">Instagram</span>
              </a>
            </div>
          </>
        ) : (
          // Placeholder invisible pero con espacio para evitar Layout Shift
          <div className="opacity-0">¡Hola! Despacho gratis sobre $50.000 en toda la RM 🚚</div>
        )}
      </div>
    </div>
  );
}
