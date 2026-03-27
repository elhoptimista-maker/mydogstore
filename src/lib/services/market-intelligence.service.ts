/**
 * @fileOverview Market Intelligence Service.
 * Centraliza el análisis competitivo y aplica la lógica de pesaje estratégico
 * para el catálogo de MyDog Store basado en el mercado chileno 2026.
 */

export interface BrandIntelligence {
  name: string;
  tier: 'Super Premium' | 'Premium' | 'Comercial' | 'Comercial (H)' | 'Comercial/E' | 'Económico' | 'Licencia' | 'Pharma' | 'Snack' | 'Higiene' | 'Arena';
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
  
  // GATOS
  'FELIX': { name: 'Felix', tier: 'Comercial (H)', traction: 10, sentiment: 9, quality: 3 },
  'WHISKAS': { name: 'Whiskas', tier: 'Comercial', traction: 9, sentiment: 8, quality: 3 },
  'CHAMPION CAT': { name: 'Champion Cat', tier: 'Comercial', traction: 10, sentiment: 9, quality: 3 },
  'MASTER CAT': { name: 'Master Cat', tier: 'Comercial', traction: 10, sentiment: 8, quality: 3 },
  'CAT CHOW': { name: 'Cat Chow', tier: 'Comercial', traction: 9, sentiment: 7, quality: 3 },
  'CHURU': { name: 'Churu', tier: 'Snack', traction: 10, sentiment: 10, quality: 5 },
  
  // COMPLEMENTOS
  'SIMPARICA': { name: 'Simparica', tier: 'Pharma', traction: 10, sentiment: 10, quality: 5 },
  'DENTALIFE': { name: 'Dentalife', tier: 'Snack', traction: 9, sentiment: 9, quality: 4 },
  'EASY CLEAN': { name: 'Easy Clean', tier: 'Arena', traction: 9, sentiment: 8, quality: 4 },
  'BIO STONES': { name: 'Bio Stones', tier: 'Arena', traction: 6, sentiment: 9, quality: 5 }
};

export function getStrategicScore(brandName: string): number {
  const normalizedBrand = brandName.toUpperCase();
  const intel = BRAND_DB[normalizedBrand];
  
  if (!intel) return 5; // Puntaje base para marcas no mapeadas

  // FÓRMULA: Tracción (0.4) + Sentimiento (0.3) + Margen/Calidad (0.3)
  // Calidad se normaliza a 10 (quality * 2)
  const score = (intel.traction * 0.4) + (intel.sentiment * 0.3) + ((intel.quality * 2) * 0.3);
  return parseFloat(score.toFixed(2));
}

export function getDynamicTags(brandName: string): string[] {
  const normalizedBrand = brandName.toUpperCase();
  const intel = BRAND_DB[normalizedBrand];
  const tags: string[] = [];

  if (!intel) return tags;

  if (intel.traction >= 9) tags.push('Líder en ventas');
  if (intel.sentiment >= 9) tags.push('El más querido');
  if (intel.quality >= 4.5) tags.push('Nutrición Pro');
  if (intel.tier.includes('Económico')) tags.push('Gran Precio');
  if (intel.tier === 'Super Premium') tags.push('Calidad Gold');

  return tags;
}

export function getIntelligentCrossSell(currentBrand: string): string | null {
  const normalizedBrand = currentBrand.toUpperCase();
  const intel = BRAND_DB[normalizedBrand];

  if (!intel) return null;

  // LÓGICA DE MEJORA DE SALUD (Upselling Inteligente)
  // Si busca masivo, sugerimos uno de mejor sentimiento/calidad
  if (intel.tier === 'Comercial' || intel.tier === 'Económico') {
    if (intel.traction >= 8) {
      // Sugerencia de valor: Nomade o Purina One
      return 'Nomade';
    }
  }

  // Si busca snack estándar, sugerimos Churu
  if (intel.tier === 'Snack' && intel.name !== 'Churu') {
    return 'Churu';
  }

  return null;
}
