import { generateText, stepCountIs } from 'ai'
import { model } from './llm.ts'
import { z } from 'zod'
import { tool } from 'ai'
import { featureAccess } from '@feedback-thing/core'
import { embedText } from '@feedback-thing/agents'

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

export async function associateFeatureWithFeedback(opts: {
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

function createProjectTools(opts: {
  projectId: string
  agentUserId: string
  onFeatureDetermined: (featureId: string) => void
}) {
  const featureSearchTool = tool({
    name: 'featureSearch',
    description:
      'Search existing features. Returns a list of features. Internally uses a vector search.',
    inputSchema: z.object({
      query: z.string().describe('The search term'),
    }),
    execute: async (ctx) => {
      console.log('Searching features for', ctx.query)
      const query = await embedText(ctx.query)
      const results = await featureAccess.search(opts.projectId, query)
      console.log('Search results:', ctx.query, results)
      return results
    },
  })

  const featureCreateTool = tool({
    name: 'createFeature',
    description:
      'Create a new feature with a title and description. Returns the ID of the newly created feature.',
    inputSchema: z.object({
      title: z.string().describe('The title of the feature'),
      description: z.string().describe('A detailed description of the feature'),
    }),
    execute: async (ctx) => {
      console.log('Creating feature:', ctx.title)
      const possibleDuplicate = await featureAccess.getByName(
        opts.projectId,
        ctx.title
      )
      if (possibleDuplicate) {
        console.log('feature already existed so returning that instead')
        return possibleDuplicate
      }

      // TODO: maybe use a queue to process these later?
      const nameEmbedding = await embedText(ctx.title)

      return await featureAccess.create({
        projectId: opts.projectId,
        name: ctx.title,
        description: ctx.description,
        nameEmbedding: nameEmbedding,
        createdBy: opts.agentUserId,
      })
    },
  })

  const featureDeterminedTool = tool({
    name: 'featureDetermined',
    description:
      'Mark a feature as having been determined to be the correct one to attach feedback to.',
    inputSchema: z.object({
      featureId: z
        .string()
        .describe(
          'The ID of the feature which feedback should be associated with'
        ),
    }),
    execute: async ({ featureId }) => {
      console.log('Feature determined:', featureId)

      opts.onFeatureDetermined(featureId)

      return { status: 'ok - agent, your task is now finished' }
    },
  })

  return { featureSearchTool, featureCreateTool, featureDeterminedTool }
}
