import { db } from '@feedback-thing/core'
import z from 'zod'
import { authedServerFn, authz } from './core'

export const getFeatures = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
    })
  )
  .handler(async (ctx) => {
    await authz.checkProjectAccessAndThrow(
      ctx.context.user.id,
      ctx.data.projectId
    )

    return db.query.Features.findMany({
      where(fields, operators) {
        return operators.eq(fields.projectId, ctx.data.projectId)
      },
      orderBy(fields, operators) {
        return operators.asc(fields.name)
      },
    })
  })
