import type { Transaction } from '../db.ts'

export interface TaskOpts {
  tx: Transaction
  agentUserId: string
}
