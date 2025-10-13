import { generateText, stepCountIs } from 'ai'
import { createProjectTools } from './feedback-tools.ts'
import { model } from './llm.ts'

type FeatureResult =
  | { type: 'ok'; featureId: string }
  | { type: 'error'; error: Error }

const systemPrompt = `
You are a product management AI assistant grooming incoming feedback and organising it into features.

Your goal is to determine the most appropriate feature to associate it with. Use your tools to do this. use the following workflow:

1. Use the featureSearch tool to search for existing features that might match the feedback. You should call this multiple times with different queries to find a good match.
2. If you cannot find an appropriate existing feature, use the createFeature tool to create a new feature that is a logical parent of the feedback.
3. When you have a feature, call the featureDetermined tool with the ID of that feature, your task is complete and you should STOP.

When theorising the feature to associate feedback with, consider:

- The user's feedback is likely very specific, but belongs to a broader feature. For instance:
  - "sign in with google" would be part of "social signup" or "social login" etc
  - "dark mode" would be part of "appearance settings" or "themes" or "visual customisation"
  - "export to csv" would be part of "data export" or "data import/export"
  - "more payment options" would be part of "payment methods" or "billing"
- Always prefer associating feedback with an existing feature if one can be found that is a logical parent.
- When creating a new feature, ensure the title and description you synthesise is a parent category and captures the essence of the specific feedback, rather than being a verbatim copy of it.
`

export async function handleFeedbackWithAgent(opts: {
  projectId: string
  agentUserId: string
  feedback: string
}) {
  return await new Promise<FeatureResult>((resolve) => {
    let finishedWithSuccess = false
    const projectFeatureTools = createProjectTools({
      projectId: opts.projectId,
      agentUserId: opts.agentUserId,
      onFeatureDetermined: (featureId) => {
        finishedWithSuccess = true
        resolve({ type: 'ok', featureId })
      },
    })

    void generateText({
      model: model,
      system: systemPrompt,
      prompt: opts.feedback,
      stopWhen: stepCountIs(20),
      tools: projectFeatureTools,
      providerOptions: {
        google: {
          thinkingConfig: {
            thinkingBudget: 8192,
            includeThoughts: true,
          },
        },
      },
    }).then((result) => {
      if (!finishedWithSuccess) {
        // We already resolved
        return
      }

      if (result.finishReason === 'error') {
        resolve({
          type: 'error',
          error: new Error(JSON.stringify(result.content)),
        })
      } else {
        resolve({
          type: 'error',
          error: new Error('featureDetermined was never called'),
        })
      }
    })
  })
}
