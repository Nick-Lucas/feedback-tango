import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db/db.ts'
import { z } from 'zod'

const env = z
  .object({
    SOCIAL_GITHUB_CLIENT_ID: z.string().min(1),
    SOCIAL_GITHUB_CLIENT_SECRET: z.string().min(1),
  })
  .parse(process.env)

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  socialProviders: {
    github: {
      enabled: true,
      clientId: env.SOCIAL_GITHUB_CLIENT_ID,
      clientSecret: env.SOCIAL_GITHUB_CLIENT_SECRET,
    },
  },
})
