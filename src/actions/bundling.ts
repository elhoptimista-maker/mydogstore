"use server";

import { getSanitizedProducts } from "@/lib/services/catalog.service";
import { qualifiesForHealthySwitch, MARKET_INTELLIGENCE } from "@/lib/services/ranking.engine";
import { SanitizedProduct } from "@/types/product";

/**
 * @fileOverview Cerebro del Bundling Predictivo.
 * Busca complementos de alto sentimiento para el producto principal del carrito.
 * Implementa la "Regla de Saturación de Categoría" para evitar redundancias.
 */
export async function getBundleRecommendation(cartItems: any[]): Promise<SanitizedProduct | null> {
  if (!cartItems || cartItems.length === 0) return null;

  // REGLA ANTI-SATURACIÓN 1 (El Candado de Salud):
  // Si el carrito tiene algún producto que active el "Healthy Switch", abortamos el Bundling.
  // El cliente solo verá UNA recomendación a la vez para proteger su carga cognitiva.
  const needsSwitch = cartItems.some(item => qualifiesForHealthySwitch(item.brand));
  if (needsSwitch) return null;

  // 1. Identificamos el producto "Ancla" (el más caro)
  const anchorItem = [...cartItems].sort((a, b) => (b.priceAtAddition || 0) - (a.priceAtAddition || 0))[0];
  if (!anchorItem) return null;

  const cartProductIds = cartItems.map(item => item.id);
  
  // 2. EXTRAEMOS LAS CATEGORÍAS QUE YA ESTÁN EN EL CARRITO
  // Esto evitará que ofrezcamos Snacks si ya hay un Snack.
  const cartCategories = cartItems.map(item => item.category).filter(Boolean);

  const allProducts = await getSanitizedProducts();

  // 3. Buscamos complementos (Add-ons) válidos
  const candidates = allProducts.filter(p => 
    !cartProductIds.includes(p.id) && // Que no lo tenga ya en el carrito
    p.currentStock > 0 &&
    p.species === anchorItem.species && // Mismo animal (Perro/Gato)
    
    // REGLA ANTI-SATURACIÓN 2 (El Candado de Categoría):
    // El producto candidato NO debe pertenecer a ninguna categoría que ya esté en el carrito.
    !cartCategories.includes(p.category) && 
    
    (MARKET_INTELLIGENCE[p.brand?.toLowerCase()]?.sentiment || 0) >= 8 // Que sea un producto muy amado (Alta fidelidad)
  );

  if (candidates.length === 0) return null; // El carrito ya está perfectamente complementado. Silencio.

  // 4. Ordenamiento Estratégico: Mayor sentimiento primero, luego menor precio (facilita el impulso)
  const bestBundle = candidates.sort((a, b) => {
    const sentimentA = MARKET_INTELLIGENCE[a.brand?.toLowerCase()]?.sentiment || 0;
    const sentimentB = MARKET_INTELLIGENCE[b.brand?.toLowerCase()]?.sentiment || 0;
    
    if (sentimentB !== sentimentA) {
      return sentimentB - sentimentA; // Mayor sentimiento primero
    }
    return a.sellingPrice - b.sellingPrice; // Menor precio primero para facilitar el impulso
  })[0];

  return bestBundle;
}
