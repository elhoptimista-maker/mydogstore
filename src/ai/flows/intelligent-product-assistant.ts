'use server';
/**
 * @fileOverview Un asesor de ventas familiar experto en bienestar animal mejorado con IA.
 * Implementa lógica de ranking estratégico (Smart Score) y upselling nutricional.
 *
 * - productChat - Función que maneja el proceso de asesoría.
 * - ProductChatInput - Tipo de entrada para la conversación.
 * - ProductChatOutput - Tipo de salida enriquecida con datos reales del producto.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getSanitizedProducts } from '@/lib/services/catalog.service';
import { calculateSmartScore, MARKET_INTELLIGENCE } from '@/lib/services/ranking.engine';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  recommendedIds: z.array(z.string()).optional().describe('IDs de productos recomendados para evitar repeticiones.'),
});

const ProductChatInputSchema = z.object({
  species: z.string().describe('Especie de la mascota.'),
  history: z.array(MessageSchema).describe('Historial de la charla.'),
  message: z.string().describe('Mensaje actual del usuario.'),
});

export type ProductChatInput = z.infer<typeof ProductChatInputSchema>;

/**
 * El LLM ahora solo se encarga de la lógica de selección y la narrativa.
 * Los datos sensibles (precios, imágenes) se inyectan en el servidor post-generación.
 */
const ProductChatOutputSchema = z.object({
  response: z.string().describe('Respuesta empática del asistente.'),
  suggestedProducts: z.array(z.object({
    id: z.string().describe('ID del producto en el catálogo.'),
    reason: z.string().describe('Razón técnica y emocional del por qué este producto es ideal.'),
  })).optional().describe('Selecciona estrictamente de 1 a 4 productos que resuelvan el problema.'),
});

export type ProductChatOutput = z.infer<typeof ProductChatOutputSchema>;

const productChatPrompt = ai.definePrompt({
  name: 'productChatPrompt',
  input: {schema: ProductChatInputSchema.extend({
    catalog: z.array(z.any()).describe('Catálogo filtrado y ordenado por relevancia.'),
  })},
  output: {schema: ProductChatOutputSchema},
  prompt: `Eres un Asesor Experto de Distribuidora MyDog, un negocio familiar con 15 años de trayectoria en Santiago.

  TU MISIÓN Y REGLAS DE ORO (CRÍTICO):
  1. ERES EXPERTO NUTRICIONAL: Tienes acceso a la "Calidad Nutricional" de las marcas en el catálogo adjunto.
  2. SECRETO PROFESIONAL (PROHIBIDO LEAK DE DATOS): NUNCA menciones los números de calidad (ej. "calidad 3", "nivel 4", "calidad 2.5") ni el "Smart Score". Traduce esos números a lenguaje natural comercial: "Alimento Comercial", "Gama Media", "Premium" o "Súper Premium".
  3. VARIEDAD CONVERSACIONAL: Si el usuario presiona "Más económicos" o pide rebajar el precio múltiples veces, NO repitas tu discurso anterior. Adapta tu respuesta reconociendo que seguimos ajustando el bolsillo (Ej: "Ajustemos aún más el cinturón...", "Revisemos las opciones más accesibles que nos van quedando...").
  4. THE HEALTHY SWITCH: Si recomiendas algo muy económico (Calidad 1 o 2), advierte con empatía que cumple lo básico, pero SIEMPRE intenta poner una alternativa Premium a la par para comparar, explicando por qué a la larga sale a cuenta.
  5. PROHIBIDO: No escribas precios, ni nombres exactos de productos, ni IDs en tu 'response'. El sistema armará las tarjetas visuales por ti.

  CATÁLOGO DISPONIBLE (Ordenado por Relevancia Estratégica):
  {{#each catalog}}
  - ID: {{id}} | Nombre: {{name}} | Marca: {{brand}} | Categoría: {{category}} | Calidad Nutricional (1-5): {{quality}} | Score Mercado: {{smartScore}}
  {{/each}}

  HISTORIAL:
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}

  MENSAJE DEL USUARIO:
  {{{message}}}

  Responde basándote en tu experiencia de 15 años en nuestra bodega familiar.`,
});

const productChatFlow = ai.defineFlow(
  {
    name: 'productChatFlow',
    inputSchema: ProductChatInputSchema,
    outputSchema: z.any(), // Devolvemos el objeto enriquecido para el frontend
  },
  async (input) => {
    // 1. Obtener productos activos y con stock
    const allProducts = (await getSanitizedProducts()).filter(p => p.currentStock > 0);
    
    // 2. Extraer productos ya recomendados
    const previouslyRecommendedIds = new Set<string>();
    input.history.forEach(m => {
      if (m.recommendedIds) m.recommendedIds.forEach(id => previouslyRecommendedIds.add(id));
    });

    // 3. Filtrado por especie
    const speciesCatalog = allProducts.filter(p => {
      return p.species.toLowerCase().includes(input.species.toLowerCase()) ||
             input.species.toLowerCase().includes(p.species.toLowerCase());
    });

    // 4. Algoritmo de Ranking Estratégico (CRO)
    const userMessageLower = input.message.toLowerCase();
    const searchTerms = userMessageLower.split(' ').filter(t => t.length > 2);
    
    const rankedCatalog = speciesCatalog.map(p => {
      let score = 0;
      const brandLower = p.brand?.toLowerCase() || '';
      const productText = `${p.name} ${p.brand} ${p.category} ${p.short_description}`.toLowerCase();
      
      // Match textual
      if (userMessageLower.includes(brandLower) && brandLower.length > 3) score += 300;
      searchTerms.forEach(term => {
        if (productText.includes(term)) score += 50;
      });

      // Inteligencia Comercial (Favorecer productos estrella)
      const smartScore = calculateSmartScore(p.brand);
      score += (smartScore * 10);
      
      const metrics = MARKET_INTELLIGENCE[brandLower];
      const quality = metrics?.quality || 2.5;

      // Penalización por repetición
      if (previouslyRecommendedIds.has(p.id)) score -= 2000; 
      
      return { ...p, score, quality, smartScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 40);

    // 5. Llamada al LLM
    const {output} = await productChatPrompt({
      ...input,
      catalog: rankedCatalog,
    });

    if (!output) {
      throw new Error('Error al generar respuesta del asesor.');
    }

    // 6. Mapeo Final Enriquecido (Evita alucinaciones del bot)
    const enrichedRecommendations = (output.suggestedProducts || []).map(rec => {
      const fullProduct = allProducts.find(p => p.id === rec.id);
      if (!fullProduct) return null;
      return {
        ...fullProduct,
        reason: rec.reason
      };
    }).filter(Boolean);

    return {
      response: output.response,
      suggestedProducts: enrichedRecommendations
    };
  }
);

export async function productChat(input: ProductChatInput) {
  return productChatFlow(input);
}
