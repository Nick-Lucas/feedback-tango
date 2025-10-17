import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Toaster } from '@/components/ui/sonner'

import appFavicon from '../../public/favicon.svg?url'
import appCss from '../styles.css?url'
import { FeedbackButton } from '@/components/feedback-button'
import type { QueryClient } from '@tanstack/react-query'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
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
          title: 'Feedback Tango',
        },
      ],
      links: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          href: appFavicon,
        },
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
  }
)

function RootDocument({ children }: { children: React.ReactNode }) {
  const queryClient = Route.useRouteContext().queryClient

  return (
    <html lang="en" className="dark" style={{ scrollbarGutter: 'stable' }}>
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
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
              {
                name: 'Tanstack Query',
                render: <ReactQueryDevtoolsPanel />,
              },
            ]}
          />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}
