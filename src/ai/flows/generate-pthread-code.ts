'use server';

/**
 * @fileOverview Generates pthreads code suggestions based on the selected C code.
 *
 * - generatePthreadCode - A function that takes C code and suggests pthreads implementation.
 * - GeneratePthreadCodeInput - The input type for the generatePthreadCode function.
 * - GeneratePthreadCodeOutput - The return type for the generatePthreadCode function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePthreadCodeInputSchema = z.object({
  selectedCode: z
    .string()
    .describe('The selected C code snippet to generate pthreads code for.'),
});
export type GeneratePthreadCodeInput = z.infer<typeof GeneratePthreadCodeInputSchema>;

const GeneratePthreadCodeOutputSchema = z.object({
  suggestedCode: z
    .string()
    .describe('The suggested pthreads code based on the selected C code.'),
});
export type GeneratePthreadCodeOutput = z.infer<typeof GeneratePthreadCodeOutputSchema>;

export async function generatePthreadCode(input: GeneratePthreadCodeInput): Promise<GeneratePthreadCodeOutput> {
  return generatePthreadCodeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePthreadCodePrompt',
  input: {schema: GeneratePthreadCodeInputSchema},
  output: {schema: GeneratePthreadCodeOutputSchema},
  prompt: `You are an expert in parallel programming with C and pthreads.

  Based on the selected C code snippet, suggest relevant pthreads boilerplate code or algorithms that can be used to implement parallel processing.

  Selected C code:
  {{selectedCode}}
  `,
});

const generatePthreadCodeFlow = ai.defineFlow(
  {
    name: 'generatePthreadCodeFlow',
    inputSchema: GeneratePthreadCodeInputSchema,
    outputSchema: GeneratePthreadCodeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
