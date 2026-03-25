/**
 * @fileOverview Servicio de Catálogo para la lectura y sanitización de productos del ERP.
 * Implementa 'unstable_cache' para optimizar lecturas y permitir filtrado complejo en el servidor.
 */

import { getErpDbAdmin } from "@/lib/firebase/erp-admin";
import { SanitizedProduct } from "@/types/product";
import { unstable_cache } from 'next/cache';

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
 * No debe usarse directamente en componentes para evitar costos excesivos.
 */
async function getSanitizedProductsRaw(): Promise<SanitizedProduct[]> {
  try {
    const db = getErpDbAdmin();
    const productsSnap = await db.collection("products")
      .where("active", "==", true)
      .get();

    if (!productsSnap || productsSnap.empty) return [];

    // Obtenemos todo el inventario de una vez para evitar N+1 queries
    const inventorySnap = await db.collection("inventory").get();
    const inventoryMap = new Map();
    // Corregido: Se añade tipo 'any' explícito al documento para evitar TS7006
    inventorySnap.forEach((doc: any) => inventoryMap.set(doc.id, doc.data().physical_qty || 0));

    const sanitizedProducts = productsSnap.docs.map((doc: any) => {
      const data = doc.data();
      const currentStock = inventoryMap.get(doc.id) || 0;
      const netCost = data.financials?.cost || 0;

      return {
        id: doc.id,
        name: data.name || "Producto sin nombre",
        sku: data.sku || "N/A",
        slug: data.slug || data.metadata?.slug || doc.id,
        brand: data.attributes?.brand || "Genérico",
        category: data.attributes?.category || "Varios",
        species: data.attributes?.species || "Mascotas",
        life_stage: data.attributes?.life_stage || "Adulto",
        flavor: data.attributes?.flavor,
        weight_kg: data.attributes?.weight_kg || 0,
        short_description: data.content?.short_description || "",
        main_image: data.media?.main_image || "https://picsum.photos/seed/placeholder/600/600",
        currentStock,
        sellingPrice: calculateCommercialPrice(netCost),
        wholesalePrice: calculateWholesalePrice(netCost)
      } as SanitizedProduct;
    });

    return sanitizedProducts;
  } catch (error: any) {
    console.error("[CatalogService] Error fetching products:", error.message);
    return [];
  }
}

/**
 * VERSIÓN CACHEADA DEL CATÁLOGO.
 * Revalida cada 1 hora. Esta es la base para el filtrado en el servidor.
 */
export const getSanitizedProducts = unstable_cache(
  async () => getSanitizedProductsRaw(),
  ['all-products-catalog'],
  { revalidate: 3600, tags: ['catalog'] }
);

/**
 * Obtiene un único producto buscando por SLUG o ID.
 */
export async function getSanitizedProductBySlug(slugOrId: string): Promise<SanitizedProduct | null> {
  try {
    const db = getErpDbAdmin();
    
    const querySnap = await db.collection("products")
      .where("slug", "==", slugOrId)
      .limit(1)
      .get();

    let doc;
    if (!querySnap.empty) {
      doc = querySnap.docs[0];
    } else {
      const queryLegacySnap = await db.collection("products")
        .where("metadata.slug", "==", slugOrId)
        .limit(1)
        .get();
      
      if (!queryLegacySnap.empty) {
        doc = queryLegacySnap.docs[0];
      } else {
        const directDoc = await db.collection("products").doc(slugOrId).get();
        if (directDoc.exists) {
          doc = directDoc;
        } else {
          return null;
        }
      }
    }

    const data = doc.data()!;
    const inventoryDoc = await db.collection("inventory").doc(doc.id).get();
    const currentStock = inventoryDoc.exists ? (inventoryDoc.data()?.physical_qty || 0) : 0;
    const netCost = data.financials?.cost || 0;

    return {
      id: doc.id,
      name: data.name || "Producto sin nombre",
      sku: data.sku || "N/A",
      slug: data.slug || data.metadata?.slug || doc.id,
      brand: data.attributes?.brand || "",
      category: data.attributes?.category || "",
      species: data.attributes?.species || "",
      life_stage: data.attributes?.life_stage || "",
      flavor: data.attributes?.flavor,
      weight_kg: data.attributes?.weight_kg || 0,
      short_description: data.content?.short_description || "",
      main_image: data.media?.main_image || "",
      currentStock,
      sellingPrice: calculateCommercialPrice(netCost),
      wholesalePrice: calculateWholesalePrice(netCost)
    } as SanitizedProduct;
  } catch (error: any) {
    return null;
  }
}

/**
 * Lógica de negocio para encontrar productos similares basada en atributos técnicos estrictos.
 */
export async function getRelatedProducts(baseProduct: SanitizedProduct, limit: number = 15): Promise<SanitizedProduct[]> {
  const allProducts = await getSanitizedProducts();
  
  return allProducts
    .filter(p => p.id !== baseProduct.id && p.currentStock > 0)
    .filter(p => p.species === baseProduct.species) 
    .map(p => {
      let score = 0;
      const pLifeStage = p.life_stage.toLowerCase();
      const currentLifeStage = baseProduct.life_stage.toLowerCase();

      const isCachorro = currentLifeStage.includes('cachorro');
      const isAdultoSenior = currentLifeStage.includes('adulto') || currentLifeStage.includes('senior');

      if (isCachorro && (pLifeStage.includes('adulto') || pLifeStage.includes('senior'))) {
        score -= 100;
      } else if (isAdultoSenior && pLifeStage.includes('cachorro')) {
        score -= 100;
      } else if (pLifeStage === currentLifeStage) {
        score += 20; 
      }

      if (p.category === baseProduct.category) score += 10;
      if (p.brand === baseProduct.brand) score += 5;

      return { ...p, similarityScore: score };
    })
    .filter(p => (p as any).similarityScore > 0)
    .sort((a, b) => (b as any).similarityScore - (a as any).similarityScore)
    .slice(0, limit);
}

export async function getSanitizedProductById(id: string): Promise<SanitizedProduct | null> {
  return await getSanitizedProductBySlug(id);
}
