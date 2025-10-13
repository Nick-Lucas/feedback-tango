import { setTimeout } from 'timers/promises'
import { db } from './db.ts'
import { RawFeedbacks } from '@feedback-thing/db'
import { isNull, lt, or } from 'drizzle-orm'

const MINUTE_MS = 60 * 1000
const LOCK_TIMEOUT_MS = 1.5 * MINUTE_MS

// TODO: Eventually we want to process data given an event from postgres or a queue
// But for a prototype we can just poll the database
while (true) {
  await setTimeout(5000)

  console.log('Checking for new feedback...')

  db.update(RawFeedbacks).set({ lock: new Date() }).returning()
  db.select()
    .from(RawFeedbacks)
    .where(
      or(
        isNull(RawFeedbacks.lock),
        lt(RawFeedbacks.lock, new Date(Date.now() + LOCK_TIMEOUT_MS))
      )
    )
    .limit(10)
}
