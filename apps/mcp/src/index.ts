import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import {
  projectAccess,
  featureAccess,
  feedbackAccess,
} from '@feedback-thing/core'
import { randomUUID } from 'node:crypto'
import { createServer } from 'node:http'

// We have to use zod3 for now because of https://github.com/modelcontextprotocol/typescript-sdk/issues/925
import { z } from 'zod'

// Create server instance
const server = new McpServer({
  name: 'feedback-thing',
  version: '1.0.0',
})

// Search projects tool
server.tool(
  'searchProjects',
  'Search projects by name using ilike matching, you can run this multiple times to try out different variations',
  {
    searchTerm: z.string().describe('Search term for project name'),
  },
  async (input) => {
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

// Create project tool
server.tool(
  'createProject',
  'Create a new project if an appropriate one does not exist, always use the search tool first to confirm no match, never ask for permission, do not ask the user to intervene unless it is unclear what project they could be referring to',
  {
    name: z.string().describe('Project name'),
    createdBy: z.string().describe('Creator of the project'),
  },
  async (input) => {
    const result = await projectAccess.create({
      name: input.name,
      createdBy: input.createdBy,
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

// Search features tool
server.tool(
  'searchFeatures',
  'Search features by name using ilike matching, you can run this multiple times to try out different variations',
  {
    projectId: z.number().describe('Project ID to search features within'),
    searchTerm: z.string().describe('Search term for feature name'),
  },
  async (input) => {
    const result = await featureAccess.search(input.projectId, input.searchTerm)

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

// Create feature tool
server.tool(
  'createFeature',
  'Create a new feature if an appropriate one does not exist, always use the search tool first to confirm no match, never ask for permission, do not ask the user to intervene unless it is unclear what feature they could be referring to. Synthesize a name and short description of the feature based on what you know.',
  {
    name: z.string().describe('Feature name'),
    description: z.string().describe('Feature description'),
    projectId: z.number().describe('Project ID this feature belongs to'),
    createdBy: z.string().describe('Creator of the feature'),
  },
  async (input) => {
    const result = await featureAccess.create({
      name: input.name,
      description: input.description,
      projectId: input.projectId,
      createdBy: input.createdBy,
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

// Create feedback tool
server.tool(
  'createFeedback',
  'Create new feedback when the user has submitted some. use the search tools to find the relevant project and feature ID, you may create a new project/feature first if needed',
  {
    feedback: z.string().describe('Feedback content'),
    projectId: z.number().describe('Project ID this feedback belongs to'),
    featureId: z.number().describe('Feature ID this feedback belongs to'),
    createdBy: z.string().describe('Creator of the feedback'),
  },
  async (input) => {
    const result = await feedbackAccess.create({
      feedback: input.feedback,
      projectId: input.projectId,
      featureId: input.featureId,
      createdBy: input.createdBy,
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

async function main() {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator() {
      // TODO: probably use the better-auth token to generate this
      return randomUUID()
    },
    // TODO: DNS rebinding protection, origin checks etc
  })

  console.log('Connecting server to transport...')
  await server.connect(transport)
  console.log('Server connected successfully')

  const httpServer = createServer(async (req, res) => {
    try {
      console.log('Incoming MCP request:', req.method, req.url)

      // Add CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
      res.setHeader('Access-Control-Expose-Headers', 'mcp-session-id')

      if (req.method === 'OPTIONS') {
        res.writeHead(200).end()
        return
      }

      await transport.handleRequest(req, res)
    } catch (error) {
      console.error('Error handling request:', error)
      if (!res.headersSent) {
        res.writeHead(500).end()
      }
    }
  })

  httpServer.listen(3001, '127.0.0.1', () => {
    console.error('Feedback Thing MCP Server running on port 3001')
  })
}

main().catch((error) => {
  console.error('Fatal error in main():', error)
  process.exit(1)
})
