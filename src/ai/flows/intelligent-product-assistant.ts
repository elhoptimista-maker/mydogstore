'use server';
/**
 * @fileOverview Un asistente de ventas consultivas que recomienda productos en tiempo real.
 * Integra el catálogo real de productos filtrado por especie para dar respuestas precisas.
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
  response: z.string().describe('La respuesta del asistente.'),
  suggestedProducts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    reason: z.string(),
  })).optional().describe('Opcional: Productos específicos recomendados del catálogo.'),
});

export type ProductChatOutput = z.infer<typeof ProductChatOutputSchema>;

const productChatPrompt = ai.definePrompt({
  name: 'productChatPrompt',
  input: {schema: ProductChatInputSchema.extend({
    catalog: z.array(z.any()).describe('Productos disponibles para esta especie.'),
  })},
  output: {schema: ProductChatOutputSchema},
  prompt: `Eres un experto en nutrición y bienestar animal de MyDog Store. Estás ayudando a un cliente a elegir lo mejor para su mascota ({{{species}}}).

  REGLAS DE ORO:
  1. Sé amable, profesional y usa un tono de "venta consultiva".
  2. Si no sabes la edad o necesidades, PREGUNTA amablemente (cachorro, adulto, senior, sensibilidades).
  3. Usa ÚNICAMENTE los productos del catálogo proporcionado.
  4. Si recomiendas productos, incluye el ID exacto y la razón técnica en el campo 'suggestedProducts'.

  CATÁLOGO DISPONIBLE PARA {{{species}}}:
  {{#each catalog}}
  - ID: {{id}} | Nombre: {{name}} | Marca: {{brand}} | Categoría: {{category}} | Etapa: {{life_stage}} | Precio: {{sellingPrice}} | Desc: {{short_description}}
  {{/each}}

  HISTORIAL DE CHAT:
  {{#each history}}
  {{role}}: {{{content}}}
  {{/each}}

  MENSAJE DEL USUARIO:
  {{{message}}}

  Responde de forma concisa y guiando al usuario hacia la compra.`,
});

const productChatFlow = ai.defineFlow(
  {
    name: 'productChatFlow',
    inputSchema: ProductChatInputSchema,
    outputSchema: ProductChatOutputSchema,
  },
  async (input) => {
    // Obtener productos reales y filtrar por especie
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
