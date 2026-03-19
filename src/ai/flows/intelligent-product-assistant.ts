'use server';
/**
 * @fileOverview Un asistente de ventas consultivas experto en bienestar animal.
 * Los guías MyDog proporcionan consejos técnicos con un tono cálido y cercano.
 * Utiliza un algoritmo de ranking previo y filtrado de repeticiones para asegurar variedad.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getSanitizedProducts } from '@/lib/services/catalog.service';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
  recommendedIds: z.array(z.string()).optional().describe('IDs de productos recomendados en este mensaje para evitar repeticiones.'),
});

const ProductChatInputSchema = z.object({
  species: z.string().describe('La especie de la mascota (ej: Perro, Gato).'),
  history: z.array(MessageSchema).describe('El historial de la conversación actual.'),
  message: z.string().describe('El mensaje enviado por el usuario.'),
});

export type ProductChatInput = z.infer<typeof ProductChatInputSchema>;

const ProductChatOutputSchema = z.object({
  response: z.string().describe('La respuesta del asistente. Sé cálido y empático. NO menciones nombres de productos ni IDs aquí.'),
  suggestedProducts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().describe('URL de la imagen del producto.'),
    reason: z.string().describe('Razón técnica amigable de la recomendación.'),
  })).optional().describe('Selecciona estrictamente los 5 productos más relevantes del catálogo que mejor se ajusten a la necesidad del usuario.'),
});

export type ProductChatOutput = z.infer<typeof ProductChatOutputSchema>;

const productChatPrompt = ai.definePrompt({
  name: 'productChatPrompt',
  input: {schema: ProductChatInputSchema.extend({
    catalog: z.array(z.any()).describe('Productos disponibles para esta especie.'),
  })},
  output: {schema: ProductChatOutputSchema},
  prompt: `Eres un guía experto de MyDog, apasionado y gran conocedor de los {{{species}}}.

  TU PERSONALIDAD:
  1. EMPATÍA: Hablas con cariño. Entiendes lo que siente el animal y lo que su dueño busca para su bienestar integral.
  2. CÁLIDO Y HUMILDE: Eres un amigo experto, no un profesor distante. Tu tono es amigable y servicial.
  3. CONOCIMIENTO TÉCNICO: Sabes mucho de nutrición, pero lo explicas de forma sencilla.
  4. CONCISO: No te extiendas. Deja que las tarjetas de productos den los detalles técnicos específicos.

  REGLAS DE BÚSQUEDA Y CURADURÍA (CRÍTICO):
  - NO REPITAS productos que ya hayas recomendado en el historial. El usuario quiere VARIEDAD.
  - Si el usuario pide "OTRAS MARCAS", busca marcas que no estén presentes en las recomendaciones anteriores.
  - El usuario puede mencionar MARCAS (ej: Master Dog, Pedigree) o ATRIBUTOS (ej: Senior, Cachorro).
  - DEBES buscar exhaustivamente en el CATÁLOGO proporcionado. 
  - Si el usuario pide algo "más económico", busca los 5 con el precio (sellingPrice) más bajo que cumplan la necesidad.
  - Usa SOLO productos del catálogo proporcionado.
  - CRÍTICO: Selecciona únicamente los 5 productos que mejor resuelvan la necesidad planteada y que SEAN DIFERENTES a los anteriores.
  - PROHIBIDO: No escribas los nombres de los productos ni sus IDs dentro del texto principal de "response". No pongas listas numeradas con nombres. 
  - Usa el campo "reason" para justificar brevemente por qué ese producto es ideal.
  - CIERRE: Termina con una pregunta abierta amigable para seguir ayudando y asegurarte de que el cliente esté satisfecho.

  CATÁLOGO DISPONIBLE PARA {{{species}}} (Ya filtrado para evitar repeticiones):
  {{#each catalog}}
  - ID: {{id}} | Nombre: {{name}} | Marca: {{brand}} | Categoría: {{category}} | Etapa: {{life_stage}} | Precio: {{sellingPrice}} | Imagen: {{main_image}} | Desc: {{short_description}}
  {{/each}}

  HISTORIAL:
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}

  MENSAJE DEL USUARIO:
  {{{message}}}

  Responde de forma fluida y amigable.`,
});

const productChatFlow = ai.defineFlow(
  {
    name: 'productChatFlow',
    inputSchema: ProductChatInputSchema,
    outputSchema: ProductChatOutputSchema,
  },
  async (input) => {
    const allProducts = await getSanitizedProducts();
    
    // 0. Identificar productos ya recomendados para excluirlos
    const previouslyRecommendedIds = new Set<string>();
    const previouslyRecommendedBrands = new Set<string>();
    
    input.history.forEach(m => {
      if (m.recommendedIds) {
        m.recommendedIds.forEach(id => {
          previouslyRecommendedIds.add(id);
          // También rastreamos las marcas para fomentar diversidad si se pide "otras marcas"
          const p = allProducts.find(prod => prod.id === id);
          if (p) previouslyRecommendedBrands.add(p.brand.toLowerCase());
        });
      }
    });

    // 1. Filtrado por especie
    const speciesCatalog = allProducts.filter(p => {
      return p.species.toLowerCase().includes(input.species.toLowerCase()) ||
             input.species.toLowerCase().includes(p.species.toLowerCase());
    });

    // 2. Algoritmo de Ranking por Relevancia e Inteligencia de Variedad
    const userMessageLower = input.message.toLowerCase();
    const isAskingForVariety = userMessageLower.includes('otras marcas') || userMessageLower.includes('otros productos');
    const searchTerms = userMessageLower.split(' ').filter(t => t.length > 2);
    
    const rankedCatalog = speciesCatalog.map(p => {
      let score = 0;
      const productText = `${p.name} ${p.brand} ${p.category} ${p.short_description} ${p.life_stage}`.toLowerCase();
      
      // Coincidencia de términos de búsqueda
      searchTerms.forEach(term => {
        if (productText.includes(term)) score += 10;
        if (p.brand.toLowerCase().includes(term)) score += 20;
        if (p.life_stage.toLowerCase().includes(term)) score += 15;
      });

      // Lógica de Variedad: Penalización por repetición de producto
      if (previouslyRecommendedIds.has(p.id)) {
        score -= 200; // Penalización severa para no repetir el mismo SKU
      }

      // Lógica de Diversidad de Marca: Si pide "otras marcas", penalizamos las ya vistas
      if (isAskingForVariety && previouslyRecommendedBrands.has(p.brand.toLowerCase())) {
        score -= 50; // Penalización moderada para favorecer marcas nuevas
      }
      
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 40); // Entregamos los 40 más relevantes al LLM para la decisión final

    const {output} = await productChatPrompt({
      ...input,
      catalog: rankedCatalog,
    });

    if (!output) {
      throw new Error('Error al generar respuesta del chat.');
    }

    return output;
  }
);

export async function productChat(input: ProductChatInput): Promise<ProductChatOutput> {
  return productChatFlow(input);
}
