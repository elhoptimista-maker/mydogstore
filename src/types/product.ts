/**
 * @fileOverview Definición de tipos para productos sanitizados.
 * Asegura que solo los datos necesarios y seguros lleguen al cliente.
 */

export interface SanitizedProduct {
  id: string;
  name: string;
  sku: string;
  slug: string;
  brand: string;
  category: string;
  species: string;
  life_stage: string;
  flavor?: string;
  weight_kg: number;
  short_description: string;
  main_image: string;
  currentStock: number;
  sellingPrice: number;
  wholesalePrice: number;
  // Inteligencia de Mercado (The Strategic Pivot Logic)
  smartScore: number;
  tags: string[];
}
