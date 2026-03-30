"use server";

import { getSanitizedProducts } from "@/lib/services/catalog.service";
import { qualifiesForHealthySwitch, MARKET_INTELLIGENCE } from "@/lib/services/ranking.engine";
import { SanitizedProduct } from "@/types/product";

/**
 * @fileOverview Cerebro del Bundling Predictivo.
 * Busca complementos de alto sentimiento para el producto principal del carrito.
 */
export async function getBundleRecommendation(cartItems: any[]): Promise<SanitizedProduct | null> {
  if (!cartItems || cartItems.length === 0) return null;

  // REGLA ANTI-SATURACIÓN (El Candado):
  // Si el carrito tiene algún producto que active el "Healthy Switch", abortamos el Bundling.
  // El cliente solo verá UNA recomendación a la vez para proteger su carga cognitiva.
  const needsSwitch = cartItems.some(item => qualifiesForHealthySwitch(item.brand));
  if (needsSwitch) return null;

  // 1. Identificamos el producto "Ancla" (Suele ser el alimento base, el de mayor precio)
  const anchorItem = [...cartItems].sort((a, b) => b.priceAtAddition - a.priceAtAddition)[0];
  if (!anchorItem) return null;

  const cartProductIds = cartItems.map(item => item.id);
  const allProducts = await getSanitizedProducts();

  // 2. Buscamos complementos (Add-ons) válidos
  const candidates = allProducts.filter(p => 
    !cartProductIds.includes(p.id) && // Que no lo tenga ya en el carrito
    p.currentStock > 0 &&
    p.species === anchorItem.species && // Mismo animal (Perro/Gato)
    p.category !== anchorItem.category && // DIFERENTE categoría (Si compró alimento, ofrecemos Snack o Farmacia)
    (MARKET_INTELLIGENCE[p.brand?.toLowerCase()]?.sentiment || 0) >= 8 // Que sea un producto muy amado (Alta fidelidad)
  );

  if (candidates.length === 0) return null;

  // 3. Ordenamiento Estratégico: Mayor sentimiento primero, luego menor precio (facilita el impulso)
  const bestBundle = candidates.sort((a, b) => {
    const sentimentA = MARKET_INTELLIGENCE[a.brand?.toLowerCase()]?.sentiment || 0;
    const sentimentB = MARKET_INTELLIGENCE[b.brand?.toLowerCase()]?.sentiment || 0;
    
    if (sentimentB !== sentimentA) {
      return sentimentB - sentimentA; // Mayor sentimiento primero
    }
    return a.sellingPrice - b.sellingPrice; // Menor precio primero
  })[0];

  return bestBundle;
}
