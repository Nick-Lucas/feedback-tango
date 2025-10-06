import {
  HeadContent,
  Scripts,
  createRootRoute,
  redirect,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Toaster } from '@/components/ui/sonner'
import { FeedbackWidget } from '@feedback-thing/sdk/react'
import { createFeedbackClient } from '@feedback-thing/sdk/client'
import { authClient } from '@/lib/auth'

import appCss from '../styles.css?url'
import '@feedback-thing/sdk/styles.css'

const feedbackClient = createFeedbackClient({
  endpoint: 'http://localhost:3000/api/feedback',

  // TODO: make configurable
  projectPublicKey: '0199afaf-518c-70f4-924f-1f9abc2aaf4f',
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

  // TODO: this is pretty icky but does work
  // Need a better way to manage the first load which is under SSR without auto-redirecting everyone via signin and resetting their page
  async beforeLoad(ctx) {
    // Detect server vs client
    const isServer = typeof document === 'undefined'
    let session:
      | Awaited<ReturnType<typeof authClient.getSession>>
      | { data: null } = { data: null }

    if (isServer) {
      const getCookie = (await import('@tanstack/react-start/server')).getCookie
      const sessionToken = getCookie('better-auth.session_token')
      if (sessionToken) {
        session = await authClient.getSession({
          fetchOptions: {
            headers: {
              // Forward cookie manually during SSR
              Cookie: `better-auth.session_token=${sessionToken}`,
            },
          },
        })
      }
    } else {
      // Client: allow browser to send cookies
      session = await authClient.getSession({
        fetchOptions: { credentials: 'include' },
      })
    }

    // TODO: use a proper protected parent route or layout
    if (!ctx.location.pathname.includes('/signin') && !session.data) {
      throw redirect({
        to: '/signin',
        replace: true,
        search: {
          redirect: ctx.location.url,
        },
      })
    }

    return session.data
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

        <div className="fixed bottom-4 right-4">
          <FeedbackWidget client={feedbackClient} />
        </div>

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
