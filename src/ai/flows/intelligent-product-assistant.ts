'use server';
/**
 * @fileOverview Un asistente impulsado por IA que recomienda productos para mascotas basados en su raza, edad y necesidades específicas.
 *
 * - intelligentProductAssistant - Función que maneja el proceso de recomendación de productos.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentProductAssistantInputSchema = z.object({
  dogBreed: z.string().optional().describe('La raza de la mascota (ej: "Golden Retriever", "Poodle").'),
  dogAge: z.string().optional().describe('La edad o etapa de vida (ej: "Cachorro", "Adulto", "Senior").'),
  specificNeeds: z.string().optional().describe('Cualquier necesidad específica o condición (ej: "estómago sensible", "energía alta", "soporte articular").'),
  additionalInfo: z.string().optional().describe('Información adicional relevante.'),
});
export type IntelligentProductAssistantInput = z.infer<typeof IntelligentProductAssistantInputSchema>;

const IntelligentProductAssistantOutputSchema = z.object({
  recommendations: z.array(z.object({
    productName: z.string().describe('El nombre del producto recomendado.'),
    productDescription: z.string().describe('Una breve descripción del producto.'),
    reasonForRecommendation: z.string().describe('La justificación técnica de la recomendación basada en los datos proporcionados.'),
  })).describe('Una lista de productos recomendados.'),
});
export type IntelligentProductAssistantOutput = z.infer<typeof IntelligentProductAssistantOutputSchema>;

const intelligentProductAssistantPrompt = ai.definePrompt({
  name: 'intelligentProductAssistantPrompt',
  input: {schema: IntelligentProductAssistantInputSchema},
  output: {schema: IntelligentProductAssistantOutputSchema},
  prompt: `Eres un experto en nutrición y bienestar animal. Tu objetivo es recomendar productos adecuados para una mascota basándote en los detalles proporcionados.

  Usa siempre un español neutro y profesional. Evita modismos o jerga local.

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

  Basado en esto, recomienda entre 3 y 5 productos del catálogo. Para cada uno, entrega su nombre, descripción y una razón clara de la recomendación. Si no hay suficiente información, ofrece recomendaciones generales pero fundamentadas.
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
      throw new Error('No se pudieron generar las recomendaciones.');
    }
    return output;
  }
);

export async function intelligentProductAssistant(input: IntelligentProductAssistantInput): Promise<IntelligentProductAssistantOutput> {
  return intelligentProductAssistantFlow(input);
}
