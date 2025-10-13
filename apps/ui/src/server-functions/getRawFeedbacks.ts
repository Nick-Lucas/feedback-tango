import { RawFeedbacks } from '@feedback-thing/db'
import { eq, desc } from 'drizzle-orm'
import { authedServerFn } from './core'
import { getDb, authz } from './core.server'
import z from 'zod'

export const getRawFeedbacks = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
    })
  )
  .handler(async (ctx) => {
    const { projectId } = ctx.data

    // Check if user has access to this project
    await authz.checkProjectAccessAndThrow(ctx.context.user.id, projectId)

    const rawFeedbacks = await getDb()
      .select()
      .from(RawFeedbacks)
      .where(eq(RawFeedbacks.projectId, projectId))
      .orderBy(desc(RawFeedbacks.createdAt))

    return rawFeedbacks
  })
