import { serve } from '@hono/node-server'
import { app } from './app.ts'
import './auth.ts'
import './feedback.ts'
import { cors } from 'hono/cors'

app.use(
  '*',
  cors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3002',
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

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Public API listening on ${info.address}:${info.port}`)
  }
)
