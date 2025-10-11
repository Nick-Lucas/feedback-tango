import { db } from '@feedback-thing/core'
import { ProjectMembers } from '@feedback-thing/db'
import { and, eq } from 'drizzle-orm'
import z from 'zod'
import { authedServerFn, authz } from './core'

export const removeProjectMember = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
      userId: z.string(),
    })
  )
  .handler(async (ctx) => {
    const membership = await authz.checkProjectAccessAndThrow(
      ctx.context.user.id,
      ctx.data.projectId
    )

    if (membership.role !== 'owner') {
      throw new Error('Only project owners can remove members')
    }

    if (ctx.context.user.id === ctx.data.userId) {
      throw new Error('Cannot remove yourself from the project')
    }

    await db
      .delete(ProjectMembers)
      .where(
        and(
          eq(ProjectMembers.projectId, ctx.data.projectId),
          eq(ProjectMembers.userId, ctx.data.userId)
        )
      )

    return { success: true }
  })
