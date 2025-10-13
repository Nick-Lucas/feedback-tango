#!/usr/bin/env node
import { db } from '../app.ts'
import { RawFeedbacks, Feedbacks } from '@feedback-thing/db'
import { isNull, eq } from 'drizzle-orm'
import { checkFeedbackSafety } from './feedback-safety.ts'
import { handleFeedbackWithAgent } from './feedback-agent.ts'
import { findAgentUser } from './agent-user.ts'

async function processRawFeedback() {
  console.log('Starting raw feedback processing...')

  // Get agent user ID once
  const agentUserId = await findAgentUser()
  console.log('Agent user ID:', agentUserId)

  // Find all unprocessed raw feedback (where safety check is not complete)
  const unprocessedFeedback = await db.query.RawFeedbacks.findMany({
    where: isNull(RawFeedbacks.safetyCheckComplete),
    limit: 100, // Process in batches
  })

  console.log(`Found ${unprocessedFeedback.length} unprocessed feedback items`)

  for (const rawFeedback of unprocessedFeedback) {
    console.log(`\nProcessing raw feedback ${rawFeedback.id}...`)

    try {
      // Step 1: Safety check
      console.log('Running safety check...')
      const safetyGrade = await checkFeedbackSafety(rawFeedback.feedback)
      console.log('Safety check result:', safetyGrade.object.outcome)

      // Update safety check completion
      await db
        .update(RawFeedbacks)
        .set({
          safetyCheckComplete: new Date(),
        })
        .where(eq(RawFeedbacks.id, rawFeedback.id))

      if (safetyGrade.object.outcome === 'unsafe') {
        console.log('Feedback marked as unsafe, storing reason...')
        await db
          .update(RawFeedbacks)
          .set({
            processingError: `Unsafe content: ${safetyGrade.object.reason}`,
          })
          .where(eq(RawFeedbacks.id, rawFeedback.id))
        continue
      }

      // Step 2: Feature association
      console.log('Running feature association...')
      const feature = await handleFeedbackWithAgent({
        projectId: rawFeedback.projectId,
        agentUserId,
        feedback: rawFeedback.feedback,
      })

      if (feature.type === 'error') {
        console.error('Failed to determine feature:', feature.error)
        await db
          .update(RawFeedbacks)
          .set({
            processingError: `Feature association failed: ${feature.error.message}`,
          })
          .where(eq(RawFeedbacks.id, rawFeedback.id))
        continue
      }

      console.log('Feature determined:', feature.featureId)

      // Update feature association completion
      await db
        .update(RawFeedbacks)
        .set({
          featureAssociationComplete: new Date(),
        })
        .where(eq(RawFeedbacks.id, rawFeedback.id))

      // Step 3: Create final feedback entry
      console.log('Creating final feedback entry...')
      const [finalFeedback] = await db
        .insert(Feedbacks)
        .values({
          projectId: rawFeedback.projectId,
          featureId: feature.featureId,
          feedback: rawFeedback.feedback,
          createdBy: rawFeedback.email ?? 'anonymous',
        })
        .returning()

      if (!finalFeedback) {
        console.error('Failed to create final feedback entry')
        continue
      }

      console.log('Final feedback created:', finalFeedback.id)

      // Link the raw feedback to the final feedback
      await db
        .update(RawFeedbacks)
        .set({
          processedFeedbackId: finalFeedback.id,
        })
        .where(eq(RawFeedbacks.id, rawFeedback.id))

      console.log(`Successfully processed raw feedback ${rawFeedback.id}`)
    } catch (error) {
      console.error(`Error processing raw feedback ${rawFeedback.id}:`, error)
      await db
        .update(RawFeedbacks)
        .set({
          processingError:
            error instanceof Error ? error.message : String(error),
        })
        .where(eq(RawFeedbacks.id, rawFeedback.id))
    }
  }

  console.log('\nRaw feedback processing complete')
}

// Run the script
processRawFeedback()
  .then(() => {
    console.log('Script finished successfully')
    process.exit(0)
  })
  .catch((error) => {
    console.error('Script failed:', error)
    process.exit(1)
  })
