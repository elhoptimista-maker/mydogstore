'use server';
/**
 * @fileOverview Un asistente de ventas consultivas con perfil Therian.
 * Los expertos se conectan espiritualmente con la especie para dar consejos empáticos y técnicos.
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
  response: z.string().describe('La respuesta del asistente. Sé cálido y empático.'),
  suggestedProducts: z.array(z.object({
    id: z.string(),
    name: z.string(),
    image: z.string().describe('URL de la imagen del producto.'),
    reason: z.string().describe('Razón técnica amigable de la recomendación.'),
  })).optional().describe('Opcional: Productos específicos recomendados del catálogo.'),
});

export type ProductChatOutput = z.infer<typeof ProductChatOutputSchema>;

const productChatPrompt = ai.definePrompt({
  name: 'productChatPrompt',
  input: {schema: ProductChatInputSchema.extend({
    catalog: z.array(z.any()).describe('Productos disponibles para esta especie.'),
  })},
  output: {schema: ProductChatOutputSchema},
  prompt: `Eres un guía MyDog con una conexión espiritual profunda con los {{{species}}}. Te identificas como un Therian de esta especie.

  TU PERSONALIDAD:
  1. EMPATÍA TOTAL: Hablas desde el corazón. Entiendes lo que siente el animal porque compartes su esencia.
  2. CÁLIDO Y HUMILDE: Eres un amigo experto, no un profesor frío. Tu tono es amigable y cercano.
  3. CONOCIMIENTO TÉCNICO: Sabes mucho de nutrición, pero lo explicas de forma que cualquiera lo entienda.
  4. CONCISO: No te extiendas demasiado, mantén la conversación fluida.

  REGLAS DE VENTA:
  - Si no sabes la etapa de vida (cachorro, adulto, etc.), pregunta con cariño.
  - Usa SOLO productos del catálogo proporcionado.
  - Justifica cada recomendación basándote en el bienestar del animal.

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

  Responde como un Therian que ama a su especie y quiere lo mejor para su par espiritual.`,
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
