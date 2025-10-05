import { serve } from '@hono/node-server'
import { app } from './app.ts'
import './auth.ts'
import './feedback.ts'

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Public API listening on ${info.address}:${info.port}`)
  }
)
