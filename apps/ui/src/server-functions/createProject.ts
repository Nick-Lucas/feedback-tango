import { Projects, ProjectMembers } from '@feedback-thing/db'
import z from 'zod'
import { authedServerFn } from './core'

import { getDb } from './core.server'

export const createProject = authedServerFn()
  .inputValidator(
    z.object({
      name: z.string().min(1),
    })
  )
  .handler(async (ctx) => {
    return await getDb().transaction(async (tx) => {
      const [project] = await tx
        .insert(Projects)
        .values({
          name: ctx.data.name,
          createdBy: ctx.context.user.id,
        })
        .returning()

      await tx.insert(ProjectMembers).values({
        projectId: project.id,
        userId: ctx.context.user.id,
        role: 'owner',
      })

      return project
    })
  })
