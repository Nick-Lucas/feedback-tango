import { createDb } from '@feedback-thing/db'

export const db = createDb()
export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0]
