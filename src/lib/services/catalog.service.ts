/**
 * @fileOverview Servicio de Catálogo para la lectura y sanitización de productos del ERP.
 * Adaptado a la arquitectura v2 del ERP.
 */

import { getErpDbAdmin } from "@/lib/firebase/erp-admin";
import { SanitizedProduct } from "@/types/product";

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
 * Obtiene la lista de productos activos del ERP.
 */
export async function getSanitizedProducts(): Promise<SanitizedProduct[]> {
  try {
    const db = getErpDbAdmin();
    const productsSnap = await db.collection("products")
      .where("active", "==", true)
      .get();

    if (!productsSnap || productsSnap.empty) return [];

    const sanitizedProducts = await Promise.all(
      productsSnap.docs.map(async (doc: any) => {
        const data = doc.data();
        
        // Consultar inventario
        const inventoryDoc = await db.collection("inventory").doc(doc.id).get();
        const currentStock = inventoryDoc.exists ? (inventoryDoc.data()?.physical_qty || 0) : 0;

        const netCost = data.financials?.cost || 0;

        // DEBUG: Verificar presencia de slug en logs del servidor
        if (!data.slug) {
           console.warn(`⚠️ Producto ${doc.id} (${data.name}) no tiene SLUG en la raíz.`);
        }

        return {
          id: doc.id,
          name: data.name || "Producto sin nombre",
          sku: data.sku || "N/A",
          slug: data.slug || data.metadata?.slug || doc.id, // Intentamos raíz, luego metadata, luego ID
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
      })
    );

    return sanitizedProducts;
  } catch (error: any) {
    console.error("[CatalogService] Error fetching products:", error.message);
    return [];
  }
}

/**
 * Obtiene un único producto buscando por SLUG o ID.
 */
export async function getSanitizedProductBySlug(slugOrId: string): Promise<SanitizedProduct | null> {
  try {
    const db = getErpDbAdmin();
    
    // 1. Intentar buscar por el campo slug (raíz)
    const querySnap = await db.collection("products")
      .where("slug", "==", slugOrId)
      .limit(1)
      .get();

    let doc;
    if (!querySnap.empty) {
      doc = querySnap.docs[0];
    } else {
      // 2. Fallback: Intentar buscar por slug dentro de metadata (arquitectura antigua)
      const queryLegacySnap = await db.collection("products")
        .where("metadata.slug", "==", slugOrId)
        .limit(1)
        .get();
      
      if (!queryLegacySnap.empty) {
        doc = queryLegacySnap.docs[0];
      } else {
        // 3. Fallback: Intentar buscar por ID directo
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
    console.error(`[CatalogService] Error fetching product slug ${slugOrId}:`, error.message);
    return null;
  }
}

/**
 * Mantenemos getSanitizedProductById para procesos internos.
 */
export async function getSanitizedProductById(id: string): Promise<SanitizedProduct | null> {
  return await getSanitizedProductBySlug(id);
}
