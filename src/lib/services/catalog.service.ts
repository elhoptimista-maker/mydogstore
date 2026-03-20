/**
 * @fileOverview Servicio de Catálogo para la lectura y sanitización de productos del ERP.
 * Implementa la regla de negocio del 30% de margen y cruce de inventario.
 */

import { getErpDbAdmin } from "@/lib/firebase/erp-admin";
import { SanitizedProduct } from "@/types/product";

/**
 * Calcula un precio de venta comercial basado en el costo neto.
 */
function calculateCommercialPrice(netCost: number): number {
  if (!netCost || netCost <= 0) return 0;
  const basePrice = netCost / (1 - 0.30);
  return Math.round(basePrice / 100) * 100 - 10;
}

/**
 * Obtiene la lista de productos activos, calcula precios y sanitiza la salida.
 */
export async function getSanitizedProducts(): Promise<SanitizedProduct[]> {
  const db = getErpDbAdmin();
  
  try {
    const productsSnap = await db.collection("products")
      .where("active", "==", true)
      .get();

    if (productsSnap.empty) return [];

    const sanitizedProducts = await Promise.all(
      productsSnap.docs.map(async (doc) => {
        const data = doc.data();
        const inventoryDoc = await db.collection("inventory").doc(doc.id).get();
        const currentStock = inventoryDoc.exists ? (inventoryDoc.data()?.physical_qty || 0) : 0;

        const productName = data.name || data.metadata?.name || data.metadata?.title || "Producto sin nombre";

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
          sellingPrice: calculateCommercialPrice(data.financials?.cost?.net || 0)
        } as SanitizedProduct;
      })
    );

    return sanitizedProducts;
  } catch (error) {
    return [];
  }
}

/**
 * Obtiene un único producto por su ID.
 */
export async function getSanitizedProductById(id: string): Promise<SanitizedProduct | null> {
  const db = getErpDbAdmin();
  
  try {
    const doc = await db.collection("products").doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    const inventoryDoc = await db.collection("inventory").doc(doc.id).get();
    const currentStock = inventoryDoc.exists ? (inventoryDoc.data()?.physical_qty || 0) : 0;

    const productName = data.name || data.metadata?.name || data.metadata?.title || "Producto sin nombre";

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
      sellingPrice: calculateCommercialPrice(data.financials?.cost?.net || 0)
    } as SanitizedProduct;
  } catch (error) {
    return null;
  }
}
