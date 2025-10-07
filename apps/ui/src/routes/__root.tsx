import {
  HeadContent,
  Scripts,
  createRootRoute,
  redirect,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Toaster } from '@/components/ui/sonner'
import { authClient } from '@/lib/auth'

import appCss from '../styles.css?url'
import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { FeedbackButton } from '@/components/feedback-button'

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

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Project Tango',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,

  async beforeLoad(ctx) {
    const session = await getSession()

    // TODO: use a proper protected parent route or layout
    if (!ctx.location.pathname.includes('/signin') && !session?.data) {
      throw redirect({
        to: '/signin',
        replace: true,
        search: {
          redirect: ctx.location.url,
        },
      })
    }

    return session?.data
  },

  errorComponent: ({ error }) => {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-background text-foreground">
        <h1 className="mb-4 text-2xl font-bold">App Error</h1>
        <pre className="max-w-md whitespace-pre-wrap rounded bg-red-200 p-4 font-mono text-sm text-red-900">
          {error.message}
        </pre>
      </div>
    )
  },
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}

        <Toaster />
        <FeedbackButton />

        <TanStackDevtools
          config={{
            position: 'bottom-left',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
