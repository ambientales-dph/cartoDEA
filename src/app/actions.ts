"use server";

import {
  suggestRelevantFeatures,
  type SuggestRelevantFeaturesInput,
  type SuggestRelevantFeaturesOutput,
} from "@/ai/flows/suggest-relevant-features";

export async function getFeatureSuggestions(
  input: SuggestRelevantFeaturesInput
): Promise<SuggestRelevantFeaturesOutput> {
  // Add any server-side validation or logic here
  try {
    const suggestions = await suggestRelevantFeatures(input);
    return suggestions;
  } catch (error) {
    console.error("Error calling suggestRelevantFeatures flow:", error);
    throw new Error("Failed to get AI-powered suggestions.");
  }
}
