import z from 'zod'
import { authedServerFn } from './core'

import { authz, getDb } from './core.server'

export const getFeature = authedServerFn()
  .inputValidator(
    z.object({
      featureId: z.string(),
    })
  )
  .handler(async (ctx) => {
    await authz.checkFeatureAccessAndThrow(ctx.context.user.id, [
      ctx.data.featureId,
    ])

    return getDb().query.Features.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, ctx.data.featureId)
      },
      with: {
        feedbacks: {
          with: {
            createdByUser: true,
          },
          orderBy(fields, operators) {
            return operators.desc(fields.createdAt)
          },
        },
      },
    })
  })
