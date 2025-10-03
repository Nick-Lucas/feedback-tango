import postgres from 'postgres'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema.ts'

export function createDb() {
  const connectionString = process.env.POSTGRES_URI!
  if (!connectionString) {
    throw new Error('POSTGRES_URI is not set')
  }

  const client = postgres(connectionString, { username: 'postgres' })

  return drizzle(client, { schema })
}
