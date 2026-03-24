
'use server';

/**
 * @fileOverview Server Actions para el catálogo de productos.
 * Expone de forma segura las funciones de lectura del catálogo al cliente.
 */

import { getSanitizedProducts, getSanitizedProductBySlug, getSanitizedProductById } from "@/lib/services/catalog.service";
import { SanitizedProduct } from "@/types/product";

/**
 * Obtiene la lista completa de productos sanitizados.
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
 * Obtiene un producto por su ID (Necesario para procesos internos como Wishlist).
 */
export async function fetchProductById(id: string): Promise<SanitizedProduct | null> {
  return await getSanitizedProductById(id);
}
