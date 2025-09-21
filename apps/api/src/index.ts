import { Hono } from 'hono'
import { serve } from '@hono/node-server'
// import { cors } from 'hono/cors'
import { auth } from '@feedback-thing/db'

const app = new Hono()
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

  console.log(`${c.req.method.padEnd(5)} ${c.req.url} - ${c.res.status}`)

  return
})

app.on(['POST', 'GET'], '/api/auth/*', async (c) => {
  return await auth.handler(c.req.raw)
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
