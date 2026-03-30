import { SanitizedProduct } from "@/types/product";

/**
 * Distribuye los productos evitando que la misma marca monopolice los primeros lugares.
 * Utiliza un enfoque "Round-Robin" (repartición de cartas) agrupando por marca.
 * Preserva el orden interno de Smart Score dentro de cada marca.
 */
export function balanceCatalogByBrand(products: SanitizedProduct[]): SanitizedProduct[] {
  if (!products || products.length === 0) return [];

  // 1. Agrupar productos por marca (preservando el orden de Smart Score que ya traen)
  const brandBuckets: Record<string, SanitizedProduct[]> = {};
  
  products.forEach(p => {
    const brand = p.brand || 'Genérico';
    if (!brandBuckets[brand]) brandBuckets[brand] = [];
    brandBuckets[brand].push(p);
  });

  // 2. Ordenar las marcas por el Smart Score de su mejor producto disponible
  // Esto asegura que las marcas con mayor ranking estratégico tiren la "primera carta"
  const sortedBrands = Object.keys(brandBuckets).sort((a, b) => {
    const bestScoreA = brandBuckets[a][0]?.smartScore || 0;
    const bestScoreB = brandBuckets[b][0]?.smartScore || 0;
    return bestScoreB - bestScoreA;
  });

  // 3. Repartir productos uno a uno desde cada balde (Round-Robin) hasta vaciarlos todos
  const balancedCatalog: SanitizedProduct[] = [];
  const workingBuckets = { ...brandBuckets };
  let itemsRemaining = true;

  while (itemsRemaining) {
    itemsRemaining = false;
    
    for (const brand of sortedBrands) {
      if (workingBuckets[brand].length > 0) {
        // Extraemos el primer elemento (el de mayor score de esa marca)
        balancedCatalog.push(workingBuckets[brand].shift()!);
        itemsRemaining = true; // Todavía tenemos productos por distribuir
      }
    }
  }

  return balancedCatalog;
}
