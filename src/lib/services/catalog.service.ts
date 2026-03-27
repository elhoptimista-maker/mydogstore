/**
 * @fileOverview Servicio de Catálogo para la lectura y sanitización de productos del ERP.
 * Implementa 'unstable_cache' e integra el motor de ranking inteligente.
 */

import { getErpDbAdmin } from "@/lib/firebase/erp-admin";
import { SanitizedProduct } from "@/types/product";
import { unstable_cache } from 'next/cache';
import { calculateSmartScore } from "@/lib/services/ranking.engine";
import { getDynamicTags, getUpgradeSuggestion, getBundleRecommendations } from "./market-intelligence.service";

/**
 * Calcula un precio de venta comercial basado en el costo bruto.
 */
function calculateCommercialPrice(netCost: number): number {
  if (!netCost || netCost <= 0) return 0;
  const basePrice = netCost / (1 - 0.30);
  return Math.round(basePrice / 100) * 100 - 10;
}

/**
 * Calcula el precio mayorista basado en el costo bruto.
 */
function calculateWholesalePrice(netCost: number): number {
  if (!netCost || netCost <= 0) return 0;
  const basePrice = netCost / (1 - 0.15);
  return Math.round(basePrice / 10) * 10;
}

/**
 * Función cruda de obtención de datos desde Firestore (ERP).
 */
async function getSanitizedProductsRaw(): Promise<SanitizedProduct[]> {
  try {
    const db = getErpDbAdmin();
    const productsSnap = await db.collection("products")
      .where("active", "==", true)
      .get();

    if (!productsSnap || productsSnap.empty) return [];

    const inventorySnap = await db.collection("inventory").get();
    const inventoryMap = new Map();
    inventorySnap.forEach((doc: any) => inventoryMap.set(doc.id, doc.data().physical_qty || 0));

    const sanitizedProducts = productsSnap.docs.map((doc: any) => {
      const data = doc.data();
      const currentStock = inventoryMap.get(doc.id) || 0;
      const netCost = data.financials?.cost || 0;
      const brand = data.attributes?.brand || "Genérico";
      const species = data.attributes?.species || "Mascotas";

      // Calculamos el Smart Score dinámicamente usando nuestra matriz
      const smartScore = calculateSmartScore(brand);

      return {
        id: doc.id,
        name: data.name || "Producto sin nombre",
        sku: data.sku || "N/A",
        slug: data.slug || data.metadata?.slug || doc.id,
        brand,
        category: data.attributes?.category || "Varios",
        species,
        life_stage: data.attributes?.life_stage || "Adulto",
        flavor: data.attributes?.flavor,
        weight_kg: data.attributes?.weight_kg || 0,
        short_description: data.content?.short_description || "",
        main_image: data.media?.main_image || "https://picsum.photos/seed/placeholder/600/600",
        currentStock,
        sellingPrice: calculateCommercialPrice(netCost),
        wholesalePrice: calculateWholesalePrice(netCost),
        smartScore,
        tags: getDynamicTags(brand),
        upgradeSuggestion: getUpgradeSuggestion(brand, species),
        bundleRecommendations: getBundleRecommendations(brand)
      } as SanitizedProduct;
    });

    // ORDENAMIENTO MAGISTRAL:
    // 1. Productos con mayor Smart Score van primero (Visibilidad estratégica).
    // 2. Si tienen el mismo score, el que tiene stock físico gana.
    return sanitizedProducts.sort((a, b) => {
       const scoreDiff = (b.smartScore || 0) - (a.smartScore || 0);
       if (scoreDiff !== 0) return scoreDiff;
       
       const aInStock = a.currentStock > 0 ? 1 : 0;
       const bInStock = b.currentStock > 0 ? 1 : 0;
       return bInStock - aInStock;
    });
  } catch (error: any) {
    console.error("[CatalogService] Error fetching products:", error.message);
    return [];
  }
}

export const getSanitizedProducts = unstable_cache(
  async () => getSanitizedProductsRaw(),
  ['all-products-catalog'],
  { revalidate: 3600, tags: ['catalog'] }
);

export async function getSanitizedProductBySlug(slugOrId: string): Promise<SanitizedProduct | null> {
  const allProducts = await getSanitizedProducts();
  return allProducts.find(p => p.slug === slugOrId || p.id === slugOrId) || null;
}

export async function getRelatedProducts(baseProduct: SanitizedProduct, limit: number = 15): Promise<SanitizedProduct[]> {
  const allProducts = await getSanitizedProducts();
  
  return allProducts
    .filter(p => p.id !== baseProduct.id && p.currentStock > 0)
    .filter(p => p.species === baseProduct.species) 
    .map(p => {
      let score = 0;
      // Bonus por puntaje estratégico
      score += p.smartScore * 10;

      const pLifeStage = p.life_stage.toLowerCase();
      const currentLifeStage = baseProduct.life_stage.toLowerCase();

      if (pLifeStage === currentLifeStage) score += 20; 
      if (p.category === baseProduct.category) score += 10;
      if (p.brand === baseProduct.brand) score += 5;

      // Bundle predictivo: Bonus si es una recomendación para la marca base
      if (baseProduct.bundleRecommendations?.includes(p.brand)) {
        score += 50;
      }

      return { ...p, similarityScore: score };
    })
    .filter(p => (p as any).similarityScore > 0)
    .sort((a, b) => (b as any).similarityScore - (a as any).similarityScore)
    .slice(0, limit);
}

export async function getSanitizedProductById(id: string): Promise<SanitizedProduct | null> {
  return await getSanitizedProductBySlug(id);
}
