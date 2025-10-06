import { createFileRoute } from '@tanstack/react-router'
import { auth } from '@feedback-thing/db/auth'

export const Route = createFileRoute('/api/auth')({
  server: {
    handlers: {
      GET: ({ request }) => {
        return auth.handler(request)
      },
      POST: ({ request }) => {
        return auth.handler(request)
      },
    },
  },
})
