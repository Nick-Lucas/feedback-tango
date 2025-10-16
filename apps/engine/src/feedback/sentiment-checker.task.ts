import { RawFeedbackItems } from '@feedback-thing/db'
import { eq, and, isNull } from 'drizzle-orm'
import { checkFeedbackSentiment } from './sentiment-checker.agent.ts'

import type { TaskOpts } from './tasks.ts'

export async function processSentiment({ tx }: TaskOpts) {
  const [item] = await tx
    .select()
    .from(RawFeedbackItems)
    .where(
      and(
        isNull(RawFeedbackItems.sentimentCheckComplete),
        isNull(RawFeedbackItems.processingError)
      )
    )
    .limit(1)
    .for('update')

  if (!item) {
    return null
  }

  console.log(`\nRunning sentiment check for item ${item.id}...`)

  try {
    const sentimentResult = await checkFeedbackSentiment(item.content)
    console.log('Sentiment result:', sentimentResult.object.outcome)

    await tx
      .update(RawFeedbackItems)
      .set({
        sentimentCheckComplete: new Date(),
        sentimentCheckResult: sentimentResult.object.outcome,
        processingError: null,
      })
      .where(eq(RawFeedbackItems.id, item.id))

    return {
      outcome: 'success' as const,
      id: item.id,
      sentiment: sentimentResult.object.outcome,
    }
  } catch (error) {
    console.error(`Error checking sentiment for item ${item.id}:`, error)
    await tx
      .update(RawFeedbackItems)
      .set({
        processingError:
          'Sentiment check error: ' +
          (error instanceof Error ? error.message : String(error)),
      })
      .where(eq(RawFeedbackItems.id, item.id))

    return {
      outcome: 'error' as const,
      error,
    }
  }
}
