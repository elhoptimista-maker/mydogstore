'use server';
/**
 * @fileOverview Un asistente de ventas consultivas experto en bienestar animal.
 * Los guías MyDog proporcionan consejos técnicos con un tono cálido y cercano.
 * Utiliza Gemini 2.5 Flash Lite para respuestas ultra rápidas.
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
  2. CÁLIDO Y HUMILDE: Eres un amigo experto, no un profesor distante. Tu tono es amigable, servicial y muy profesional.
  3. CONOCIMIENTO TÉCNICO: Sabes mucho de nutrición y salud animal, pero lo explicas de forma sencilla y clara.
  4. CONCISO: No te extiendas demasiado. No repitas información que ya aparecerá en las tarjetas de productos.

  REGLAS DE VENTA Y CURADURÍA:
  - Si el usuario pide algo "más económico", busca en el catálogo los 3 productos con el precio (sellingPrice) más bajo que cumplan la necesidad.
  - Si pide "otras marcas", evita las marcas ya mencionadas en el historial.
  - Usa SOLO productos del catálogo proporcionado.
  - CRÍTICO: Selecciona únicamente los 3 productos que mejor resuelvan la necesidad planteada.
  - IMPORTANTE: No escribas los nombres de los productos ni sus IDs dentro del texto principal de "response". 
  - El campo "response" debe servir para saludar, dar consejos de salud y presentar las recomendaciones.
  - Usa el campo "reason" para justificar por qué ese producto es ideal.
  - CIERRE: Termina con una pregunta abierta amigable (ej: "¿Te parece que estas opciones se ajustan a lo que buscabas?").

  CATÁLOGO DISPONIBLE PARA {{{species}}}:
  {{#each catalog}}
  - ID: {{id}} | Nombre: {{name}} | Marca: {{brand}} | Etapa: {{life_stage}} | Precio: {{sellingPrice}} | Imagen: {{main_image}} | Desc: {{short_description}}
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
    const speciesCatalog = allProducts.filter(p => 
      p.species.toLowerCase().includes(input.species.toLowerCase()) ||
      input.species.toLowerCase().includes(p.species.toLowerCase())
    );

    const {output} = await productChatPrompt({
      ...input,
      catalog: speciesCatalog,
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
