/**
 * @fileOverview Servicio de Catálogo para la lectura y sanitización de productos del ERP.
 * Implementa la regla de negocio del 30% de margen y cruce de inventario.
 */

import { getErpDbAdmin } from "@/lib/firebase/erp-admin";
import { SanitizedProduct } from "@/types/product";

/**
 * Calcula un precio de venta comercial basado en el costo neto.
 * Margen del 30% sobre el costo neto.
 */
function calculateCommercialPrice(netCost: number): number {
  if (!netCost || netCost <= 0) return 0;
  const basePrice = netCost / (1 - 0.30);
  return Math.round(basePrice / 100) * 100 - 10;
}

/**
 * Calcula el precio mayorista basado en el costo neto.
 * Aplicamos un margen menor (ej. 15%) o simplemente un recargo fijo sobre el neto.
 * Para este ejemplo, usaremos un margen del 15%.
 */
function calculateWholesalePrice(netCost: number): number {
  if (!netCost || netCost <= 0) return 0;
  const basePrice = netCost / (1 - 0.15);
  return Math.round(basePrice / 10) * 10; // Redondeo más fino para mayoristas
}

/**
 * Obtiene la lista de productos activos, calcula precios y sanitiza la salida.
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
        const inventoryDoc = await db.collection("inventory").doc(doc.id).get();
        const currentStock = inventoryDoc.exists ? (inventoryDoc.data()?.physical_qty || 0) : 0;

        const productName = data.name || data.metadata?.name || data.metadata?.title || "Producto sin nombre";
        const netCost = data.financials?.cost?.net || 0;

        return {
          id: doc.id,
          name: productName,
          sku: data.metadata?.sku || data.sku || "N/A",
          slug: data.metadata?.slug || doc.id,
          brand: data.attributes?.brand || "Genérico",
          category: data.attributes?.category || "Varios",
          species: data.attributes?.species || "Mascotas",
          life_stage: data.attributes?.life_stage || "Adulto",
          flavor: data.attributes?.flavor,
          weight_kg: data.attributes?.weight_kg || 0,
          short_description: data.content?.short_description || data.description || "",
          main_image: data.media?.main_image || data.image || "https://picsum.photos/seed/placeholder/600/600",
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
 * Obtiene un único producto por su ID.
 */
export async function getSanitizedProductById(id: string): Promise<SanitizedProduct | null> {
  try {
    const db = getErpDbAdmin();
    const doc = await db.collection("products").doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    const inventoryDoc = await db.collection("inventory").doc(doc.id).get();
    const currentStock = inventoryDoc.exists ? (inventoryDoc.data()?.physical_qty || 0) : 0;

    const productName = data.name || data.metadata?.name || data.metadata?.title || "Producto sin nombre";
    const netCost = data.financials?.cost?.net || 0;

    return {
      id: doc.id,
      name: productName,
      sku: data.metadata?.sku || data.sku || "",
      slug: data.metadata?.slug || doc.id,
      brand: data.attributes?.brand || "",
      category: data.attributes?.category || "",
      species: data.attributes?.species || "",
      life_stage: data.attributes?.life_stage || "",
      flavor: data.attributes?.flavor,
      weight_kg: data.attributes?.weight_kg || 0,
      short_description: data.content?.short_description || data.description || "",
      main_image: data.media?.main_image || data.image || "",
      currentStock,
      sellingPrice: calculateCommercialPrice(netCost),
      wholesalePrice: calculateWholesalePrice(netCost)
    } as SanitizedProduct;
  } catch (error: any) {
    console.error(`[CatalogService] Error fetching product ${id}:`, error.message);
    return null;
  }
}
