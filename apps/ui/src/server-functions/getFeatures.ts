import z from 'zod'
import { authedServerFn } from './core'
import { authz, getDb } from './core.server'

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

    return getDb().query.Features.findMany({
      where(fields, operators) {
        return operators.eq(fields.projectId, ctx.data.projectId)
      },
      orderBy(fields, operators) {
        return operators.asc(fields.name)
      },
    })
  })
