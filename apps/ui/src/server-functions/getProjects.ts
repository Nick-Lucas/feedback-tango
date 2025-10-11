import { db } from '@feedback-thing/core'
import { Projects, ProjectMembers } from '@feedback-thing/db'
import { and, eq } from 'drizzle-orm'
import { authedServerFn } from './core'

export const getProjects = authedServerFn().handler(async (ctx) => {
  const results = await db
    .select()
    .from(Projects)
    .innerJoin(
      ProjectMembers,
      and(
        eq(Projects.id, ProjectMembers.projectId),
        eq(ProjectMembers.userId, ctx.context.user.id)
      )
    )

  return results.map(({ projects }) => projects)
})
