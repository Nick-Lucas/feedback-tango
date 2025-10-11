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

    const result = await getDb().query.user.findMany({
      with: {
        projectMemberships: {
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
        },
      },
    })

    return result.flatMap((u) => u.projectMemberships)
  })
