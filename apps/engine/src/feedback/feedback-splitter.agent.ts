import { generateObject } from 'ai'
import z from 'zod'
import { model } from './llm.ts'

const systemPrompt = `
You are a product owner who receives user feedback. Your task is to split up a user's feedback which potentially contains multiple discrete user feedback entries into individual feedback items.

Follow these guidelines:
- You do not rewrite the feedback, just split it up
- You make minor adjustments to ensure clarity, such as including a preamble which provides useful context
- Resulting feedback items must pertain to a single feature or aspect of the product
- The feedback might already pertain to a single feature, in which case you should return it as a single item in the array

For example, if the feedback says "I love the new dashboard, but the login process is too long and complicated", you should return:
1. "I love the new dashboard"
2. "The login process is too long and complicated"

For example, if the feedback says "The search feature is great, but it would be better if it supported colour filters", you should return:
1. "The search feature is great, but it would be better if it supported colour filters"
`

export async function splitFeedback(feedback: string) {
  const result = await generateObject({
    model,
    system: systemPrompt,
    prompt: feedback,
    schema: z.object({
      feedbacks: z.string().array().describe('The individual feedbacks'),
      reason: z.string().max(1000).describe('The reason for the outcome'),
    }),
  })

  return result
}
