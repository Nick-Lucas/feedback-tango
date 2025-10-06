import postgres from 'postgres'
import {} from 'drizzle-orm/migrator'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema.ts'

export function createDb(opts?: { ignoreMissingConnectionString?: boolean }) {
  const connectionString = process.env.POSTGRES_URI!
  if (!connectionString && !opts?.ignoreMissingConnectionString) {
    throw new Error('POSTGRES_URI is not set')
  }

  const client = postgres(connectionString, { username: 'postgres' })

  return drizzle(client, { schema })
}
