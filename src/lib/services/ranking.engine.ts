/**
 * @fileOverview Motor de Eficiencia de Góndola Digital (Market Intelligence)
 * Calcula la visibilidad de los productos basándose en Tracción, Sentimiento y Calidad.
 */

export interface BrandMetrics {
  traction: number;   // Volumen de búsqueda/compra (1-10)
  sentiment: number;  // Lealtad y percepción del cliente (1-10)
  quality: number;    // Calidad nutricional objetiva (1-5)
  tier: string;
}

// Base de Datos Maestra de Marcas en Chile 2026
export const MARKET_INTELLIGENCE: Record<string, BrandMetrics> = {
  // PERROS
  "purina one": { traction: 9, sentiment: 10, quality: 5, tier: "Super Premium" },
  "nomade": { traction: 10, sentiment: 9, quality: 4, tier: "Premium" },
  "natural food": { traction: 8, sentiment: 9, quality: 4, tier: "Premium" },
  "appetit": { traction: 6, sentiment: 8, quality: 4, tier: "Premium" },
  "fit formula": { traction: 9, sentiment: 7, quality: 3.5, tier: "Premium" },
  "champion dog": { traction: 10, sentiment: 8, quality: 3, tier: "Comercial" },
  "master dog": { traction: 10, sentiment: 8, quality: 3, tier: "Comercial" },
  "dog chow": { traction: 9, sentiment: 7, quality: 3, tier: "Comercial" },
  "pedigree": { traction: 9, sentiment: 7, quality: 3, tier: "Comercial" },
  "cannes": { traction: 8, sentiment: 6, quality: 2.5, tier: "Comercial" },
  "my dog": { traction: 7, sentiment: 6, quality: 2.5, tier: "Comercial" },
  "doko": { traction: 8, sentiment: 5, quality: 1.5, tier: "Económico" },
  "sabrokan": { traction: 8, sentiment: 6, quality: 1.5, tier: "Económico" },
  "raza": { traction: 7, sentiment: 5, quality: 1, tier: "Económico" },
  "tyson": { traction: 7, sentiment: 5, quality: 1, tier: "Económico" },
  "cacique": { traction: 5, sentiment: 4, quality: 1, tier: "Económico" },
  "roquita": { traction: 5, sentiment: 4, quality: 1, tier: "Económico" },
  "can": { traction: 5, sentiment: 5, quality: 1, tier: "Económico" },
  "knino": { traction: 5, sentiment: 5, quality: 1, tier: "Económico" },
  "leroy": { traction: 5, sentiment: 5, quality: 1, tier: "Económico" },

  // GATOS
  "purina one (cat)": { traction: 9, sentiment: 10, quality: 5, tier: "Super Premium" },
  "fit formula (cat)": { traction: 8, sentiment: 8, quality: 4, tier: "Premium" },
  "felix": { traction: 10, sentiment: 9, quality: 3, tier: "Comercial" },
  "whiskas": { traction: 9, sentiment: 8, quality: 3, tier: "Comercial" },
  "champion cat": { traction: 10, sentiment: 9, quality: 3, tier: "Comercial" },
  "master cat": { traction: 10, sentiment: 8, quality: 3, tier: "Comercial" },
  "cat chow": { traction: 9, sentiment: 7, quality: 3, tier: "Comercial" },
  "gati": { traction: 9, sentiment: 7, quality: 2, tier: "Comercial" },
  "cuchito": { traction: 7, sentiment: 6, quality: 2, tier: "Comercial" },
  "easy clean": { traction: 9, sentiment: 8, quality: 4, tier: "Premium" },
  "bio stones": { traction: 6, sentiment: 9, quality: 5, tier: "Premium" },
  "churu": { traction: 10, sentiment: 10, quality: 5, tier: "Super Premium" },
  "simparica": { traction: 10, sentiment: 10, quality: 5, tier: "Super Premium" },
  "dentastix": { traction: 9, sentiment: 9, quality: 4, tier: "Premium" },
  "dentalife": { traction: 9, sentiment: 9, quality: 4, tier: "Premium" }
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

  // Normalizamos calidad de 1-5 a 1-10 para la fórmula
  return (metrics.traction * 0.4) + (metrics.sentiment * 0.4) + ((metrics.quality * 2) * 0.2);
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

/**
 * Genera etiquetas dinámicas basadas en el rendimiento de mercado.
 */
export function getStrategicTags(brandName?: string): string[] {
  if (!brandName) return [];
  const normalizedBrand = brandName.toLowerCase().trim();
  const metrics = MARKET_INTELLIGENCE[normalizedBrand];
  if (!metrics) return [];

  const tags: string[] = [];
  if (metrics.traction >= 9) tags.push("Líder en ventas");
  if (metrics.sentiment >= 9) tags.push("El más querido");
  if (metrics.quality >= 4.5) tags.push("Nutrición Pro");
  
  return tags;
}
