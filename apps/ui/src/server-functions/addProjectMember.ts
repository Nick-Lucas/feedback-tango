import { ProjectMembers } from '@feedback-thing/db'
import z from 'zod'
import { authedServerFn, authz, getDb } from './core'

export const addProjectMember = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
      userId: z.string(),
      role: z.enum(['owner', 'editor']).default('editor'),
    })
  )
  .handler(async (ctx) => {
    const membership = await authz.checkProjectAccessAndThrow(
      ctx.context.user.id,
      ctx.data.projectId
    )

    if (membership.role !== 'owner') {
      throw new Error('Only project owners can add members')
    }

    const existingMember = await getDb().query.ProjectMembers.findFirst({
      where(fields, operators) {
        return operators.and(
          operators.eq(fields.projectId, ctx.data.projectId),
          operators.eq(fields.userId, ctx.data.userId)
        )
      },
    })

    if (existingMember) {
      throw new Error('User is already a member of this project')
    }

    await getDb().insert(ProjectMembers).values({
      projectId: ctx.data.projectId,
      userId: ctx.data.userId,
      role: ctx.data.role,
    })

    return { success: true }
  })
