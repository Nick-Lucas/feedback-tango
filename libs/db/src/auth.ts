import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createDb } from './db/db.ts'
import { z } from 'zod'
import * as schemas from './db/index.ts'
import { mcp, admin } from 'better-auth/plugins'
import { reactStartCookies } from 'better-auth/react-start'

const parsed = z
  .object({
    SOCIAL_GITHUB_CLIENT_ID: z.string().min(1),
    SOCIAL_GITHUB_CLIENT_SECRET: z.string().min(1),
  })
  .safeParse(process.env)

if (!parsed.success) {
  console.warn('⚠️ Invalid or missing environment variables:')
  console.warn(z.treeifyError(parsed.error))
}

const env = parsed.data

export const auth = betterAuth({
  database: drizzleAdapter(createDb({ ignoreMissingConnectionString: true }), {
    provider: 'pg',
    schema: schemas,
  }),
  plugins: [
    admin(),
    mcp({
      loginPage: 'http://localhost:3002/cli/signin',
    }),
    reactStartCookies(),
  ],
  trustedOrigins:
    process.env.NODE_ENV === 'production'
      ? [
          process.env.CORS_ORIGIN,
          `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`,
        ].filter((s): s is string => !!s)
      : [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:3002',
        ],
  socialProviders: {
    github: {
      enabled: true,
      clientId: env ? env.SOCIAL_GITHUB_CLIENT_ID : '',
      clientSecret: env ? env.SOCIAL_GITHUB_CLIENT_SECRET : '',
    },
  },
})
