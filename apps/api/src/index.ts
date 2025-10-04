import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { eq } from 'drizzle-orm'
import { createDb, oauthAccessToken, user } from '@feedback-thing/db'
import { auth } from '@feedback-thing/db/auth'
import { cors } from 'hono/cors'

const app = new Hono()
const db = createDb()

app.use(
  '*',
  cors({
    origin: 'http://localhost:3002',
    allowMethods: ['*'],
    // allowHeaders: ['*'],
    credentials: true,
  })
)

app.use('*', async (c, next) => {
  console.log(
    `${c.req.method.padEnd(5)} ${c.req.url}`,
    JSON.stringify(c.req.header(), null, 2)
  )
  // if (c.req.path.endsWith('/token')) {
  //   const body = await c.req.raw.clone().text()
  //   console.log('Body:', body)
  // }

  await next()

  console.log(
    `${c.req.method.padEnd(5)} ${c.req.url} - ${c.res.status}`,
    JSON.stringify(Object.fromEntries(c.res.headers.entries()), null, 2)
  )

  return
})

/**
 * Better Auth with the MCP plugin currently does not implement the /authinfo endpoint,
 * or any helpers for it, so we have to build a basic version of this
 *
 * They are working on a oauth2.1 plugin which will supersede the mcp plugin and will support this:
 * https://github.com/better-auth/better-auth/pull/4163
 *
 * If you are using another provider they will likely support this properly
 */
app.get('/api/auth/mcp/userinfo', async (c) => {
  const bearer = c.req.header('Authorization')
  if (!bearer || !bearer.toLowerCase().startsWith('bearer ')) {
    return c.json({ error: 'Missing or invalid Authorization header' }, 401)
  }

  const token = bearer.slice(7).trim()

  const usersInfo = await db
    .select()
    .from(oauthAccessToken)
    .innerJoin(user, eq(oauthAccessToken.userId, user.id))
    .where(eq(oauthAccessToken.accessToken, token))
    .limit(1)

  if (usersInfo.length !== 1) {
    throw new Error('Invalid access token')
  }

  const session = usersInfo[0]
  if (!session) {
    throw new Error('Invalid access token')
  }

  return c.json({
    active: true,
    sub: session.user.id,
    scope: session.oauth_access_token.scopes?.split(' ') ?? [],
    client_id: session.oauth_access_token.clientId,
    exp: session.oauth_access_token.accessTokenExpiresAt?.valueOf(),
    aud: 'https://api.example.com',
    user: session.user,
  })
})
app.on(['POST', 'GET'], '/api/auth/*', async (c) => {
  return await auth.handler(c.req.raw)
})

app.post('/api/feedback', async (c) => {
  const body = await c.req.json()
  console.log('Feedback received:', body)
  return c.json({ status: 'ok' })
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
