
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
   * IMPORTANTE: El texto inicial debe coincidir con el pre-renderizado del servidor
   * para evitar el error de hidratación de Next.js. El mensaje amable se activa
   * inmediatamente después del montaje en el cliente.
   */
  return (
    <div className="h-10 bg-accent text-accent-foreground flex items-center px-4 md:px-8 text-[10px] font-bold uppercase tracking-widest border-b border-black/5">
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center gap-4">
        {/* Lado Izquierdo: Mensaje Amable con truncado para evitar overlap en móvil */}
        <div className="flex-1 min-w-0">
          <span className="select-none truncate block">
            {mounted 
              ? "¡Hola! Despacho gratis sobre $50.000 en toda la RM 🚚" 
              : "Envíos gratis sobre $50.000 🚚"
            }
          </span>
        </div>
        
        {/* Lado Derecho: Enlaces de Contacto y Redes (Protegidos con shrink-0) */}
        {mounted && (
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 animate-in fade-in duration-500">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-70 transition-opacity flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Hablemos</span>
            </a>
            <a 
              href="https://www.instagram.com/mydog_distribuidora" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:opacity-70 transition-opacity flex items-center gap-1.5"
            >
              <Instagram className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Instagram</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
