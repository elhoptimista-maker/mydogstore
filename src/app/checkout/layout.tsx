import { ReactNode } from 'react';

/**
 * @fileOverview Layout especial para el Checkout.
 * Modifica el comportamiento del header global para que se desplace con el scroll,
 * permitiendo que la barra de "Checkout Seguro" tome su lugar en la parte superior.
 * También oculta el footer para evitar distracciones.
 */
export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      {/* 
        Convertimos el header global de 'fixed' a 'absolute'.
        Esto hace que el header principal se desplace hacia arriba naturalmente 
        cuando el usuario hace scroll, y permite que la barra de checkout 
        (que es 'sticky top-0') "empuje" al header y se quede anclada.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        #global-header > header { 
          position: absolute !important; 
        }
        footer { 
          display: none !important; 
        }
      `}} />
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
