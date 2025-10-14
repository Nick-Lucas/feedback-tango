import { createFileRoute } from '@tanstack/react-router'

const API_HOST = 'eu.i.posthog.com'
const ASSET_HOST = 'eu-assets.i.posthog.com'

export const Route = createFileRoute('/api/ph')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        return await handleRequest(request)
      },
      POST: async ({ request }) => {
        return await handleRequest(request)
      },
    },
  },
})

async function handleRequest(request: Request) {
  const url = new URL(request.url)
  const pathname = url.pathname.replace('/api/ph/', '/')
  const search = url.search
  const pathWithParams = pathname + search

  if (pathname.startsWith('/static/')) {
    return await retrieveStatic(request, pathWithParams)
  } else {
    return await forwardRequest(request, pathWithParams)
  }
}

// TODO: implement caching for static assets
async function retrieveStatic(request: Request, pathname: string) {
  // let response = await caches.default.match(request)
  // if (!response) {
  //     response = await fetch(`https://${ASSET_HOST}${pathname}`)
  //     ctx.waitUntil(caches.default.put(request, response.clone()))
  // }
  // return response

  return await fetch(`https://${ASSET_HOST}${pathname}`)
}

async function forwardRequest(request: Request, pathWithSearch: string) {
  const originRequest = new Request(request, { signal: null })
  cleanHeaders(originRequest.headers)
  return await fetch(`https://${API_HOST}${pathWithSearch}`, originRequest)
}

function cleanHeaders(headers: Headers) {
  headers.set('host', API_HOST)
  headers.set('X-Forwarded-Host', API_HOST)
  headers.delete('cookie')
  headers.delete('connection')
}
