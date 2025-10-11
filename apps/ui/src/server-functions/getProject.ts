import z from 'zod'
import { authedServerFn } from './core'
import { authz, getDb } from './core.server'

export const getProject = authedServerFn()
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

    const project = await getDb().query.Projects.findFirst({
      with: {
        members: {
          columns: {
            userId: true,
            role: true,
          },
          with: {
            user: {
              columns: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      where(fields, operators) {
        return operators.eq(fields.id, ctx.data.projectId)
      },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    return project
  })
