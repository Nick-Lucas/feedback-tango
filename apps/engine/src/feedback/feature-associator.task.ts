import { RawFeedbacks, RawFeedbackItems, Feedbacks } from '@feedback-thing/db'
import { eq, and, isNull } from 'drizzle-orm'
import { associateFeatureWithFeedback } from './feature-associator.agent.ts'

import type { TaskOpts } from './tasks.ts'

export async function processFeatureAssociation({ tx, agentUserId }: TaskOpts) {
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
        sentiment: item.item.sentimentCheckResult,
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
