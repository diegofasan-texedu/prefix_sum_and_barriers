'use server';

import { generatePthreadCode, GeneratePthreadCodeInput } from '@/ai/flows/generate-pthread-code';

export async function getAiSuggestion(input: GeneratePthreadCodeInput): Promise<{ data?: string; error?: string }> {
    try {
        const result = await generatePthreadCode(input);
        if (!result.suggestedCode) {
            return { error: "The AI returned an empty suggestion. Please try rephrasing or selecting different code." };
        }
        return { data: result.suggestedCode };
    } catch (error) {
        console.error("Error generating AI suggestion:", error);
        return { error: "An unexpected error occurred while contacting the AI. Please try again later." };
    }
}
