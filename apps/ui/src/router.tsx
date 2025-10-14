import { createRouter } from '@tanstack/react-router'
import { setupRouterSsrQueryIntegration } from '@tanstack/react-router-ssr-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { getQueryClient } from './lib/query-client'
import { posthog as posthog_sdk } from 'posthog-js'

const posthog = posthog_sdk.init.call(
  posthog_sdk,
  import.meta.env.VITE_PUBLIC_POSTHOG_KEY,
  {
    autocapture: true,
    defaults: '2025-05-24',
    person_profiles: 'identified_only',

    api_host: '/api/ph',
    ui_host: 'eu.posthog.com',
    // api_host: 'https://ph-production-454b.up.railway.app',
    // api_host: 'https://eu.i.posthog.com',
    // disable_compression: true,
    // loaded(_ph) {
    //   // if (!import.meta.env.PROD) {
    //   //   _ph.opt_out_capturing()
    //   // }
    // },
  }
)

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
