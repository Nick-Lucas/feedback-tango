import { RawFeedbacks } from '@feedback-thing/db'
import { eq, and, isNull } from 'drizzle-orm'
import { checkFeedbackSafety } from './safety-checker.agent.ts'

import type { TaskOpts } from './tasks.ts'

export async function processSafetyCheck({ tx }: TaskOpts) {
  const [rawFeedback] = await tx
    .select()
    .from(RawFeedbacks)
    .where(
      and(
        isNull(RawFeedbacks.safetyCheckComplete),
        isNull(RawFeedbacks.processingError)
      )
    )
    .limit(1)
    .for('update')

  if (!rawFeedback) {
    return null
  }

  console.log(`\nRunning safety check for raw feedback ${rawFeedback.id}...`)

  try {
    const safetyGrade = await checkFeedbackSafety(rawFeedback.content)
    console.log('Safety check result:', safetyGrade.object.outcome)

    if (safetyGrade.object.outcome === 'unsafe') {
      console.log('Feedback marked as unsafe, storing reason...')
      await tx
        .update(RawFeedbacks)
        .set({
          safetyCheckComplete: new Date(),
          processingError: `Unsafe content: ${safetyGrade.object.reason}`,
        })
        .where(eq(RawFeedbacks.id, rawFeedback.id))

      return { outcome: 'unsafe' as const, id: rawFeedback.id }
    }

    await tx
      .update(RawFeedbacks)
      .set({
        safetyCheckComplete: new Date(),
        processingError: null,
      })
      .where(eq(RawFeedbacks.id, rawFeedback.id))

    return { outcome: 'safe' as const, id: rawFeedback.id }
  } catch (error) {
    console.error(`Error in safety check for ${rawFeedback.id}:`, error)
    await tx
      .update(RawFeedbacks)
      .set({
        processingError:
          'Safety check error: ' +
          (error instanceof Error ? error.message : String(error)),
      })
      .where(eq(RawFeedbacks.id, rawFeedback.id))

    return {
      outcome: 'error' as const,
      error,
    }
  }
}
