import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { getQueryClient } from './lib/query-client'
import { posthog as posthog_sdk } from 'posthog-js'

const posthog = posthog_sdk.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, {
  autocapture: true,
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  loaded(ph) {
    if (!import.meta.env.PROD) {
      ph.opt_out_capturing()
    }
  },
})

export const getRouter = () => {
  const queryClient = getQueryClient()

  const router = createRouter({
    routeTree,
    context: {
      queryClient,
      posthog,
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
  })

  return router
}
