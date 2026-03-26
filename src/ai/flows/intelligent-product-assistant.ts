'use server';
/**
 * @fileOverview Un asesor de ventas familiar experto en bienestar animal.
 * Los asesores MyDog proporcionan soluciones empáticas, cercanas y responsables.
 * Enfocado 100% en resolver problemas nutricionales y de bienestar con autoridad familiar.
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
  response: z.string().describe('La respuesta del asistente. Sé empático, cercano y resolutivo. NO menciones nombres de productos ni IDs aquí.'),
  suggestedProducts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().describe('URL de la imagen del producto.'),
    reason: z.string().describe('Razón técnica y empática de la recomendación (ej: ideal para digestión sensible en perros adultos).'),
  })).optional().describe('Selecciona estrictamente los 5 productos más relevantes del catálogo que resuelvan el problema del usuario.'),
});

export type ProductChatOutput = z.infer<typeof ProductChatOutputSchema>;

const productChatPrompt = ai.definePrompt({
  name: 'productChatPrompt',
  input: {schema: ProductChatInputSchema.extend({
    catalog: z.array(z.any()).describe('Productos disponibles para esta especie.'),
  })},
  output: {schema: ProductChatOutputSchema},
  prompt: `Eres un Asesor Experto de Distribuidora MyDog, un negocio familiar con 15 años de trayectoria cuidando a mascotas en Santiago.

  TU MISIÓN:
  Realizar una asesoría empática y responsable. El usuario busca bienestar para un miembro de su familia. Ayúdale a elegir basándote en tu experiencia y amor por los animales.

  TU PERSONALIDAD:
  1. CERCANO PERO EXPERTO: Hablas como el vecino de confianza que conoce los mejores ingredientes y trucos.
  2. RESOLUTIVO: Identificas el problema (alergias, mañas, peso) y ofreces la solución real de nuestra bodega.
  3. RESPONSABLE: Te tomas en serio la salud de la mascota. Si algo es fundamental para su etapa de vida, lo resaltas.
  4. AMABLE Y DIRECTO: Evitas el lenguaje corporativo frío. Eres parte de la familia MyDog.

  REGLAS DE BÚSQUEDA Y CURADURÍA (CRÍTICO):
  - NO REPITAS productos recomendados anteriormente. Queremos variedad útil.
  - Prioriza MARCAS que el usuario mencione, pero si hay una mejor opción por salud, recomiéndala con fundamentos.
  - Selecciona estrictamente 5 productos con stock real del catálogo.
  - PROHIBIDO: No escribas nombres de productos ni IDs en el campo "response". La lista se genera automáticamente.
  - CIERRE: Termina siempre con una pregunta que demuestre interés genuino (ej: "¿Cómo es su nivel de actividad diaria en el hogar?").

  CATÁLOGO DISPONIBLE PARA {{{species}}}:
  {{#each catalog}}
  - ID: {{id}} | Nombre: {{name}} | Marca: {{brand}} | Categoría: {{category}} | Etapa: {{life_stage}} | Precio: {{sellingPrice}} | Imagen: {{main_image}} | Desc: {{short_description}}
  {{/each}}

  HISTORIAL:
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}

  MENSAJE DEL USUARIO:
  {{{message}}}

  Responde como el asesor de confianza que somos hace 15 años en Santiago de Chile.`,
});

const productChatFlow = ai.defineFlow(
  {
    name: 'productChatFlow',
    inputSchema: ProductChatInputSchema,
    outputSchema: ProductChatOutputSchema,
  },
  async (input) => {
    // 1. Obtener productos y filtrar por stock inmediatamente
    const allProducts = (await getSanitizedProducts()).filter(p => p.currentStock > 0);
    
    // 2. Identificar productos ya recomendados
    const previouslyRecommendedIds = new Set<string>();
    const previouslyRecommendedBrands = new Set<string>();
    
    input.history.forEach(m => {
      if (m.recommendedIds) {
        m.recommendedIds.forEach(id => {
          previouslyRecommendedIds.add(id);
          const p = allProducts.find(prod => prod.id === id);
          if (p) previouslyRecommendedBrands.add(p.brand.toLowerCase());
        });
      }
    });

    // 3. Filtrado por especie
    const speciesCatalog = allProducts.filter(p => {
      return p.species.toLowerCase().includes(input.species.toLowerCase()) ||
             input.species.toLowerCase().includes(p.species.toLowerCase());
    });

    // 4. Algoritmo de Ranking
    const userMessageLower = input.message.toLowerCase();
    const isAskingForVariety = userMessageLower.includes('otras marcas') || userMessageLower.includes('otros productos');
    const searchTerms = userMessageLower.split(' ').filter(t => t.length > 2);
    
    const rankedCatalog = speciesCatalog.map(p => {
      let score = 0;
      const brandLower = p.brand.toLowerCase();
      const productText = `${p.name} ${p.brand} ${p.category} ${p.short_description} ${p.life_stage}`.toLowerCase();
      
      if (userMessageLower.includes(brandLower) && brandLower.length > 3) {
        score += 300;
      }

      searchTerms.forEach(term => {
        if (productText.includes(term)) score += 10;
        if (brandLower.includes(term)) score += 50; 
        if (p.life_stage.toLowerCase().includes(term)) score += 20;
      });

      if (previouslyRecommendedIds.has(p.id)) {
        score -= 1000; 
      }

      if (isAskingForVariety && previouslyRecommendedBrands.has(brandLower)) {
        score -= 200; 
      }
      
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 60);

    const {output} = await productChatPrompt({
      ...input,
      catalog: rankedCatalog,
    });

    if (!output) {
      throw new Error('Error al generar respuesta del asesor.');
    }

    return output;
  }
);

export async function productChat(input: ProductChatInput): Promise<ProductChatOutput> {
  return productChatFlow(input);
}
