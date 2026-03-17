'use server';
/**
 * @fileOverview An AI-powered assistant that recommends products for dogs based on their breed, age, and specific needs.
 *
 * - intelligentProductAssistant - A function that handles the product recommendation process.
 * - IntelligentProductAssistantInput - The input type for the intelligentProductAssistant function.
 * - IntelligentProductAssistantOutput - The return type for the intelligentProductAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IntelligentProductAssistantInputSchema = z.object({
  dogBreed: z.string().optional().describe('The breed of the dog (e.g., "Golden Retriever", "Poodle").'),
  dogAge: z.string().optional().describe('The age or age group of the dog (e.g., "Puppy", "Adult", "Senior", "2 years old").'),
  specificNeeds: z.string().optional().describe('Any specific needs or conditions the dog has (e.g., "sensitive stomach", "high energy", "joint support").'),
  additionalInfo: z.string().optional().describe('Any other relevant information about the dog.'),
});
export type IntelligentProductAssistantInput = z.infer<typeof IntelligentProductAssistantInputSchema>;

const IntelligentProductAssistantOutputSchema = z.object({
  recommendations: z.array(z.object({
    productName: z.string().describe('The name of the recommended product.'),
    productDescription: z.string().describe('A brief description of the recommended product.'),
    reasonForRecommendation: z.string().describe('The reason why this product is recommended for the dog, based on the provided details.'),
  })).describe('A list of recommended products for the dog.'),
});
export type IntelligentProductAssistantOutput = z.infer<typeof IntelligentProductAssistantOutputSchema>;

const intelligentProductAssistantPrompt = ai.definePrompt({
  name: 'intelligentProductAssistantPrompt',
  input: {schema: IntelligentProductAssistantInputSchema},
  output: {schema: IntelligentProductAssistantOutputSchema},
  prompt: `You are an expert in dog products and nutrition. Your goal is to recommend suitable products for a dog based on the provided details.

  Consider the following information about the dog:
  {{#if dogBreed}}
  Breed: {{{dogBreed}}}
  {{/if}}
  {{#if dogAge}}
  Age: {{{dogAge}}}
  {{/if}}
  {{#if specificNeeds}}
  Specific Needs: {{{specificNeeds}}}
  {{/if}}
  {{#if additionalInfo}}
  Additional Information: {{{additionalInfo}}}
  {{/if}}

  Based on this information, recommend 3 to 5 products. For each product, provide its name, a brief description, and a clear reason for the recommendation. The recommendations should be relevant to the dog's breed, age, or specific needs. If not enough information is provided, make general but helpful recommendations.
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
      throw new Error('Failed to get product recommendations.');
    }
    return output;
  }
);

export async function intelligentProductAssistant(input: IntelligentProductAssistantInput): Promise<IntelligentProductAssistantOutput> {
  return intelligentProductAssistantFlow(input);
}
