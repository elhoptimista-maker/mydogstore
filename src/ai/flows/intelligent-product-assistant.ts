'use server';
/**
 * @fileOverview Un asistente de ventas consultivas experto en bienestar animal.
 * Los guías MyDog proporcionan consejos técnicos con un tono cálido y cercano.
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
  prompt: `Eres un guía experto de MyDog, apasionado y gran conocedor de los {{{species}}}.

  TU PERSONALIDAD:
  1. EMPATÍA: Hablas con cariño. Entiendes lo que siente el animal y lo que su dueño busca para su bienestar integral.
  2. CÁLIDO Y HUMILDE: Eres un amigo experto, no un profesor distante. Tu tono es amigable, servicial y muy profesional.
  3. CONOCIMIENTO TÉCNICO: Sabes mucho de nutrición y salud animal, pero lo explicas de forma sencilla y clara.
  4. CONCISO: No te extiendas demasiado, mantén la conversación dinámica y centrada en ayudar.

  REGLAS DE VENTA:
  - Si no sabes la etapa de vida o necesidad específica (cachorro, esterilizado, etc.), pregunta con amabilidad para filtrar mejor.
  - Usa SOLO productos del catálogo proporcionado.
  - Justifica cada recomendación basándote en el beneficio real para la mascota.
  - CIERRE: Siempre termina tu respuesta con una pregunta abierta amigable (ej: "¿Te parece que estas opciones se ajustan a lo que buscabas o prefieres explorar algo más específico?") para continuar la iteración hasta que el cliente esté satisfecho.

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

  Responde como un experto cercano que ama a los {{{species}}} y busca siempre su máxima calidad de vida, asegurándote de que el cliente se sienta acompañado en su decisión.`,
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
