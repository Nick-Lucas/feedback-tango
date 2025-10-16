import { RawFeedbacks, RawFeedbackItems, Feedbacks } from '@feedback-thing/db'
import { eq, and, isNull } from 'drizzle-orm'
import { checkFeedbackSafety } from './safety-checker.agent.ts'
import { splitFeedback } from './feedback-splitter.agent.ts'
import { checkFeedbackSentiment } from './sentiment-checker.agent.ts'
import { associateFeatureWithFeedback } from './feature-associator.agent.ts'

import type { Transaction } from '../db.ts'

export async function processSafetyCheck(tx: Transaction) {
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

export async function processSplitting(tx: Transaction) {
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

export async function processSentiment(tx: Transaction) {
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

export async function processFeatureAssociation(
  tx: Transaction,
  agentUserId: string
) {
  const [item] = await tx
    .select({
      item: RawFeedbackItems,
      rawFeedback: RawFeedbacks,
    })
    .from(RawFeedbackItems)
    .innerJoin(
      RawFeedbacks,
      eq(RawFeedbackItems.rawFeedbackId, RawFeedbacks.id)
    )
    .where(
      and(
        isNull(RawFeedbackItems.featureAssociationComplete),
        isNull(RawFeedbackItems.processingError)
      )
    )
    .limit(1)
    .for('update')

  if (!item) {
    return null
  }

  console.log(`\nProcessing feature association for item ${item.item.id}...`)

  try {
    const feature = await associateFeatureWithFeedback({
      projectId: item.rawFeedback.projectId,
      agentUserId,
      feedback: item.item.content,
    })

    if (feature.type === 'error') {
      console.error('Failed to determine feature:', feature.error)
      await tx
        .update(RawFeedbackItems)
        .set({
          processingError: `Feature association failed: ${feature.error.message}`,
        })
        .where(eq(RawFeedbackItems.id, item.item.id))

      return { outcome: 'error' as const, id: item.item.id }
    }

    console.log('Feature determined:', feature.featureId)

    await tx
      .update(RawFeedbackItems)
      .set({
        featureAssociationComplete: new Date(),
        processingError: null,
      })
      .where(eq(RawFeedbackItems.id, item.item.id))

    // Create final feedback entry
    console.log('Creating final feedback entry...')
    const [finalFeedback] = await tx
      .insert(Feedbacks)
      .values({
        projectId: item.rawFeedback.projectId,
        featureId: feature.featureId,
        content: item.item.content,
        createdBy: agentUserId,
        rawFeedbackItemId: item.item.id,
      })
      .returning()

    if (!finalFeedback) {
      throw new Error('Failed to create final feedback entry')
    }

    console.log('Final feedback created:', finalFeedback.id)

    // Check if this was the last item for the parent raw feedback
    const allItems = await tx
      .select()
      .from(RawFeedbackItems)
      .where(eq(RawFeedbackItems.rawFeedbackId, item.rawFeedback.id))

    const allComplete = allItems.every((i) => i.featureAssociationComplete)

    if (allComplete) {
      await tx
        .update(RawFeedbacks)
        .set({
          processingComplete: new Date(),
        })
        .where(eq(RawFeedbacks.id, item.rawFeedback.id))
      console.log(
        `All items for raw feedback ${item.rawFeedback.id} are complete`
      )
    }

    return {
      outcome: 'success' as const,
      id: item.item.id,
      feedbackId: finalFeedback.id,
    }
  } catch (error) {
    console.error(
      `Error in feature association for item ${item.item.id}:`,
      error
    )
    await tx
      .update(RawFeedbackItems)
      .set({
        processingError:
          'Feature association error: ' +
          (error instanceof Error ? error.message : String(error)),
      })
      .where(eq(RawFeedbackItems.id, item.item.id))

    return {
      outcome: 'error' as const,
      error,
    }
  }
}
