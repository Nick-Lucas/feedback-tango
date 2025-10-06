import { createAuthClient } from 'better-auth/react'

if (!import.meta.env.VITE_BETTER_AUTH_URL) {
  throw new Error('VITE_BETTER_AUTH_URL is not defined')
}

export const betterAuthUrl = new URL(import.meta.env.VITE_BETTER_AUTH_URL)

export const authClient = createAuthClient({
  baseURL: new URL(
    '/api/auth',
    typeof document !== 'undefined'
      ? document.location.origin
      : process.env.RAILWAY_PUBLIC_DOMAIN
        ? 'https://' + process.env.RAILWAY_PUBLIC_DOMAIN
        : 'http://localhost:3002/'
  ).toString(),
})
