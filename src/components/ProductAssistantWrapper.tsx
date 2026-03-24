"use client";

import { usePathname } from 'next/navigation';
import ProductAssistant from './ProductAssistant';

export default function ProductAssistantWrapper() {
  const pathname = usePathname();

  // Ocultar el asistente en rutas específicas
  // Esto incluye /cuenta, /b2b, /checkout y cualquier otra ruta que empiece con ellas
  const excludedRoutes = ['/cuenta', '/b2b', '/checkout'];
  
  const isExcluded = excludedRoutes.some(route => 
    pathname === route || pathname?.startsWith(`${route}/`)
  );

  // El asistente solo es visible en Home, Catalogo y Detalle de producto
  // No necesitamos asistent de ventas en el portal B2B ni en el Checkout
  if (isExcluded) {
    return null;
  }

  return <ProductAssistant />;
}
