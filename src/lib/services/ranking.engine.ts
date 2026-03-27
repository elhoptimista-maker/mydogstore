/**
 * @fileOverview Motor de Eficiencia de Góndola Digital (Market Intelligence)
 * Calcula la visibilidad de los productos basándose en Tracción, Sentimiento y Calidad.
 */

export interface BrandMetrics {
  traction: number;   // Volumen de búsqueda/compra (1-10)
  sentiment: number;  // Lealtad y percepción del cliente (1-10)
  quality: number;    // Calidad nutricional objetiva (1-5)
}

// Base de Datos Maestra de Marcas en Chile
export const MARKET_INTELLIGENCE: Record<string, BrandMetrics> = {
  "purina one": { traction: 9, sentiment: 10, quality: 5 },
  "nomade": { traction: 10, sentiment: 9, quality: 4 },
  "natural food": { traction: 8, sentiment: 9, quality: 4 },
  "fit formula": { traction: 9, sentiment: 7, quality: 3.5 },
  "champion dog": { traction: 10, sentiment: 8, quality: 3 },
  "champion cat": { traction: 10, sentiment: 8, quality: 3 },
  "master dog": { traction: 10, sentiment: 8, quality: 3 },
  "master cat": { traction: 10, sentiment: 8, quality: 3 },
  "churu": { traction: 10, sentiment: 10, quality: 5 },
  "felix": { traction: 10, sentiment: 9, quality: 3 },
  "simparica": { traction: 10, sentiment: 10, quality: 5 },
  "easy clean": { traction: 9, sentiment: 8, quality: 4 },
  "dog chow": { traction: 9, sentiment: 7, quality: 3 },
  "cat chow": { traction: 9, sentiment: 7, quality: 3 },
  "whiskas": { traction: 9, sentiment: 8, quality: 3 },
  "cannes": { traction: 8, sentiment: 6, quality: 2.5 },
  "doko": { traction: 8, sentiment: 5, quality: 1.5 },
  "sabrokan": { traction: 8, sentiment: 6, quality: 1.5 },
  "bio stones": { traction: 6, sentiment: 9, quality: 5 },
  "raza": { traction: 7, sentiment: 5, quality: 1 },
  "tyson": { traction: 7, sentiment: 5, quality: 1 },
};

/**
 * Aplica la fórmula algorítmica: S = (T * 0.4) + (L * 0.4) + (C * 0.2)
 * Retorna un valor numérico para ordenar el catálogo.
 */
export function calculateSmartScore(brandName?: string): number {
  if (!brandName) return 0;
  
  const normalizedBrand = brandName.toLowerCase().trim();
  const metrics = MARKET_INTELLIGENCE[normalizedBrand];

  // Si la marca no está mapeada, le damos un puntaje neutral (Tier Medio)
  if (!metrics) {
    return (5 * 0.4) + (5 * 0.4) + (2.5 * 0.2); // Score por defecto: 4.5
  }

  return (metrics.traction * 0.4) + (metrics.sentiment * 0.4) + (metrics.quality * 0.2);
}

/**
 * Detecta si el producto califica para una campaña de "Nudge Marketing" (The Healthy Switch).
 * Retorna true si la calidad de la marca es menor a 2.
 */
export function qualifiesForHealthySwitch(brandName?: string): boolean {
  if (!brandName) return false;
  const normalizedBrand = brandName.toLowerCase().trim();
  const metrics = MARKET_INTELLIGENCE[normalizedBrand];
  
  return metrics ? metrics.quality < 2 : false;
}
