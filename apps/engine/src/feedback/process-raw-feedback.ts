import { RawFeedbacks, RawFeedbackItems, Feedbacks } from '@feedback-thing/db'
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
    const safetyGrade = await checkFeedbackSafety(rawFeedback.content)
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
    const splitResult = await splitFeedback(rawFeedback.content)
    console.log(
      `Feedback split into ${splitResult.object.feedbacks.length} item(s)`
    )

    // Create RawFeedbackItem entries for each split item
    const rawFeedbackItems = []
    for (const feedbackText of splitResult.object.feedbacks) {
      const [item] = await tx
        .insert(RawFeedbackItems)
        .values({
          rawFeedbackId: rawFeedback.id,
          content: feedbackText,
        })
        .returning()

      if (!item) {
        throw new Error('Failed to create raw feedback item')
      }
      rawFeedbackItems.push(item)
    }

    // Update splitting completion
    await tx
      .update(RawFeedbacks)
      .set({
        splittingComplete: new Date(),
        processingError: null,
      })
      .where(eq(RawFeedbacks.id, rawFeedback.id))

    console.log(
      `Created ${rawFeedbackItems.length} raw feedback item(s), now processing each...`
    )

    // Process each raw feedback item
    const processedFeedbacks: Array<typeof Feedbacks.$inferSelect> = []
    for (const [index, item] of rawFeedbackItems.entries()) {
      console.log(`\nProcessing feedback item ${index + 1}...`)

      try {
        // Step 3: Check sentiment for this feedback item
        console.log('Running sentiment check...')
        const sentimentResult = await checkFeedbackSentiment(item.content)
        console.log('Sentiment result:', sentimentResult.object.outcome)

        // Update sentiment check completion for this item
        await tx
          .update(RawFeedbackItems)
          .set({
            sentimentCheckComplete: new Date(),
            sentimentCheckResult: sentimentResult.object.outcome,
            processingError: null,
          })
          .where(eq(RawFeedbackItems.id, item.id))

        // Step 4: Feature association for this feedback item
        console.log('Running feature association...')
        const feature = await associateFeatureWithFeedback({
          projectId: rawFeedback.projectId,
          agentUserId,
          feedback: item.content,
        })

        if (feature.type === 'error') {
          console.error('Failed to determine feature:', feature.error)
          await tx
            .update(RawFeedbackItems)
            .set({
              processingError: `Feature association failed: ${feature.error.message}`,
            })
            .where(eq(RawFeedbackItems.id, item.id))

          // Continue processing other items
          continue
        }

        console.log('Feature determined:', feature.featureId)

        // Update feature association completion for this item
        await tx
          .update(RawFeedbackItems)
          .set({
            featureAssociationComplete: new Date(),
            processingError: null,
          })
          .where(eq(RawFeedbackItems.id, item.id))

        // Step 5: Create final feedback entry for this item
        console.log('Creating final feedback entry...')
        const [finalFeedback] = await tx
          .insert(Feedbacks)
          .values({
            projectId: rawFeedback.projectId,
            featureId: feature.featureId,
            content: item.content,
            createdBy: agentUserId,
            rawFeedbackItemId: item.id,
          })
          .returning()

        if (!finalFeedback) {
          console.error('Failed to create final feedback entry')
          throw new Error('Failed to create final feedback entry')
        }

        console.log('Final feedback created:', finalFeedback.id)
        processedFeedbacks.push(finalFeedback)
      } catch (itemError) {
        console.error(
          `Error processing raw feedback item ${item.id}:`,
          itemError
        )
        await tx
          .update(RawFeedbackItems)
          .set({
            processingError:
              'Unknown Error: ' +
              (itemError instanceof Error
                ? itemError.message
                : String(itemError)),
          })
          .where(eq(RawFeedbackItems.id, item.id))
        // Continue processing other items
      }
    }

    console.log(
      `Successfully processed raw feedback ${rawFeedback.id} into ${processedFeedbacks.length} feedback item(s)`
    )

    // Check if all items are complete and mark processingComplete
    const allItemsComplete = rawFeedbackItems.every((item) =>
      processedFeedbacks.some((pf) => pf.rawFeedbackItemId === item.id)
    )

    if (allItemsComplete && rawFeedbackItems.length > 0) {
      await tx
        .update(RawFeedbacks)
        .set({
          processingComplete: new Date(),
        })
        .where(eq(RawFeedbacks.id, rawFeedback.id))
      console.log('All items processed successfully, marking as complete')
    }
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
