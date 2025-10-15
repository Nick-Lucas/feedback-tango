import { generateObject } from 'ai'
import z from 'zod'
import { model } from './llm.ts'

const RawFeedbackSchema = z.enum(['positive', 'constructive', 'negative'])

const systemPrompt = `
You are a sentiment analyser. You analyze user-submitted feedback and determine which category of sentiment it falls into according to the following guidelines:

- positive: The feedback expresses a positive sentiment
- constructive: The feedback provides suggestions for how to improve a feature
- negative: The feedback expresses a negative sentiment. It does not suggest any improvements, just states dissatisfaction

To reinforce:
- If the feedback is negative or positive but provides any suggestion for improvement, classify it as "constructive".
`

export async function checkFeedbackSentiment(feedback: string) {
  const result = await generateObject({
    model,
    system: systemPrompt,
    prompt: feedback,
    schema: z.object({
      outcome: RawFeedbackSchema.describe('The sentiment of the feedback'),
      reason: z.string().max(1000).describe('The reason for the outcome'),
    }),
  })

  return result
}
