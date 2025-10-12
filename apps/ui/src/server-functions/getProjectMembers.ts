import z from 'zod'
import { authedServerFn } from './core'
import { authz, getDb } from './core.server'

export const getProjectMembers = authedServerFn()
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

    const result = await getDb().query.ProjectMembers.findMany({
      columns: {
        role: true,
      },
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
          },
        },
      },
      where(fields, operators) {
        return operators.eq(fields.projectId, ctx.data.projectId)
      },
    })

    return result
  })
