'use server';

/**
 * @fileOverview Server Actions para el catálogo de productos.
 * Implementa lógica de filtrado avanzada en el servidor sobre datos cacheados.
 * Integra el balanceador de marcas para una vitrina diversificada.
 */

import { getSanitizedProducts, getSanitizedProductBySlug, getSanitizedProductById } from "@/lib/services/catalog.service";
import { balanceCatalogByBrand } from "@/lib/utils/catalog-balancer";
import { SanitizedProduct } from "@/types/product";

/**
 * Obtiene la lista completa de productos (Desde Caché).
 */
export async function fetchAllProducts(): Promise<SanitizedProduct[]> {
  return await getSanitizedProducts();
}

/**
 * Obtiene un producto por su Slug.
 */
export async function fetchProductBySlug(slug: string): Promise<SanitizedProduct | null> {
  return await getSanitizedProductBySlug(slug);
}

/**
 * Obtiene un producto por su ID.
 */
export async function fetchProductById(id: string): Promise<SanitizedProduct | null> {
  return await getSanitizedProductById(id);
}

/**
 * ACCIÓN PRINCIPAL DE FILTRADO
 * Supera las limitaciones de Firestore realizando el filtrado en memoria sobre el catálogo cacheado.
 */
export async function fetchFilteredCatalog(searchParams: { [key: string]: string | string[] | undefined }) {
  // 1. Obtenemos el catálogo completo (Instántaneo gracias al cache del servidor)
  // Ya viene ordenado por Smart Score desde el servicio base
  const allProducts = (await getSanitizedProducts()).filter(p => p.currentStock > 0);
  let filtered = [...allProducts];

  // Helper para normalizar parámetros que vienen de Next.js searchParams
  const getParam = (key: string) => {
    const val = searchParams[key];
    return Array.isArray(val) ? val[0] : val;
  };

  // 2. Extraer Parámetros
  const q = getParam('q')?.toLowerCase();
  const categoria = getParam('categoria')?.split(',').filter(Boolean);
  const marca = getParam('marca')?.split(',').filter(Boolean);
  const especie = getParam('especie')?.split(',').filter(Boolean);
  const sort = getParam('sort') || 'default';
  const minPrice = parseInt(getParam('minPrice') || '0');
  const maxPrice = parseInt(getParam('maxPrice') || '999999');
  
  const page = parseInt(getParam('page') || '1');
  const limit = parseInt(getParam('limit') || '25');

  // 3. Aplicar Búsqueda Textual
  if (q) {
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.brand.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  }

  // 4. Aplicar Filtros Múltiples
  if (categoria && categoria.length > 0) {
    filtered = filtered.filter(p => categoria.includes(p.category));
  }
  if (marca && marca.length > 0) {
    filtered = filtered.filter(p => marca.includes(p.brand));
  }
  if (especie && especie.length > 0) {
    filtered = filtered.filter(p => especie.includes(p.species));
  }

  // 5. Aplicar Rango de Precio
  if (minPrice > 0 || maxPrice < 999999) {
    filtered = filtered.filter(p => p.sellingPrice >= minPrice && p.sellingPrice <= maxPrice);
  }

  // 6. Ordenamiento y Balanceo Magistral
  if (sort === 'price-asc') {
    filtered.sort((a, b) => a.sellingPrice - b.sellingPrice);
  } else if (sort === 'price-desc') {
    filtered.sort((a, b) => b.sellingPrice - a.sellingPrice);
  } else if (sort === 'default') {
    // MAGIA COMERCIAL: Si el orden es por relevancia, intercalamos las marcas 
    // para evitar el "efecto muro" y mejorar la percepción de variedad.
    filtered = balanceCatalogByBrand(filtered);
  }

  // 7. Paginación
  const totalCount = filtered.length;
  const totalPages = Math.ceil(totalCount / limit);
  const startIndex = (page - 1) * limit;
  const paginatedProducts = filtered.slice(startIndex, startIndex + limit);

  return {
    products: paginatedProducts,
    totalCount,
    totalPages,
    currentPage: page,
    limit
  };
}
