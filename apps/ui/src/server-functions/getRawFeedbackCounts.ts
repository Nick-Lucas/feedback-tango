import { RawFeedbacks } from '@feedback-thing/db'
import { eq, isNull, isNotNull, and, count } from 'drizzle-orm'
import { authedServerFn } from './core'
import { getDb, authz } from './core.server'
import z from 'zod'

export const getRawFeedbackCounts = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
    })
  )
  .handler(async (ctx) => {
    const { projectId } = ctx.data

    // Check if user has access to this project
    await authz.checkProjectAccessAndThrow(ctx.context.user.id, projectId)

    const db = getDb()

    // Get all counts in a single query using conditional aggregation
    const [result] = await db
      .select({
        total: count(),
        pending: count(
          and(
            isNull(RawFeedbacks.featureAssociationComplete),
            isNull(RawFeedbacks.processingError)
          )
        ),
        completed: count(isNotNull(RawFeedbacks.featureAssociationComplete)),
        errors: count(isNotNull(RawFeedbacks.processingError)),
      })
      .from(RawFeedbacks)
      .where(eq(RawFeedbacks.projectId, projectId))

    return result || { total: 0, pending: 0, completed: 0, errors: 0 }
  })
