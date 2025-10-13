import { RawFeedbacks } from '@feedback-thing/db'
import { eq, desc, isNull, isNotNull, and } from 'drizzle-orm'
import { authedServerFn } from './core'
import { getDb, authz } from './core.server'
import z from 'zod'

export const getRawFeedbacks = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
      filter: z.enum(['all', 'pending', 'completed', 'errors']).optional(),
    })
  )
  .handler(async (ctx) => {
    const { projectId, filter = 'pending' } = ctx.data

    // Check if user has access to this project
    await authz.checkProjectAccessAndThrow(ctx.context.user.id, projectId)

    const db = getDb()

    // Build where conditions based on filter
    let whereConditions = eq(RawFeedbacks.projectId, projectId)

    if (filter === 'pending') {
      // Not completed and no errors
      whereConditions = and(
        whereConditions,
        isNull(RawFeedbacks.featureAssociationComplete),
        isNull(RawFeedbacks.processingError)
      )!
    } else if (filter === 'completed') {
      // Feature association complete
      whereConditions = and(
        whereConditions,
        isNotNull(RawFeedbacks.featureAssociationComplete)
      )!
    } else if (filter === 'errors') {
      // Has processing error
      whereConditions = and(
        whereConditions,
        isNotNull(RawFeedbacks.processingError)
      )!
    }

    // Query with filtering and sorting
    // Sort by processing state (furthest along at the top)
    const rawFeedbacks = await db
      .select()
      .from(RawFeedbacks)
      .where(whereConditions)
      .orderBy(
        // Completed items first (nulls last)
        desc(RawFeedbacks.featureAssociationComplete),
        // Then safety check complete (nulls last)
        desc(RawFeedbacks.safetyCheckComplete),
        // Then by creation date (newest first)
        desc(RawFeedbacks.createdAt)
      )

    return rawFeedbacks
  })
