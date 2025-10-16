import z from 'zod'
import { authedServerFn } from './core'
import { notFound } from '@tanstack/react-router'
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

    const feature = await getDb().query.Features.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, ctx.data.featureId)
      },
      with: {
        feedbacks: {
          with: {
            createdByUser: {
              columns: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy(fields, operators) {
            return operators.desc(fields.createdAt)
          },
        },
      },
    })

    if (!feature) {
      throw notFound()
    }

    return feature
  })
