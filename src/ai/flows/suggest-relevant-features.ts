'use server';

/**
 * @fileOverview A flow for suggesting relevant geospatial features to display based on user context and preferences.
 *
 * - suggestRelevantFeatures - A function that suggests relevant geospatial features.
 * - SuggestRelevantFeaturesInput - The input type for the suggestRelevantFeatures function.
 * - SuggestRelevantFeaturesOutput - The return type for the suggestRelevantFeatures function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestRelevantFeaturesInputSchema = z.object({
  currentView: z.string().describe('The current map view (e.g., bounding box coordinates).'),
  selectedDataLayers: z.array(z.string()).describe('The data layers currently selected by the user.'),
  userPreferences: z.string().optional().describe('The user\u2019s stated preferences or interests.'),
});
export type SuggestRelevantFeaturesInput = z.infer<typeof SuggestRelevantFeaturesInputSchema>;

const SuggestRelevantFeaturesOutputSchema = z.object({
  suggestedFeatures: z.array(z.string()).describe('A list of suggested geospatial features to display.'),
  reasoning: z.string().describe('The reasoning behind the feature suggestions.'),
});
export type SuggestRelevantFeaturesOutput = z.infer<typeof SuggestRelevantFeaturesOutputSchema>;

export async function suggestRelevantFeatures(input: SuggestRelevantFeaturesInput): Promise<SuggestRelevantFeaturesOutput> {
  return suggestRelevantFeaturesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestRelevantFeaturesPrompt',
  input: {schema: SuggestRelevantFeaturesInputSchema},
  output: {schema: SuggestRelevantFeaturesOutputSchema},
  prompt: `You are an expert geospatial data analyst. Given the user's current map view, selected data layers, and any stated preferences, suggest relevant geospatial features to display.

Current Map View: {{{currentView}}}
Selected Data Layers: {{#each selectedDataLayers}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}
User Preferences: {{{userPreferences}}}

Consider the following factors when making suggestions:
* The relevance of the feature to the user's current view.
* The compatibility of the feature with the selected data layers.
* The user's stated preferences or interests.

Output a list of suggested geospatial features and a brief explanation of your reasoning.

For example, if the current view is focused on a city and the selected data layers include population density and points of interest, you might suggest displaying features such as:
- High-density residential areas
- Parks and recreational areas
- Public transportation hubs

Reasoning: These features are relevant to understanding the city's population distribution and points of interest.

{{output schema=SuggestRelevantFeaturesOutputSchema}}
`,
});

const suggestRelevantFeaturesFlow = ai.defineFlow(
  {
    name: 'suggestRelevantFeaturesFlow',
    inputSchema: SuggestRelevantFeaturesInputSchema,
    outputSchema: SuggestRelevantFeaturesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
