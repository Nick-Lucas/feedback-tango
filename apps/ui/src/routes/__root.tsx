import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Toaster } from '@/components/ui/sonner'
import { FeedbackWidget } from '@feedback-thing/sdk/react'
import '@feedback-thing/sdk/styles.css'
import { createFeedbackClient } from '@feedback-thing/sdk/client'

import appCss from '../styles.css?url'

const feedbackClient = createFeedbackClient({
  endpoint: 'http://localhost:3000/api/feedback',

  // Foo project
  projectPublicKey: '0199aae2-15a3-7c5e-bac8-d5060162c099',
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
