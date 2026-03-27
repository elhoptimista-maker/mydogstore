"use server";

import { getSanitizedProducts } from "@/lib/services/catalog.service";
import { qualifiesForHealthySwitch, MARKET_INTELLIGENCE } from "@/lib/services/ranking.engine";
import { SanitizedProduct } from "@/types/product";

/**
 * @fileOverview Server Action refinado para encontrar recomendaciones de mejora nutricional.
 * Implementa un "Upsell Progresivo" buscando el producto premium más cercano al presupuesto del cliente.
 */
export async function getUpgradeRecommendation(cartItems: any[]): Promise<{ originalItem: any, upgradeProduct: SanitizedProduct } | null> {
  // 1. ANTI-SPAM: Buscamos UN SOLO producto en el carrito que necesite un "Upgrade".
  // Al usar .find(), toma el primero y no agobia al cliente con múltiples banners.
  const itemToUpgrade = cartItems.find(item => qualifiesForHealthySwitch(item.brand));
  
  if (!itemToUpgrade) return null;

  // Extraemos los IDs que ya están en el carrito para no sugerirlos de nuevo (ANTI-DUPLICIDAD)
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
    !qualifiesForHealthySwitch(p.brand) && // Que NO sea otra marca de baja calidad
    (MARKET_INTELLIGENCE[p.brand?.toLowerCase()]?.quality || 0) >= 3 // Que sea calidad Premium o superior
  );

  if (candidates.length === 0) return null;

  // 4. EL SALTO LÓGICO (Upsell Progresivo)
  // En lugar de tomar el de mayor puntaje absoluto, tomamos el producto de mejor 
  // calidad que tenga el precio MÁS CERCANO al presupuesto actual del cliente.
  const originalPrice = itemToUpgrade.priceAtAddition || itemToUpgrade.price || 0;

  const bestUpgrade = candidates.sort((a, b) => {
    // Calculamos la distancia en pesos entre el original y el candidato
    const diffA = Math.abs(a.sellingPrice - originalPrice);
    const diffB = Math.abs(b.sellingPrice - originalPrice);
    
    // El candidato con la menor diferencia de precio queda en la posición [0]
    return diffA - diffB;
  })[0]; 

  return {
    originalItem: itemToUpgrade,
    upgradeProduct: bestUpgrade
  };
}
