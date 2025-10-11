import { getDb } from './core'
import { Feedbacks } from '@feedback-thing/db'
import { eq } from 'drizzle-orm'
import z from 'zod'
import { authedServerFn, authz } from './core'

export const moveFeedbackToFeature = authedServerFn()
  .inputValidator(
    z.object({
      feedbackId: z.string().min(1),
      featureId: z.string().min(1),
    })
  )
  .handler(async (ctx) => {
    await authz.checkFeedbackAccessAndThrow(ctx.context.user.id, [
      ctx.data.feedbackId,
    ])

    const feature = await getDb().query.Features.findFirst({
      with: {
        project: {
          with: {
            members: {
              where(fields, operators) {
                return operators.eq(fields.userId, ctx.context.user.id)
              },
            },
          },
        },
      },
      where(fields) {
        return eq(fields.id, ctx.data.featureId)
      },
    })

    if (!feature) {
      throw new Error('Feature Not Found')
    }

    await getDb()
      .update(Feedbacks)
      .set({ featureId: ctx.data.featureId })
      .where(eq(Feedbacks.id, ctx.data.feedbackId))

    return { success: true }
  })
