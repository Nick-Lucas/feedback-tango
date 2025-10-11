import { db } from '@feedback-thing/core'
import z from 'zod'
import { authedServerFn, authz } from './core'

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

    const result = await db.query.user.findMany({
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
