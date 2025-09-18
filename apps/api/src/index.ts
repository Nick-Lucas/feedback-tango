import { Hono } from 'hono'
import { serve } from '@hono/node-server'
// import { cors } from 'hono/cors'
import { auth } from '@feedback-thing/db'
import { mcpServer } from '@feedback-thing/agents'
import { StreamableHTTPTransport } from '@hono/mcp'
import { randomUUID } from 'node:crypto'

const app = new Hono()

app.on(['POST', 'GET'], '/api/auth/*', (c) => auth.handler(c.req.raw))

app.all('/mcp', async (c) => {
  // TODO: check auth and pass through

  const transport = new StreamableHTTPTransport({
    sessionIdGenerator() {
      return randomUUID()
    },
    enableJsonResponse: true,
  })

  await mcpServer.connect(transport)

  const json = await c.req.json()
  console.log('MCP REQ', JSON.stringify(json, null, 2))
  try {
    return transport.handleRequest(c, json)
  } catch (err) {
    console.error('MCP ERR', err)
    throw err
  }
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Auth API listening on ${info.address}:${info.port}`)
  }
)
