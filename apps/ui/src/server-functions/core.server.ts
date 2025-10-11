import { createDb, type Db } from '@feedback-thing/db'
import { AuthorizationChecks } from '@feedback-thing/core'

let db: Db | undefined = undefined
export function getDb() {
  if (!db) {
    db = createDb()
  }
  return db
}
export const authz = new AuthorizationChecks(getDb)
