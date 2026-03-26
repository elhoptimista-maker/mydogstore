"use client";

import { useState, useEffect } from 'react';
import { getCachedShippingRates } from '@/actions/shipping';

/**
 * @fileOverview Hook para gestionar las tarifas de despacho dinámicas en el cliente.
 * Implementa lógica de normalización para asegurar coincidencias exactas.
 */
export function useShippingRates() {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const erpRates = await getCachedShippingRates();
        setRates(erpRates);
      } catch (error) {
        console.error("[useShippingRates] Error cargando tarifas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRates();
  }, []);

  /**
   * Busca la tarifa para una comuna específica aplicando normalización.
   */
  const getRateForComuna = (comuna?: string | null) => {
    if (!comuna) return null;
    
    // Normalizamos el término de búsqueda (ej: "Maipú" -> "maipu")
    const normalizedSearch = comuna
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    // Retorna el precio específico o el default del ERP
    return rates[normalizedSearch] !== undefined 
      ? rates[normalizedSearch] 
      : (rates['default'] || 3500);
  };

  return { rates, getRateForComuna, isLoading };
}
