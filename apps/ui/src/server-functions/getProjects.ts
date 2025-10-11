import { Projects, ProjectMembers } from '@feedback-thing/db'
import { and, eq } from 'drizzle-orm'
import { authedServerFn } from './core'
import { getDb } from './core.server'

export const getProjects = authedServerFn().handler(async (ctx) => {
  const results = await getDb()
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
