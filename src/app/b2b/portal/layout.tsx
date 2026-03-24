import { ReactNode } from 'react';

/**
 * @fileOverview Layout especial para el Portal B2B.
 * Este layout NO incluye el Header estándar del ecommerce retail para evitar 
 * conflictos visuales y de navegación entre los dos modelos de negocio.
 */
export default function B2BPortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F6F6F6]">
      {/* 
        Ocultamos el Header global del ecommerce que tiene el id "global-header".
        Así evitamos ocultar el header propio del portal B2B.
      */}
      <style dangerouslySetInnerHTML={{ __html: `
        #global-header { display: none !important; }
        #global-main { padding-top: 0 !important; }
      `}} />
      <div className="flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
}
