import {
  Feedbacks,
  Features,
  RawFeedbacks,
  RawFeedbackItems,
} from '@feedback-thing/db'
import { eq, inArray } from 'drizzle-orm'
import z from 'zod'
import { authedServerFn } from './core'
import { authz, getDb } from './core.server'

export const reprocessAllFeedback = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string().min(1),
    })
  )
  .handler(async (ctx) => {
    // Check project access
    await authz.checkProjectAccessAndThrow(
      ctx.context.user.id,
      ctx.data.projectId
    )

    return await getDb().transaction(async (tx) => {
      // Delete all feedbacks for this project
      await tx
        .delete(Feedbacks)
        .where(eq(Feedbacks.projectId, ctx.data.projectId))

      // Delete all features for this project
      await tx
        .delete(Features)
        .where(eq(Features.projectId, ctx.data.projectId))

      // Get all raw feedback IDs for this project
      const rawFeedbacks = await tx.query.RawFeedbacks.findMany({
        where: eq(RawFeedbacks.projectId, ctx.data.projectId),
        columns: {
          id: true,
        },
      })

      const rawFeedbackIds = rawFeedbacks.map((rf) => rf.id)

      if (rawFeedbackIds.length > 0) {
        await tx
          .delete(RawFeedbackItems)
          .where(inArray(RawFeedbackItems.rawFeedbackId, rawFeedbackIds))

        await tx
          .update(RawFeedbacks)
          .set({
            safetyCheckComplete: null,
            splittingComplete: null,
            processingComplete: null,
            processingError: null,
          })
          .where(eq(RawFeedbacks.projectId, ctx.data.projectId))
      }

      return { success: true, clearedCount: rawFeedbackIds.length }
    })
  })
