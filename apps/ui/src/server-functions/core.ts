import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { google } from '@ai-sdk/google'
import { authClient } from '@/lib/auth'

export const model = google('gemini-2.5-flash-lite')

export const authMiddleware = createMiddleware({ type: 'function' }).server(
  async (ctx) => {
    const cookie = getRequestHeader('Cookie')

    if (!cookie) {
      console.log('No session cookie found on request')
      throw new Response('Unauthorized', { status: 401 })
    }

    const session = await authClient.getSession({
      fetchOptions: {
        headers: { Cookie: cookie },
      },
    })
    if (!session.data) {
      console.log('No session found for cookie')
      throw new Response('Unauthorized', { status: 401 })
    }

    return ctx.next({
      context: {
        user: session.data.user,
        session: session.data.session,
      },
    })
  }
)

export const authedServerFn = createServerFn().middleware([authMiddleware])
