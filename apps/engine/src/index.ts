import { setTimeout } from 'timers/promises'
import { db } from './db.ts'
import { processSafetyCheck } from './feedback/safety-checker.task.ts'
import { processSplitting } from './feedback/feedback-splitter.task.ts'
import { processSentiment } from './feedback/sentiment-checker.task.ts'
import { processFeatureAssociation } from './feedback/feature-associator.task.ts'
import { findAgentUser } from './feedback/agent-user.ts'

// Get agent user ID once at startup
const agentUserId = await findAgentUser()
console.log('Agent user ID:', agentUserId)

const tasks = [
  processSafetyCheck,
  processSplitting,
  processSentiment,
  processFeatureAssociation,
]

// TODO: Eventually we want to process data given an event from postgres or a queue
// But for a prototype we can just poll the database
while (true) {
  console.log('Checking for work...')

  let workFound = false

  for (const task of tasks) {
    console.log(`Running task: ${task.name}`)

    await db
      .transaction(async (tx) => {
        const result = await Promise.race([
          setTimeout(2 * 60 * 1000).then(() => 'TIMEOUT' as const),
          task({ tx, agentUserId }),
        ])

        if (result === 'TIMEOUT') {
          console.log(`${task.name} timed out... rolling back transaction`)
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
  }

  // If no work was found in any step, sleep before checking again
  if (!workFound) {
    console.log('No work found, sleeping...')
    await setTimeout(5000)
  }
}
