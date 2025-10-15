import { RawFeedbacks, Feedbacks } from '@feedback-thing/db'
import { eq } from 'drizzle-orm'
import { checkFeedbackSafety } from './safety-checker.agent.ts'
import { splitFeedback } from './feedback-splitter.agent.ts'
import { checkFeedbackSentiment } from './sentiment-checker.agent.ts'
import { associateFeatureWithFeedback } from './feature-associator.agent.ts'

import type { Transaction } from '../db.ts'

interface ProcessorOpts {
  tx: Transaction
  rawFeedback: typeof RawFeedbacks.$inferSelect
  agentUserId: string
}

export async function processRawFeedback({
  rawFeedback,
  tx,
  agentUserId,
}: ProcessorOpts) {
  console.log('Starting raw feedback processing...')

  console.log(`\nProcessing raw feedback ${rawFeedback.id}...`)

  try {
    // Step 1: Safety check
    console.log('Running safety check...')
    const safetyGrade = await checkFeedbackSafety(rawFeedback.feedback)
    console.log('Safety check result:', safetyGrade.object.outcome)

    // Update safety check completion
    await tx
      .update(RawFeedbacks)
      .set({
        safetyCheckComplete: new Date(),
        processingError: null,
      })
      .where(eq(RawFeedbacks.id, rawFeedback.id))

    if (safetyGrade.object.outcome === 'unsafe') {
      console.log('Feedback marked as unsafe, storing reason...')
      await tx
        .update(RawFeedbacks)
        .set({
          processingError: `Unsafe content: ${safetyGrade.object.reason}`,
        })
        .where(eq(RawFeedbacks.id, rawFeedback.id))

      return {
        outcome: 'unsafe',
        reason: safetyGrade.object.reason,
      } as const
    }

    // Step 2: Split feedback into individual items
    console.log('Splitting feedback into individual items...')
    const splitResult = await splitFeedback(rawFeedback.feedback)
    console.log(
      `Feedback split into ${splitResult.object.feedbacks.length} item(s)`
    )

    // Process each split feedback item
    const processedFeedbacks = []
    for (const [
      index,
      feedbackText,
    ] of splitResult.object.feedbacks.entries()) {
      console.log(`\nProcessing feedback item ${index + 1}...`)

      // Step 3: Check sentiment for this feedback item
      console.log('Running sentiment check...')
      const sentimentResult = await checkFeedbackSentiment(feedbackText)
      console.log('Sentiment result:', sentimentResult.object.outcome)

      // Update sentiment check completion (only on the last item)
      if (index === splitResult.object.feedbacks.length - 1) {
        await tx
          .update(RawFeedbacks)
          .set({
            sentimentCheckComplete: new Date(),
            sentimentCheckResult: sentimentResult.object.outcome,
            processingError: null,
          })
          .where(eq(RawFeedbacks.id, rawFeedback.id))
      }

      // Step 4: Feature association for this feedback item
      console.log('Running feature association...')
      const feature = await associateFeatureWithFeedback({
        projectId: rawFeedback.projectId,
        agentUserId,
        feedback: feedbackText,
      })

      if (feature.type === 'error') {
        console.error('Failed to determine feature:', feature.error)
        await tx
          .update(RawFeedbacks)
          .set({
            processingError: `Feature association failed: ${feature.error.message}`,
          })
          .where(eq(RawFeedbacks.id, rawFeedback.id))

        return {
          outcome: 'error',
          reason: feature.error,
        }
      }

      console.log('Feature determined:', feature.featureId)

      // Update feature association completion (only on the last item)
      if (index === splitResult.object.feedbacks.length - 1) {
        await tx
          .update(RawFeedbacks)
          .set({
            featureAssociationComplete: new Date(),
            processingError: null,
          })
          .where(eq(RawFeedbacks.id, rawFeedback.id))
      }

      // Step 5: Create final feedback entry for this item
      console.log('Creating final feedback entry...')
      const [finalFeedback] = await tx
        .insert(Feedbacks)
        .values({
          projectId: rawFeedback.projectId,
          featureId: feature.featureId,
          feedback: feedbackText,
          createdBy: agentUserId,
          rawFeedbackId: rawFeedback.id,
        })
        .returning()

      if (!finalFeedback) {
        console.error('Failed to create final feedback entry')
        throw new Error('Failed to create final feedback entry')
      }

      console.log('Final feedback created:', finalFeedback.id)
      processedFeedbacks.push(finalFeedback)
    }

    console.log(
      `Successfully processed raw feedback ${rawFeedback.id} into ${processedFeedbacks.length} feedback item(s)`
    )
  } catch (error) {
    console.error(`Error processing raw feedback ${rawFeedback.id}:`, error)
    await tx
      .update(RawFeedbacks)
      .set({
        processingError:
          'Unknown Error: ' +
          (error instanceof Error ? error.message : String(error)),
      })
      .where(eq(RawFeedbacks.id, rawFeedback.id))

    throw error
  }
}
