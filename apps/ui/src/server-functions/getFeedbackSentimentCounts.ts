import { Feedbacks } from '@feedback-thing/db'
import { eq, count, and } from 'drizzle-orm'
import { authedServerFn } from './core'
import { getDb, authz } from './core.server'
import z from 'zod'

export const getFeedbackSentimentCounts = authedServerFn()
  .inputValidator(
    z.object({
      featureId: z.string(),
    })
  )
  .handler(async (ctx) => {
    const { featureId } = ctx.data

    await authz.checkFeatureAccessAndThrow(ctx.context.user.id, [featureId])

    const db = getDb()

    const [result] = await db
      .select({
        total: count(),
        positive: db.$count(
          Feedbacks,
          and(
            eq(Feedbacks.featureId, featureId),
            eq(Feedbacks.sentiment, 'positive')
          )
        ),
        constructive: db.$count(
          Feedbacks,
          and(
            eq(Feedbacks.featureId, featureId),
            eq(Feedbacks.sentiment, 'constructive')
          )
        ),
        negative: db.$count(
          Feedbacks,
          and(
            eq(Feedbacks.featureId, featureId),
            eq(Feedbacks.sentiment, 'negative')
          )
        ),
      })
      .from(Feedbacks)
      .where(eq(Feedbacks.featureId, featureId))

    return result
  })
