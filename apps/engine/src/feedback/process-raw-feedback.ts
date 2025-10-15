import { RawFeedbacks, Feedbacks } from '@feedback-thing/db'
import { eq } from 'drizzle-orm'
import { checkFeedbackSafety } from './safety-checker.agent.ts'
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

    // Step 2: Feature association
    console.log('Running feature association...')
    const feature = await associateFeatureWithFeedback({
      projectId: rawFeedback.projectId,
      agentUserId,
      feedback: rawFeedback.feedback,
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

    // Update feature association completion
    await tx
      .update(RawFeedbacks)
      .set({
        featureAssociationComplete: new Date(),
      })
      .where(eq(RawFeedbacks.id, rawFeedback.id))

    // Step 3: Create final feedback entry
    console.log('Creating final feedback entry...')
    const [finalFeedback] = await tx
      .insert(Feedbacks)
      .values({
        projectId: rawFeedback.projectId,
        featureId: feature.featureId,
        feedback: rawFeedback.feedback,
        createdBy: agentUserId,
      })
      .returning()

    if (!finalFeedback) {
      console.error('Failed to create final feedback entry')

      throw new Error('Failed to create final feedback entry')
    }

    console.log('Final feedback created:', finalFeedback.id)

    // Link the raw feedback to the final feedback
    await tx
      .update(RawFeedbacks)
      .set({
        processedFeedbackId: finalFeedback.id,
      })
      .where(eq(RawFeedbacks.id, rawFeedback.id))

    console.log(`Successfully processed raw feedback ${rawFeedback.id}`)
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
