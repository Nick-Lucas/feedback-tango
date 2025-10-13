import { Feedbacks } from '@feedback-thing/db'
import { eq } from 'drizzle-orm'
import { authedServerFn } from './core'
import { getDb, authz } from './core.server'
import z from 'zod'

export const getFeedback = authedServerFn()
  .inputValidator(
    z.object({
      feedbackId: z.string(),
    })
  )
  .handler(async (ctx) => {
    const { feedbackId } = ctx.data

    // Check if user has access to this feedback
    await authz.checkFeedbackAccessAndThrow(ctx.context.user.id, [feedbackId])

    const feedback = await getDb().query.Feedbacks.findFirst({
      where: eq(Feedbacks.id, feedbackId),
    })

    if (!feedback) {
      throw new Error('Feedback not found')
    }

    return feedback
  })
