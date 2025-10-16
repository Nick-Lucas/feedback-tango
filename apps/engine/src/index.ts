import { setTimeout } from 'timers/promises'
import { db } from './db.ts'
import {
  processSafetyCheck,
  processSplitting,
  processSentiment,
  processFeatureAssociation,
} from './feedback/process-raw-feedback.ts'
import { findAgentUser } from './feedback/agent-user.ts'

// Get agent user ID once at startup
const agentUserId = await findAgentUser()
console.log('Agent user ID:', agentUserId)

// TODO: Eventually we want to process data given an event from postgres or a queue
// But for a prototype we can just poll the database
while (true) {
  console.log('Checking for work...')

  let workFound = false

  await db
    .transaction(async (tx) => {
      const result = await Promise.race([
        setTimeout(2 * 60 * 1000).then(() => 'TIMEOUT' as const),
        processSafetyCheck(tx),
      ])

      if (result === 'TIMEOUT') {
        console.log('Safety check timed out... rolling back transaction')
        tx.rollback()
        return
      }

      if (result) {
        workFound = true
      }
    })
    .catch((err) => {
      console.error('Safety check transaction error:', err)
    })

  await db
    .transaction(async (tx) => {
      const result = await Promise.race([
        setTimeout(2 * 60 * 1000).then(() => 'TIMEOUT' as const),
        processSplitting(tx),
      ])

      if (result === 'TIMEOUT') {
        console.log('Splitting timed out... rolling back transaction')
        tx.rollback()
        return
      }

      if (result) {
        workFound = true
      }
    })
    .catch((err) => {
      console.error('Splitting transaction error:', err)
    })

  await db
    .transaction(async (tx) => {
      const result = await Promise.race([
        setTimeout(2 * 60 * 1000).then(() => 'TIMEOUT' as const),
        processSentiment(tx),
      ])

      if (result === 'TIMEOUT') {
        console.log('Sentiment check timed out... rolling back transaction')
        tx.rollback()
        return
      }

      if (result) {
        workFound = true
      }
    })
    .catch((err) => {
      console.error('Sentiment check transaction error:', err)
    })

  await db
    .transaction(async (tx) => {
      const result = await Promise.race([
        setTimeout(2 * 60 * 1000).then(() => 'TIMEOUT' as const),
        processFeatureAssociation(tx, agentUserId),
      ])

      if (result === 'TIMEOUT') {
        console.log('Feature association timed out... rolling back transaction')
        tx.rollback()
        return
      }

      if (result) {
        workFound = true
      }
    })
    .catch((err) => {
      console.error('Feature association transaction error:', err)
    })

  // If no work was found in any step, sleep before checking again
  if (!workFound) {
    console.log('No work found, sleeping...')
    await setTimeout(5000)
  }
}
