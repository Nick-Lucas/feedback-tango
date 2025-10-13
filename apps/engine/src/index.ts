import { setTimeout } from 'timers/promises'
import { db } from './db.ts'
import { RawFeedbacks } from '@feedback-thing/db'
import { and, isNull } from 'drizzle-orm'
import { processRawFeedback } from './feedback/process-raw-feedback.ts'
import { findAgentUser } from './feedback/agent-user.ts'

// TODO: Eventually we want to process data given an event from postgres or a queue
// But for a prototype we can just poll the database
while (true) {
  console.log('Checking for new feedback...')

  // Get agent user ID once
  const agentUserId = await findAgentUser()
  console.log('Agent user ID:', agentUserId)

  await db.transaction(async (tx) => {
    // By using "FOR UPDATE" we can ensure that multiple instances of this
    // processing loop don't try to process the same feedback at the same time,
    // at least until this transaction is committed or rolled back
    const queryResult = await tx
      .select()
      .from(RawFeedbacks)
      .where(
        and(
          isNull(RawFeedbacks.featureAssociationComplete),

          // TODO: implement retries and/or dead letter queue
          isNull(RawFeedbacks.processingError)
        )
      )
      .limit(1)
      .for('update')

    if (queryResult.length === 0) {
      console.log('No new feedback found, sleeping...')

      await setTimeout(5000)

      return
    }
    const rawFeedback = queryResult[0]!

    const result = await Promise.race([
      setTimeout(2 * 60 * 1000).then(() => 'TIMEOUT' as const),

      // TODO: might need to pass in an abort signal and check it frequently to avoid tx writes on a rolled back transaction logging weird errors
      processRawFeedback({ tx, rawFeedback, agentUserId }),
    ])

    if (result === 'TIMEOUT') {
      console.log('Processing timed out, marking feedback with error...')

      throw new Error('Processing timed out')
    }
  })
}
