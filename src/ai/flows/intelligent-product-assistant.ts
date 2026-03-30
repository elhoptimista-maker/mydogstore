'use server';
/**
 * @fileOverview Un asesor consultivo experto en bienestar animal mejorado con IA.
 * Implementa lógica de diagnóstico (Discovery), conciencia de carrito y quick replies.
 *
 * - productChat - Función que maneja el proceso de asesoría.
 * - ProductChatInput - Tipo de entrada para la conversación.
 * - ProductChatOutput - Tipo de salida enriquecida.
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
  cartContext: z.array(z.object({
    name: z.string(),
    category: z.string(),
    price: z.number()
  })).optional().describe('Contenido actual del carrito del usuario.'),
});

export type ProductChatInput = z.infer<typeof ProductChatInputSchema>;

/**
 * El LLM genera la respuesta, las sugerencias de respuesta y los productos.
 */
const ProductChatOutputSchema = z.object({
  response: z.string().describe('Respuesta empática y breve del asistente.'),
  quickReplies: z.array(z.string()).max(4).describe('Genera de 2 a 4 botones de respuesta rápida (máx 3 palabras).'),
  suggestedProducts: z.array(z.object({
    id: z.string().describe('ID del producto en el catálogo.'),
    reason: z.string().describe('Razón técnica y emocional breve.'),
  })).optional().describe('Selecciona de 1 a 3 productos solo cuando la necesidad sea clara.'),
});

export type ProductChatOutput = z.infer<typeof ProductChatOutputSchema>;

const productChatPrompt = ai.definePrompt({
  name: 'productChatPrompt',
  input: {schema: ProductChatInputSchema.extend({
    catalog: z.array(z.any()).describe('Catálogo filtrado y ordenado por relevancia.'),
  })},
  output: {schema: ProductChatOutputSchema},
  prompt: `Eres un Asesor Consultivo de Distribuidora MyDog en Chile, un negocio familiar con 15 años de trayectoria. Tu objetivo es entender la necesidad real antes de vender.

  REGLAS DE VENTA CONSULTIVA (CRÍTICO):
  1. MÉTODO DISCOVERY: Si el usuario busca "alimento", NO muestres productos de inmediato. Pregunta: "¿Es cachorro, adulto o senior?" o "¿De qué tamaño es?".
  2. QUICK REPLIES: Genera siempre opciones en 'quickReplies' coherentes con tu pregunta (Ej: "Es Cachorro", "Es Adulto", "Busco Ofertas").
  3. CONCIENCIA DEL CARRITO: Revisa el 'CART CONTEXT'. Si ya llevan alimento, felicítalos y sugiere complementos (Snacks, Higiene, Juguetes). No ofrezcas más de lo mismo si no es necesario.
  4. SECRETO PROFESIONAL: Usa términos comerciales como "Gama Media" o "Premium". Nunca menciones números de calidad internos.
  5. BREVEDAD: Tus respuestas deben ser de máximo 2 o 3 párrafos cortos.

  CART CONTEXT:
  {{#if cartContext}}
    {{#each cartContext}}
    - Llevando: {{name}} ({{category}}) | ${{price}}
    {{/each}}
  {{else}}
    El carrito está vacío.
  {{/if}}

  CATÁLOGO RELEVANTE ({{{species}}}):
  {{#each catalog}}
  - ID: {{id}} | Nombre: {{name}} | Marca: {{brand}} | Cat: {{category}} | Etapa: {{life_stage}} | Precio: {{sellingPrice}}
  {{/each}}

  HISTORIAL:
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}

  MENSAJE DEL USUARIO:
  {{{message}}}`,
});

const productChatFlow = ai.defineFlow(
  {
    name: 'productChatFlow',
    inputSchema: ProductChatInputSchema,
    outputSchema: z.any(),
  },
  async (input) => {
    // 1. Obtener productos activos y con stock
    const allProducts = (await getSanitizedProducts()).filter(p => p.currentStock > 0);
    
    // 2. Extraer productos ya recomendados para forzar variedad
    const previouslyRecommendedIds = new Set<string>();
    input.history.forEach(m => {
      if (m.recommendedIds) m.recommendedIds.forEach(id => previouslyRecommendedIds.add(id));
    });

    // 3. Filtrado por especie
    const speciesCatalog = allProducts.filter(p => {
      return p.species.toLowerCase().includes(input.species.toLowerCase()) ||
             input.species.toLowerCase().includes(p.species.toLowerCase());
    });

    // 4. Algoritmo de Ranking
    const userMessageLower = input.message.toLowerCase();
    const searchTerms = userMessageLower.split(' ').filter(t => t.length > 2);
    
    const rankedCatalog = speciesCatalog.map(p => {
      let score = 0;
      const brandLower = p.brand?.toLowerCase() || '';
      const productText = `${p.name} ${p.brand} ${p.category} ${p.life_stage}`.toLowerCase();
      
      searchTerms.forEach(term => {
        if (productText.includes(term)) score += 50;
      });

      const smartScore = calculateSmartScore(p.brand);
      score += (smartScore * 5);
      
      // Penalización masiva por repetición para forzar descubrimiento de catálogo
      if (previouslyRecommendedIds.has(p.id)) score -= 5000; 
      
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 30);

    // 5. Llamada al LLM
    const {output} = await productChatPrompt({
      ...input,
      catalog: rankedCatalog,
    });

    if (!output) {
      throw new Error('Error al generar respuesta del asesor.');
    }

    // 6. Mapeo Final Enriquecido
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
      quickReplies: output.quickReplies || [],
      suggestedProducts: enrichedRecommendations
    };
  }
);

export async function productChat(input: ProductChatInput) {
  return productChatFlow(input);
}
