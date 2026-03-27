"use server";

import { getSanitizedProducts } from "@/lib/services/catalog.service";
import { qualifiesForHealthySwitch, MARKET_INTELLIGENCE } from "@/lib/services/ranking.engine";
import { SanitizedProduct } from "@/types/product";

/**
 * @fileOverview Server Action para encontrar recomendaciones de mejora nutricional.
 * Busca productos premium que coincidan con la especie, categoría y etapa de vida del producto actual.
 */
export async function getUpgradeRecommendation(cartItems: any[]): Promise<{ originalItem: any, upgradeProduct: SanitizedProduct } | null> {
  // 1. Buscamos si hay algún producto en el carrito que necesite un "Upgrade"
  const itemToUpgrade = cartItems.find(item => qualifiesForHealthySwitch(item.brand));
  
  if (!itemToUpgrade) return null;

  // 2. Traemos todo el catálogo cacheado
  const allProducts = await getSanitizedProducts();

  // 3. Filtramos buscando el candidato perfecto (¡Ahora con filtro de categoría!)
  const candidates = allProducts.filter(p => 
    p.id !== itemToUpgrade.id &&
    p.currentStock > 0 &&
    p.species === itemToUpgrade.species && // Mismo animal (Perro/Gato)
    p.life_stage === itemToUpgrade.life_stage && // Misma etapa (Cachorro/Adulto)
    p.category === itemToUpgrade.category && // <-- CORRECCIÓN: Misma categoría (Alimento Seco = Alimento Seco)
    !qualifiesForHealthySwitch(p.brand) && // Que NO sea otra marca de baja calidad
    (MARKET_INTELLIGENCE[p.brand?.toLowerCase()]?.quality || 0) >= 3 // Que sea calidad Premium o superior
  );

  if (candidates.length === 0) return null;

  // 4. Elegimos el que tenga el mejor Smart Score
  const bestUpgrade = candidates.sort((a, b) => {
    const scoreDiff = (b.smartScore || 0) - (a.smartScore || 0);
    return scoreDiff;
  })[0]; 

  return {
    originalItem: itemToUpgrade,
    upgradeProduct: bestUpgrade
  };
}
