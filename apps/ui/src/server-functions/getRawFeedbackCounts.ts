import { RawFeedbacks } from '@feedback-thing/db'
import { eq, count, and, isNull, isNotNull } from 'drizzle-orm'
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

    await authz.checkProjectAccessAndThrow(ctx.context.user.id, projectId)

    const db = getDb()

    const [result] = await db
      .select({
        total: count(),
        pending: db.$count(
          RawFeedbacks,
          and(
            eq(RawFeedbacks.projectId, projectId),
            isNull(RawFeedbacks.processingComplete),
            isNull(RawFeedbacks.processingError)
          )
        ),
        completed: db.$count(
          RawFeedbacks,
          and(
            eq(RawFeedbacks.projectId, projectId),
            isNotNull(RawFeedbacks.processingComplete)
          )
        ),
        errors: db.$count(
          RawFeedbacks,
          and(
            eq(RawFeedbacks.projectId, projectId),
            isNotNull(RawFeedbacks.processingError)
          )
        ),
      })
      .from(RawFeedbacks)
      .where(eq(RawFeedbacks.projectId, projectId))

    return result
  })
