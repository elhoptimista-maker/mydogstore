/**
 * @fileOverview Servicio de Catálogo para la lectura y sanitización de productos del ERP.
 * Implementa la regla de negocio del 30% de margen y cruce de inventario.
 * Regla de Oro: Nunca exponer costos ni integraciones externas en el objeto de retorno.
 */

import { getErpAdminDb } from "@/lib/firebase/erp-admin";
import { SanitizedProduct } from "@/types/product";

/**
 * Calcula un precio de venta comercial basado en el costo neto.
 * Aplica el margen del 30% y redondea al "90" más cercano para minimizar la desviación del margen.
 */
function calculateCommercialPrice(netCost: number): number {
  if (!netCost || netCost <= 0) return 0;

  // 1. Aplicar margen de utilidad del 30%
  // Fórmula: Precio Venta = Costo / (1 - Margen)
  const basePrice = netCost / (1 - 0.30);

  // 2. Lógica de Redondeo al 90 más cercano
  // Esto asegura que el precio termine en 90 (estética retail) 
  // pero sin alejarse más de $60 del cálculo original.
  if (basePrice < 1000) {
    // Para precios muy bajos, simplemente redondeamos a la unidad
    return Math.round(basePrice);
  }

  // Redondeamos a la centena más cercana y restamos 10
  // Ej: 46.049 -> (460) * 100 - 10 = 45.990
  // Ej: 46.060 -> (461) * 100 - 10 = 46.090
  return Math.round(basePrice / 100) * 100 - 10;
}

/**
 * Obtiene la lista de productos activos, calcula precios y sanitiza la salida.
 */
export async function getSanitizedProducts(): Promise<SanitizedProduct[]> {
  const db = getErpAdminDb();
  
  try {
    // 1. Obtener productos activos (Regla: active == true)
    const productsSnap = await db.collection("products")
      .where("active", "==", true)
      .get();

    if (productsSnap.empty) return [];

    // 2. Procesar cada producto con su inventario y lógica financiera
    const sanitizedProducts = await Promise.all(
      productsSnap.docs.map(async (doc) => {
        const data = doc.data();
        
        // Consultar stock en colección inventory (ID documento == ID producto)
        const inventoryDoc = await db.collection("inventory").doc(doc.id).get();
        const currentStock = inventoryDoc.exists ? (inventoryDoc.data()?.physical_qty || 0) : 0;

        // Mapeo y Sanitización Estricta
        return {
          id: doc.id,
          name: data.metadata?.name || "Producto sin nombre",
          sku: data.metadata?.sku || "N/A",
          slug: data.metadata?.slug || doc.id,
          brand: data.attributes?.brand || "Genérico",
          category: data.attributes?.category || "Varios",
          species: data.attributes?.species || "Mascotas",
          life_stage: data.attributes?.life_stage || "Adulto",
          flavor: data.attributes?.flavor,
          weight_kg: data.attributes?.weight_kg || 0,
          short_description: data.content?.short_description || "",
          main_image: data.media?.main_image || "https://picsum.photos/seed/placeholder/600/600",
          currentStock,
          sellingPrice: calculateCommercialPrice(data.financials?.cost?.net || 0)
        } as SanitizedProduct;
      })
    );

    return sanitizedProducts;
  } catch (error) {
    console.error("CatalogService Error:", error);
    return [];
  }
}

/**
 * Obtiene un único producto por su ID con datos sanitizados y cálculo de margen.
 */
export async function getSanitizedProductById(id: string): Promise<SanitizedProduct | null> {
  const db = getErpAdminDb();
  
  try {
    const doc = await db.collection("products").doc(id).get();
    if (!doc.exists) return null;

    const data = doc.data()!;
    const inventoryDoc = await db.collection("inventory").doc(doc.id).get();
    const currentStock = inventoryDoc.exists ? (inventoryDoc.data()?.physical_qty || 0) : 0;

    return {
      id: doc.id,
      name: data.metadata?.name || "",
      sku: data.metadata?.sku || "",
      slug: data.metadata?.slug || doc.id,
      brand: data.attributes?.brand || "",
      category: data.attributes?.category || "",
      species: data.attributes?.species || "",
      life_stage: data.attributes?.life_stage || "",
      flavor: data.attributes?.flavor,
      weight_kg: data.attributes?.weight_kg || 0,
      short_description: data.content?.short_description || "",
      main_image: data.media?.main_image || "",
      currentStock,
      sellingPrice: calculateCommercialPrice(data.financials?.cost?.net || 0)
    } as SanitizedProduct;
  } catch (error) {
    return null;
  }
}
