/**
 * @fileOverview Market Intelligence Service.
 * Centraliza el análisis competitivo y aplica la lógica de pesaje estratégico
 * para el catálogo de MyDog Store basado en el mercado chileno 2026.
 */

export interface BrandIntelligence {
  name: string;
  tier: string;
  traction: number;    // 1-10 (Tracción masiva / Volumen)
  sentiment: number;   // 1-10 (Lealtad / Confianza)
  quality: number;     // 1-5 (Calidad nutricional)
}

const BRAND_DB: Record<string, BrandIntelligence> = {
  // PERROS
  'PURINA ONE': { name: 'Purina One', tier: 'Super Premium', traction: 9, sentiment: 10, quality: 5 },
  'NOMADE': { name: 'Nomade', tier: 'Premium', traction: 10, sentiment: 9, quality: 4 },
  'NATURAL FOOD': { name: 'Natural Food', tier: 'Premium', traction: 8, sentiment: 9, quality: 4 },
  'APPETIT': { name: 'Appetit', tier: 'Premium', traction: 6, sentiment: 8, quality: 4 },
  'FIT FORMULA': { name: 'Fit Formula', tier: 'Premium', traction: 9, sentiment: 7, quality: 3.5 },
  'CHAMPION DOG': { name: 'Champion Dog', tier: 'Comercial', traction: 10, sentiment: 8, quality: 3 },
  'MASTER DOG': { name: 'Master Dog', tier: 'Comercial', traction: 10, sentiment: 8, quality: 3 },
  'DOG CHOW': { name: 'Dog Chow', tier: 'Comercial', traction: 9, sentiment: 7, quality: 3 },
  'PEDIGREE': { name: 'Pedigree', tier: 'Comercial', traction: 9, sentiment: 7, quality: 3 },
  'CANNES': { name: 'Cannes', tier: 'Comercial', traction: 8, sentiment: 6, quality: 2.5 },
  'MY DOG': { name: 'My Dog', tier: 'Comercial', traction: 7, sentiment: 6, quality: 2.5 },
  'DOKO': { name: 'Doko', tier: 'Económico', traction: 8, sentiment: 5, quality: 1.5 },
  'SABROKAN': { name: 'Sabrokan', tier: 'Económico', traction: 8, sentiment: 6, quality: 1.5 },
  'RAZA': { name: 'Raza', tier: 'Económico', traction: 7, sentiment: 5, quality: 1 },
  'TYSON': { name: 'Tyson', tier: 'Económico', traction: 7, sentiment: 5, quality: 1 },
  'CACIQUE': { name: 'Cacique', tier: 'Económico', traction: 5, sentiment: 4, quality: 1 },
  'CAN': { name: 'Can', tier: 'Económico', traction: 5, sentiment: 5, quality: 1 },
  'KNINO': { name: 'Knino', tier: 'Económico', traction: 5, sentiment: 5, quality: 1 },
  'LEROY': { name: 'Leroy', tier: 'Económico', traction: 5, sentiment: 5, quality: 1 },
  
  // GATOS
  'PURINA ONE (CAT)': { name: 'Purina One (Cat)', tier: 'Super Premium', traction: 9, sentiment: 10, quality: 5 },
  'FELIX': { name: 'Felix', tier: 'Comercial (H)', traction: 10, sentiment: 9, quality: 3 },
  'WHISKAS': { name: 'Whiskas', tier: 'Comercial', traction: 9, sentiment: 8, quality: 3 },
  'CHAMPION CAT': { name: 'Champion Cat', tier: 'Comercial', traction: 10, sentiment: 9, quality: 3 },
  'MASTER CAT': { name: 'Master CAT', tier: 'Comercial', traction: 10, sentiment: 8, quality: 3 },
  'CAT CHOW': { name: 'Cat Chow', tier: 'Comercial', traction: 9, sentiment: 7, quality: 3 },
  'GATI': { name: 'Gati', tier: 'Comercial/E', traction: 9, sentiment: 7, quality: 2 },
  'CUCHITO': { name: 'Cuchito', tier: 'Comercial/E', traction: 7, sentiment: 6, quality: 2 },
  'MICHI LOVE': { name: 'Michi Love', tier: 'Económico', traction: 5, sentiment: 5, quality: 1 },
  'MISIFUS': { name: 'Misifus', tier: 'Económico', traction: 5, sentiment: 5, quality: 1 },
  
  // COMPLEMENTOS
  'CHURU': { name: 'Churu', tier: 'Snack', traction: 10, sentiment: 10, quality: 5 },
  'SIMPARICA': { name: 'Simparica', tier: 'Pharma', traction: 10, sentiment: 10, quality: 5 },
  'DENTALIFE': { name: 'Dentalife', tier: 'Snack', traction: 9, sentiment: 9, quality: 4 },
  'DENTASTIX': { name: 'Dentastix', tier: 'Snack', traction: 9, sentiment: 9, quality: 4 },
  'EASY CLEAN': { name: 'Easy Clean', tier: 'Arena', traction: 9, sentiment: 8, quality: 4 },
  'BIO STONES': { name: 'Bio Stones', tier: 'Arena', traction: 6, sentiment: 9, quality: 5 }
};

/**
 * LÓGICA DE PRIORIDAD ESTRATÉGICA (The Strategic Pivot Logic)
 * Score = (Tracción * 0.4) + (Sentimiento * 0.4) + (Calidad * 0.2)
 */
export function getStrategicScore(brandName: string): number {
  const normalizedBrand = brandName.toUpperCase().replace(' (CAT)', '');
  const intel = BRAND_DB[normalizedBrand] || BRAND_DB[`${normalizedBrand} (CAT)`];
  
  if (!intel) return 5; // Puntaje base neutro

  // Escalamos calidad de 1-5 a 1-10 para normalizar
  const score = (intel.traction * 0.4) + (intel.sentiment * 0.4) + ((intel.quality * 2) * 0.2);
  return parseFloat(score.toFixed(2));
}

/**
 * Devuelve la prioridad estratégica detallada para un producto.
 */
export function getStrategicPriority(brandName: string) {
  const normalizedBrand = brandName.toUpperCase().replace(' (CAT)', '');
  const intel = BRAND_DB[normalizedBrand] || BRAND_DB[`${normalizedBrand} (CAT)`];
  
  if (!intel) return { score: 5, tier: 'Desconocido', quality: 2.5 };
  
  return {
    score: getStrategicScore(brandName),
    tier: intel.tier,
    quality: intel.quality,
    isHighTrust: intel.sentiment >= 8 && intel.traction >= 8
  };
}

export function getDynamicTags(brandName: string): string[] {
  const normalizedBrand = brandName.toUpperCase().replace(' (CAT)', '');
  const intel = BRAND_DB[normalizedBrand] || BRAND_DB[`${normalizedBrand} (CAT)`];
  const tags: string[] = [];

  if (!intel) return tags;

  if (intel.traction >= 9) tags.push('Líder en ventas');
  if (intel.sentiment >= 9) tags.push('El más querido');
  if (intel.quality >= 4.5) tags.push('Nutrición Pro');
  if (intel.tier.includes('Económico')) tags.push('Gran Precio');
  if (intel.tier.includes('Premium')) tags.push('Calidad Gold');

  return tags;
}

/**
 * THE HEALTHY SWITCH (Nudge Logic)
 * Sugiere una alternativa si la calidad actual es baja (< 2)
 */
export function getUpgradeSuggestion(currentBrand: string, species: string): string | null {
  const normalizedBrand = currentBrand.toUpperCase().replace(' (CAT)', '');
  const intel = BRAND_DB[normalizedBrand] || BRAND_DB[`${normalizedBrand} (CAT)`];

  if (!intel || intel.quality >= 2) return null;

  // Sugerencias basadas en especie y éxito local (Nomade es el pivot ideal en Chile)
  if (species.toLowerCase().includes('perro')) {
    return 'Nomade';
  }
  if (species.toLowerCase().includes('gato')) {
    return 'Nomade'; // Nomade también tiene línea gato muy fuerte en sentimiento
  }

  return 'Purina One';
}

/**
 * PREDICTIVE BUNDLING
 */
export function getBundleRecommendations(brandName: string): string[] {
  const normalizedBrand = brandName.toUpperCase();
  
  // Si compra Master Dog o Champion Dog (Alta Tracción Perro)
  if (normalizedBrand.includes('MASTER DOG') || normalizedBrand.includes('CHAMPION DOG')) {
    return ['Simparica', 'Dentastix'];
  }
  
  // Si compra marcas de Gato masivas
  if (normalizedBrand.includes('WHISKAS') || normalizedBrand.includes('FELIX')) {
    return ['Churu', 'Easy Clean'];
  }

  return [];
}
