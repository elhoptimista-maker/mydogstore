"use server";

import { getErpDbAdmin } from '@/lib/firebase/erp-admin';
import { unstable_cache } from 'next/cache';

/**
 * @fileOverview Server Action para recuperar y cachear las tarifas de despacho desde el ERP.
 */

/**
 * Obtiene las comunas desde map_communes y construye un diccionario de tarifas optimizado.
 */
export const getCachedShippingRates = unstable_cache(
  async () => {
    const db = getErpDbAdmin();
    const rates: Record<string, number> = {};

    try {
      // Acceso directo a la colección del proyecto ERP
      const snapshot = await db.collection('map_communes').get();
      
      if (!snapshot || snapshot.empty) {
        return { 'default': 3500 };
      }

      snapshot.forEach((doc: any) => {
        const data = doc.data();
        const communeName = data.name || doc.id;
        
        // Si no existe shippingPrice definido, usamos un fallback de 3500
        const cost = typeof data.shippingPrice === 'number' ? data.shippingPrice : 3500;

        if (communeName) {
          // Normalización para evitar errores por tildes o mayúsculas en la búsqueda
          const normalizedName = communeName
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");
            
          rates[normalizedName] = cost;
        }
      });

      return Object.keys(rates).length > 0 ? rates : { 'default': 3500 };
    } catch (error: any) {
      console.error('[ShippingAction] Error obteniendo tarifas del ERP:', error.message);
      return { 'default': 3500 };
    }
  },
  ['erp-shipping-rates-map'], 
  { revalidate: 3600, tags: ['shipping', 'catalog'] }
);
