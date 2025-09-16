import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db/db.ts'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'sqlite',
  }),
  socialProviders: {
    github: {
      enabled: true,
      clientId: process.env.SOCIAL_GITHUB_CLIENT_ID!,
      clientSecret: process.env.SOCIAL_GITHUB_CLIENT_SECRET!,
    },
  },
})
