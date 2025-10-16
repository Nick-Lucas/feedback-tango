import { RawFeedbacks, RawFeedbackItems } from '@feedback-thing/db'
import { eq, and, isNull } from 'drizzle-orm'
import { splitFeedback } from './feedback-splitter.agent.ts'

import type { TaskOpts } from './tasks.ts'

export async function processSplitting({ tx }: TaskOpts) {
  const [rawFeedback] = await tx
    .select()
    .from(RawFeedbacks)
    .where(
      and(
        isNull(RawFeedbacks.splittingComplete),
        isNull(RawFeedbacks.processingError)
      )
    )
    .limit(1)
    .for('update')

  if (!rawFeedback) {
    return null
  }

  console.log(`\nSplitting feedback for raw feedback ${rawFeedback.id}...`)

  try {
    const splitResult = await splitFeedback(rawFeedback.content)
    console.log(
      `Feedback split into ${splitResult.object.feedbacks.length} item(s)`
    )

    // Create RawFeedbackItem entries for each split item
    const rawFeedbackItems = await tx
      .insert(RawFeedbackItems)
      .values(
        splitResult.object.feedbacks.map((feedbackText) => ({
          rawFeedbackId: rawFeedback.id,
          content: feedbackText,
        }))
      )
      .returning()

    await tx
      .update(RawFeedbacks)
      .set({
        splittingComplete: new Date(),
        processingError: null,
      })
      .where(eq(RawFeedbacks.id, rawFeedback.id))

    console.log(`Created ${rawFeedbackItems.length} raw feedback item(s)`)

    return {
      outcome: 'success' as const,
      id: rawFeedback.id,
      itemCount: rawFeedbackItems.length,
    }
  } catch (error) {
    console.error(`Error splitting feedback ${rawFeedback.id}:`, error)
    await tx
      .update(RawFeedbacks)
      .set({
        processingError:
          'Splitting error: ' +
          (error instanceof Error ? error.message : String(error)),
      })
      .where(eq(RawFeedbacks.id, rawFeedback.id))

    return {
      outcome: 'error' as const,
      error,
    }
  }
}
