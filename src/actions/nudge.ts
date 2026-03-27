"use server";

import { getSanitizedProducts } from "@/lib/services/catalog.service";
import { qualifiesForHealthySwitch, MARKET_INTELLIGENCE } from "@/lib/services/ranking.engine";
import { SanitizedProduct } from "@/types/product";

/**
 * @fileOverview Server Action refinado para encontrar recomendaciones de mejora nutricional.
 * Implementa un "Upsell Progresivo" con conciencia de formato (peso).
 */
export async function getUpgradeRecommendation(cartItems: any[]): Promise<{ originalItem: any, upgradeProduct: SanitizedProduct } | null> {
  // 1. ANTI-SPAM: Buscamos UN SOLO producto en el carrito que necesite un "Upgrade".
  const itemToUpgrade = cartItems.find(item => qualifiesForHealthySwitch(item.brand));
  
  if (!itemToUpgrade) return null;

  // Extraemos los IDs que ya están en el carrito para no sugerirlos de nuevo
  const cartProductIds = cartItems.map(item => item.id);

  // 2. Traemos todo el catálogo cacheado
  const allProducts = await getSanitizedProducts();

  // 3. Filtramos buscando candidatos válidos
  const candidates = allProducts.filter(p => 
    p.id !== itemToUpgrade.id &&
    !cartProductIds.includes(p.id) && 
    p.currentStock > 0 &&
    p.species === itemToUpgrade.species && 
    p.life_stage === itemToUpgrade.life_stage && 
    p.category === itemToUpgrade.category && 
    !qualifiesForHealthySwitch(p.brand) && 
    (MARKET_INTELLIGENCE[p.brand?.toLowerCase()]?.quality || 0) >= 3
  );

  if (candidates.length === 0) return null;

  const originalPrice = itemToUpgrade.priceAtAddition || itemToUpgrade.price || 0;
  const originalWeight = itemToUpgrade.weight_kg || 1;

  // 4. ORDENAMIENTO DE PRECISIÓN: Formato (Peso) primero, Precio después.
  const bestUpgrade = candidates.sort((a, b) => {
    const weightA = a.weight_kg || 1;
    const weightB = b.weight_kg || 1;

    // Diferencia absoluta en Kilos (Ej: 25kg vs 18kg = 7. 25kg vs 3kg = 22)
    const weightDiffA = Math.abs(weightA - originalWeight);
    const weightDiffB = Math.abs(weightB - originalWeight);

    // Diferencia absoluta en Precio
    const priceDiffA = Math.abs(a.sellingPrice - originalPrice);
    const priceDiffB = Math.abs(b.sellingPrice - originalPrice);

    // Penalizamos fuertemente las diferencias de peso (factor 10.000).
    // Esto asegura que el algoritmo siempre prefiera formatos similares.
    return (weightDiffA * 10000 + priceDiffA) - (weightDiffB * 10000 + priceDiffB);
  })[0]; 

  return {
    originalItem: itemToUpgrade,
    upgradeProduct: bestUpgrade
  };
}
