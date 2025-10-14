import { createFileRoute, redirect } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { authClient } from '../../lib/auth'

const getSession = createServerFn().handler(async () => {
  const cookie = getRequestHeader('Cookie')

  if (cookie) {
    return await authClient.getSession({
      fetchOptions: {
        headers: {
          // Forward cookie manually during SSR
          Cookie: cookie,
        },
      },
    })
  } else {
    return null
  }
})

export const Route = createFileRoute('/(authed)')({
  async beforeLoad(ctx) {
    const session = await getSession()

    if (!session || !session.data) {
      console.log('No session, redirecting to signin', session?.error)

      throw redirect({
        to: '/signin',
        replace: true,
        search: {
          redirect: ctx.location.url,
        },
      })
    }

    return {
      session: session.data,
    }
  },
})
