import { RawFeedbacks } from '@feedback-thing/db'
import { eq } from 'drizzle-orm'
import { authedServerFn } from './core'
import { getDb, authz } from './core.server'
import z from 'zod'

export const getRawFeedbackDetails = authedServerFn()
  .inputValidator(
    z.object({
      rawFeedbackId: z.string(),
    })
  )
  .handler(async (ctx) => {
    const { rawFeedbackId } = ctx.data

    const db = getDb()

    const rawFeedbackWithDetails = await db.query.RawFeedbacks.findFirst({
      where: eq(RawFeedbacks.id, rawFeedbackId),
      with: {
        items: {
          with: {
            feedback: {
              with: {
                feature: true,
              },
            },
          },
        },
      },
    })

    if (!rawFeedbackWithDetails) {
      throw new Error('Raw feedback not found')
    }

    // Check if user has access to this project
    await authz.checkProjectAccessAndThrow(
      ctx.context.user.id,
      rawFeedbackWithDetails.projectId
    )

    return rawFeedbackWithDetails
  })
