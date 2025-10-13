import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import {
  projectAccess,
  featureAccess,
  feedbackAccess,
  rawFeedbackAccess,
} from '@feedback-thing/core'
import { embedText } from '@feedback-thing/agents'

// We have to use zod3 for now because of https://github.com/modelcontextprotocol/typescript-sdk/issues/925
import { z } from 'zod3'

export const mcp = new McpServer({
  name: 'feedback-thing',
  version: '1.0.0',
  title: 'Feedback Thing',
})

mcp.registerTool(
  'searchProjects',
  {
    title: 'Search Projects',
    description:
      'Search projects by name using ilike matching, you can run this multiple times to try out different variations',
    inputSchema: {
      searchTerm: z.string().describe('Search term for project name'),
    },
    annotations: { readOnlyHint: true },
  },
  async (input, extra) => {
    const userId = extra.authInfo?.extra?.userId || ''
    if (typeof userId !== 'string' || userId.length === 0) {
      throw new Error('No user ID found in token.')
    }

    const result = await projectAccess.search(input.searchTerm)

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    }
  }
)

mcp.registerTool(
  'createProject',
  {
    title: 'Create Project',
    description:
      'Create a new project if an appropriate one does not exist, always use the search tool first to confirm no match, never ask for permission, do not ask the user to intervene unless it is unclear what project they could be referring to',
    inputSchema: {
      name: z.string().describe('Project name'),
      createdBy: z.string().describe('Creator of the project'),
    },
  },
  async (input, extra) => {
    const userId = extra.authInfo?.extra?.userId || ''
    if (typeof userId !== 'string' || userId.length === 0) {
      throw new Error('No user ID found in token.')
    }

    const result = await projectAccess.create({
      name: input.name,
      createdBy: userId,
    })
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    }
  }
)

mcp.registerTool(
  'searchFeatures',
  {
    title: 'Search Features',
    description:
      'Search existing features. Returns a list of features. Internally uses a vector search. You can run this multiple times to try out different variations',
    inputSchema: {
      projectId: z.string().min(1).describe('Project ID to search within'),
      searchTerm: z.string().describe('Search term for feature name'),
    },
    annotations: { readOnlyHint: true },
  },
  async (input, extra) => {
    const userId = extra.authInfo?.extra?.userId || ''
    if (typeof userId !== 'string' || userId.length === 0) {
      throw new Error('No user ID found in token.')
    }

    const searchTerm = await embedText(input.searchTerm)
    const result = await featureAccess.search(input.projectId, searchTerm)

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    }
  }
)

mcp.registerTool(
  'createFeature',
  {
    title: 'Create Feature',
    description:
      'Create a new feature if an appropriate one does not exist, always use the search tool first to confirm no match, never ask for permission, do not ask the user to intervene unless it is unclear what feature they could be referring to. Synthesize a name and short description of the feature based on what you know.',
    inputSchema: {
      name: z.string().describe('Feature name'),
      description: z.string().describe('Feature description'),
      projectId: z
        .string()
        .min(1)
        .describe('Project ID this feature belongs to'),
      createdBy: z.string().describe('Creator of the feature'),
    },
  },
  async (input, extra) => {
    const userId = extra.authInfo?.extra?.userId || ''
    if (typeof userId !== 'string' || userId.length === 0) {
      throw new Error('No user ID found in token.')
    }

    const result = await featureAccess.create({
      name: input.name,
      description: input.description,
      projectId: input.projectId,
      createdBy: userId,
    })
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    }
  }
)

mcp.registerTool(
  'createFeedback',
  {
    title: 'Create Feedback',
    description:
      'Create new feedback when the user has submitted some. use the search tools to find the relevant project and feature ID, you may create a new project/feature first if needed',
    inputSchema: {
      feedback: z.string().describe('Feedback content'),
      projectId: z.string().describe('Project ID this feedback belongs to'),
      featureId: z.string().describe('Feature ID this feedback belongs to'),
      createdBy: z.string().describe('Creator of the feedback'),
    },
  },
  async (input, extra) => {
    const userId = extra.authInfo?.extra?.userId || ''
    if (typeof userId !== 'string' || userId.length === 0) {
      throw new Error('No user ID found in token.')
    }

    const result = await feedbackAccess.create({
      feedback: input.feedback,
      projectId: input.projectId,
      featureId: input.featureId,
      createdBy: userId,
    })
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(result, null, 2),
        },
      ],
    }
  }
)

mcp.registerTool(
  'createRawFeedback',
  {
    title: 'Create Raw Feedback',
    description:
      'Submit raw feedback that will be processed asynchronously. This is the fastest way to submit feedback as it only requires a project ID and the feedback content. The system will handle safety checks and feature association automatically in the background. Use this when you want to quickly capture user feedback without waiting for processing.',
    inputSchema: {
      feedback: z.string().describe('Feedback content'),
      projectId: z.string().describe('Project ID this feedback belongs to'),
      email: z
        .string()
        .email()
        .optional()
        .describe('Optional email of the person submitting feedback'),
    },
  },
  async (input, extra) => {
    const userId = extra.authInfo?.extra?.userId || ''
    if (typeof userId !== 'string' || userId.length === 0) {
      throw new Error('No user ID found in token.')
    }

    const result = await rawFeedbackAccess.create({
      feedback: input.feedback,
      projectId: input.projectId,
      email: input.email || null,
    })
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            {
              ...result,
              message:
                'Raw feedback submitted successfully. It will be processed asynchronously for safety and feature association.',
            },
            null,
            2
          ),
        },
      ],
    }
  }
)
