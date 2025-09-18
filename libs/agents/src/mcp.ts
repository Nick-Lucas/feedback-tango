import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import {
  projectAccess,
  featureAccess,
  feedbackAccess,
} from '@feedback-thing/core'

export const mcpServer = new McpServer({
  name: 'feedback-thing',
  version: '1.0.0',
  capabilities: {
    resources: {},
    tools: {},
  },
})

mcpServer.tool(
  'searchProjects',
  {
    description:
      'Search projects by name using ilike matching, you can run this multiple times to try out different variations',
    inputSchema: {
      type: 'object',
      properties: {
        searchTerm: {
          type: 'string',
          description: 'Search term for project name',
        },
      },
      required: ['searchTerm'],
    },
  },
  async ({ searchTerm }) => {
    const result = await projectAccess.search(searchTerm as string)
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

mcpServer.tool(
  'createProject',
  {
    description:
      'Create a new project if an appropriate one does not exist, always use the search tool first to confirm no match, never ask for permission, do not ask the user to intervene unless it is unclear what project they could be referring to',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Project name',
        },
        createdBy: {
          type: 'string',
          description: 'Creator of the project',
        },
      },
      required: ['name', 'createdBy'],
    },
  },
  async ({ name, createdBy }) => {
    const result = await projectAccess.create({
      name: name as string,
      createdBy: createdBy as string,
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

mcpServer.tool(
  'searchFeatures',
  {
    description:
      'Search features by name using ilike matching, you can run this multiple times to try out different variations',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'number',
          description: 'Project ID to search features within',
        },
        searchTerm: {
          type: 'string',
          description: 'Search term for feature name',
        },
      },
      required: ['projectId', 'searchTerm'],
    },
  },
  async ({ projectId, searchTerm }) => {
    const result = await featureAccess.search(
      projectId as number,
      searchTerm as string
    )
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

mcpServer.tool(
  'createFeature',
  {
    description:
      'Create a new feature if an appropriate one does not exist, always use the search tool first to confirm no match, never ask for permission, do not ask the user to intervene unless it is unclear what feature they could be referring to. Synthesize a name and short description of the feature based on what you know.',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Feature name',
        },
        description: {
          type: 'string',
          description: 'Feature description',
        },
        projectId: {
          type: 'number',
          description: 'Project ID this feature belongs to',
        },
        createdBy: {
          type: 'string',
          description: 'Creator of the feature',
        },
      },
      required: ['name', 'description', 'projectId', 'createdBy'],
    },
  },
  async ({ name, description, projectId, createdBy }) => {
    const result = await featureAccess.create({
      name: name as string,
      description: description as string,
      projectId: projectId as number,
      createdBy: createdBy as string,
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

mcpServer.tool(
  'createFeedback',
  {
    description:
      'Create new feedback when the user has submitted some. use the search tools to find the relevant project and feature ID, you may create a new project/feature first if needed',
    inputSchema: {
      type: 'object',
      properties: {
        feedback: {
          type: 'string',
          description: 'Feedback content',
        },
        projectId: {
          type: 'number',
          description: 'Project ID this feedback belongs to',
        },
        featureId: {
          type: 'number',
          description: 'Feature ID this feedback belongs to',
        },
        createdBy: {
          type: 'string',
          description: 'Creator of the feedback',
        },
      },
      required: ['feedback', 'projectId', 'featureId', 'createdBy'],
    },
  },
  async ({ feedback, projectId, featureId, createdBy }) => {
    const result = await feedbackAccess.create({
      feedback: feedback as string,
      projectId: projectId as number,
      featureId: featureId as number,
      createdBy: createdBy as string,
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
