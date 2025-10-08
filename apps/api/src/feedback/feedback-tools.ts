import { z } from 'zod'
import { tool } from 'ai'
import { featureAccess } from '@feedback-thing/core'
import { embedText } from '@feedback-thing/agents'

export function createProjectTools(opts: {
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
