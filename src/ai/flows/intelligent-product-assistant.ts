'use server';
/**
 * @fileOverview Un asistente de ventas consultivas experto en bienestar animal.
 * Los guías MyDog proporcionan consejos técnicos con un tono cálido y cercano.
 * Utiliza un algoritmo de ranking previo para asegurar precisión en las recomendaciones.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { getSanitizedProducts } from '@/lib/services/catalog.service';

const MessageSchema = z.object({
  role: z.enum(['user', 'assistant']),
  content: z.string(),
});

const ProductChatInputSchema = z.object({
  species: z.string().describe('La especie de la mascota (ej: Perro, Gato).'),
  history: z.array(MessageSchema).describe('El historial de la conversación actual.'),
  message: z.string().describe('El mensaje enviado por el usuario.'),
});

export type ProductChatInput = z.infer<typeof ProductChatInputSchema>;

const ProductChatOutputSchema = z.object({
  response: z.string().describe('La respuesta del asistente. Sé cálido y empático. No menciones nombres de productos ni IDs aquí.'),
  suggestedProducts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().describe('URL de la imagen del producto.'),
    reason: z.string().describe('Razón técnica amigable de la recomendación.'),
  })).optional().describe('Selecciona estrictamente los 3 productos más relevantes del catálogo que mejor se ajusten a la necesidad del usuario.'),
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
  - El usuario puede mencionar MARCAS (ej: Master Dog, Pedigree) o ATRIBUTOS (ej: Senior, Cachorro).
  - DEBES buscar exhaustivamente en el CATÁLOGO proporcionado. Si un producto existe en la lista, NO digas que no lo tenemos.
  - Si el usuario pide algo "más económico", busca los 3 con el precio (sellingPrice) más bajo que cumplan la necesidad.
  - Si pide una categoría específica (ej: snacks, alimento húmedo), prioriza esa categoría.
  - Usa SOLO productos del catálogo proporcionado.
  - CRÍTICO: Selecciona únicamente los 3 productos que mejor resuelvan la necesidad planteada.
  - IMPORTANTE: No escribas los nombres de los productos ni sus IDs dentro del texto principal de "response". 
  - Usa el campo "reason" para justificar brevemente por qué ese producto es ideal.
  - CIERRE: Termina con una pregunta abierta amigable para seguir ayudando.

  CATÁLOGO DISPONIBLE PARA {{{species}}} (Ordenado por relevancia):
  {{#each catalog}}
  - ID: {{id}} | Nombre: {{name}} | Marca: {{brand}} | Categoría: {{category}} | Etapa: {{life_stage}} | Precio: {{sellingPrice}} | Imagen: {{main_image}} | Desc: {{short_description}}
  {{/each}}

  HISTORIAL:
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}

  MENSAJE DEL USUARIO:
  {{{message}}}

  Responde de forma fluida.`,
});

const productChatFlow = ai.defineFlow(
  {
    name: 'productChatFlow',
    inputSchema: ProductChatInputSchema,
    outputSchema: ProductChatOutputSchema,
  },
  async (input) => {
    const allProducts = await getSanitizedProducts();
    
    // 1. Filtrado por especie
    const speciesCatalog = allProducts.filter(p => 
      p.species.toLowerCase().includes(input.species.toLowerCase()) ||
      input.species.toLowerCase().includes(p.species.toLowerCase())
    );

    // 2. Algoritmo de Ranking por Relevancia (Pre-filtrado inteligente)
    // Identificamos términos clave en el mensaje del usuario para priorizar productos
    const searchTerms = input.message.toLowerCase().split(' ').filter(t => t.length > 2);
    
    const rankedCatalog = speciesCatalog.map(p => {
      let score = 0;
      const productText = `${p.name} ${p.brand} ${p.category} ${p.short_description} ${p.life_stage}`.toLowerCase();
      
      searchTerms.forEach(term => {
        if (productText.includes(term)) score += 10;
        if (p.brand.toLowerCase().includes(term)) score += 20; // Bonus por marca
        if (p.life_stage.toLowerCase().includes(term)) score += 15; // Bonus por etapa de vida
      });
      
      return { ...p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 50); // Enviamos los 50 más relevantes para asegurar que la marca o tipo esté en el contexto

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
