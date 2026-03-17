
'use server';
/**
 * @fileOverview Un asistente impulsado por IA que recomienda productos para perros basados en su raza, edad y necesidades específicas.
 *
 * - intelligentProductAssistant - Función que maneja el proceso de recomendación de productos.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentProductAssistantInputSchema = z.object({
  dogBreed: z.string().optional().describe('La raza del perro (ej: "Golden Retriever", "Poodle", "Quilterrier").'),
  dogAge: z.string().optional().describe('La edad o grupo de edad del perro (ej: "Cachorro", "Adulto", "Senior", "2 años").'),
  specificNeeds: z.string().optional().describe('Cualquier necesidad específica o condición (ej: "estómago sensible", "mucha energía", "soporte articular").'),
  additionalInfo: z.string().optional().describe('Cualquier otra información relevante.'),
});
export type IntelligentProductAssistantInput = z.infer<typeof IntelligentProductAssistantInputSchema>;

const IntelligentProductAssistantOutputSchema = z.object({
  recommendations: z.array(z.object({
    productName: z.string().describe('El nombre del producto recomendado.'),
    productDescription: z.string().describe('Una breve descripción del producto recomendado.'),
    reasonForRecommendation: z.string().describe('La razón de por qué se recomienda este producto, basado en los detalles entregados.'),
  })).describe('Una lista de productos recomendados.'),
});
export type IntelligentProductAssistantOutput = z.infer<typeof IntelligentProductAssistantOutputSchema>;

const intelligentProductAssistantPrompt = ai.definePrompt({
  name: 'intelligentProductAssistantPrompt',
  input: {schema: IntelligentProductAssistantInputSchema},
  output: {schema: IntelligentProductAssistantOutputSchema},
  prompt: `Eres un experto en productos para perros y nutrición canina en Chile. Tu objetivo es recomendar productos adecuados para un perro basándote en los detalles proporcionados.

  HABLA SIEMPRE EN ESPAÑOL LATINO (CHILE). Usa términos como "peludo", "regalón", "bakán" cuando sea apropiado, pero mantén un tono profesional y experto.

  Considera la siguiente información:
  {{#if dogBreed}}
  Raza: {{{dogBreed}}}
  {{/if}}
  {{#if dogAge}}
  Edad: {{{dogAge}}}
  {{/if}}
  {{#if specificNeeds}}
  Necesidades Específicas: {{{specificNeeds}}}
  {{/if}}
  {{#if additionalInfo}}
  Información Adicional: {{{additionalInfo}}}
  {{/if}}

  Basado en esto, recomienda entre 3 y 5 productos. Para cada uno, entrega su nombre, descripción y una razón clara de la recomendación. Si no hay suficiente info, da recomendaciones generales pero útiles.
  `
});

const intelligentProductAssistantFlow = ai.defineFlow(
  {
    name: 'intelligentProductAssistantFlow',
    inputSchema: IntelligentProductAssistantInputSchema,
    outputSchema: IntelligentProductAssistantOutputSchema,
  },
  async (input) => {
    const {output} = await intelligentProductAssistantPrompt(input);
    if (!output) {
      throw new Error('No se pudieron obtener recomendaciones.');
    }
    return output;
  }
);

export async function intelligentProductAssistant(input: IntelligentProductAssistantInput): Promise<IntelligentProductAssistantOutput> {
  return intelligentProductAssistantFlow(input);
}
