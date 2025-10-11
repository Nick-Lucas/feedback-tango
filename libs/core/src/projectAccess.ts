import { ilike } from 'drizzle-orm'
import { Projects } from '@feedback-thing/db'
import type { NewProject } from './access.ts'
import { db } from './access.ts'

// Project CRUD operations

export const projectAccess = {
  // Create a new project
  create: async (data: Omit<NewProject, 'id' | 'createdAt'>) => {
    const [project] = await db.insert(Projects).values(data).returning()
    if (!project) {
      throw new Error('Failed to create project')
    }
    return {
      id: project.id,
      name: project.name,
    }
  },

  // Search projects by name
  search: async (searchTerm: string) => {
    const results = await db
      .select()
      .from(Projects)
      .where(ilike(Projects.name, `%${searchTerm}%`))

    return results.map((project) => {
      return {
        id: project.id,
        name: project.name,
      }
    })
  },
}
