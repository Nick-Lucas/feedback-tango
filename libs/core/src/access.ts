import { db, Projects, Features, Feedbacks } from '@feedback-thing/db'
import { and, eq, like } from 'drizzle-orm'

export type Project = typeof Projects.$inferSelect
export type NewProject = typeof Projects.$inferInsert
export type Feature = typeof Features.$inferSelect
export type NewFeature = typeof Features.$inferInsert
export type Feedback = typeof Feedbacks.$inferSelect
export type NewFeedback = typeof Feedbacks.$inferInsert

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

  // Get all projects
  getAll: async (): Promise<Project[]> => {
    return await db.select().from(Projects)
  },

  // Get project by ID
  getById: async (id: number): Promise<Project | undefined> => {
    const [project] = await db
      .select()
      .from(Projects)
      .where(eq(Projects.id, id))
    return project
  },

  // Get project with its feedback and features
  getWithFeedback: async (id: number) => {
    return await db.query.Projects.findFirst({
      where: eq(Projects.id, id),
      with: {
        feedbacks: true,
        features: true,
      },
    })
  },

  // Update a project
  update: async (
    id: number,
    data: Partial<Omit<NewProject, 'id' | 'createdAt'>>
  ): Promise<Project | undefined> => {
    const [project] = await db
      .update(Projects)
      .set(data)
      .where(eq(Projects.id, id))
      .returning()
    return project
  },

  // Delete a project
  delete: async (id: number): Promise<boolean> => {
    const result = await db.delete(Projects).where(eq(Projects.id, id))
    return result.changes > 0
  },

  // Get projects by creator
  getByCreator: async (createdBy: string): Promise<Project[]> => {
    return await db
      .select()
      .from(Projects)
      .where(eq(Projects.createdBy, createdBy))
  },

  // Search projects by name
  search: async (searchTerm: string) => {
    const results = await db
      .select()
      .from(Projects)
      .where(like(Projects.name, `%${searchTerm}%`))

    return results.map((project) => {
      return {
        id: project.id,
        name: project.name,
      }
    })
  },
}

// Feature CRUD operations
export const featureAccess = {
  // Create a new feature
  create: async (data: Omit<NewFeature, 'id' | 'createdAt'>) => {
    const [feature] = await db.insert(Features).values(data).returning()
    if (!feature) {
      throw new Error('Failed to create feature')
    }

    return {
      id: feature.id,
      name: feature.name,
      description: feature.description,
    }
  },

  // Get all features
  getAll: async (): Promise<Feature[]> => {
    return await db.select().from(Features)
  },

  // Get feature by ID
  getById: async (id: number): Promise<Feature | undefined> => {
    const [feature] = await db
      .select()
      .from(Features)
      .where(eq(Features.id, id))
    return feature
  },

  // Get feature with its feedback
  getWithFeedback: async (id: number) => {
    return await db.query.Features.findFirst({
      where: eq(Features.id, id),
      with: {
        feedbacks: true,
        project: true,
      },
    })
  },

  // Get all features for a project
  getByProject: async (projectId: number): Promise<Feature[]> => {
    return await db
      .select()
      .from(Features)
      .where(eq(Features.projectId, projectId))
  },

  // Update a feature
  update: async (
    id: number,
    data: Partial<Omit<NewFeature, 'id' | 'createdAt' | 'projectId'>>
  ): Promise<Feature | undefined> => {
    const [feature] = await db
      .update(Features)
      .set(data)
      .where(eq(Features.id, id))
      .returning()
    return feature
  },

  // Delete a feature
  delete: async (id: number): Promise<boolean> => {
    const result = await db.delete(Features).where(eq(Features.id, id))
    return result.changes > 0
  },

  // Get features by creator
  getByCreator: async (createdBy: string): Promise<Feature[]> => {
    return await db
      .select()
      .from(Features)
      .where(eq(Features.createdBy, createdBy))
  },

  // Search features by name
  search: async (projectId: number, searchTerm: string) => {
    const results = await db
      .select()
      .from(Features)
      .where(
        and(
          like(Features.name, `%${searchTerm}%`),
          eq(Features.projectId, projectId)
        )
      )

    return results.map((feature) => {
      return {
        id: feature.id,
        name: feature.name,
        description: feature.description,
      }
    })
  },
}

// Feedback CRUD operations
export const feedbackAccess = {
  // Create new feedback
  create: async (data: Omit<NewFeedback, 'id' | 'createdAt'>) => {
    const [feedbackItem] = await db.insert(Feedbacks).values(data).returning()
    if (!feedbackItem) {
      throw new Error('Failed to create feedback')
    }
    return {
      id: feedbackItem.id,
      feedback: feedbackItem.feedback,
    }
  },

  // Get all feedback
  getAll: async (): Promise<Feedback[]> => {
    return await db.select().from(Feedbacks)
  },

  // Get feedback by ID
  getById: async (id: number): Promise<Feedback | undefined> => {
    const [feedbackItem] = await db
      .select()
      .from(Feedbacks)
      .where(eq(Feedbacks.id, id))
    return feedbackItem
  },

  // Get feedback with project and feature info
  getWithProject: async (id: number) => {
    return await db.query.Feedbacks.findFirst({
      where: eq(Feedbacks.id, id),
      with: {
        project: true,
        feature: true,
      },
    })
  },

  // Get all feedback for a project
  getByProject: async (projectId: number): Promise<Feedback[]> => {
    return await db
      .select()
      .from(Feedbacks)
      .where(eq(Feedbacks.projectId, projectId))
  },

  // Get all feedback for a feature
  getByFeature: async (featureId: number): Promise<Feedback[]> => {
    return await db
      .select()
      .from(Feedbacks)
      .where(eq(Feedbacks.featureId, featureId))
  },

  // Update feedback
  update: async (
    id: number,
    data: Partial<
      Omit<NewFeedback, 'id' | 'createdAt' | 'projectId' | 'featureId'>
    >
  ): Promise<Feedback | undefined> => {
    const [feedbackItem] = await db
      .update(Feedbacks)
      .set(data)
      .where(eq(Feedbacks.id, id))
      .returning()
    return feedbackItem
  },

  // Delete feedback
  delete: async (id: number): Promise<boolean> => {
    const result = await db.delete(Feedbacks).where(eq(Feedbacks.id, id))
    return result.changes > 0
  },

  // Get feedback by creator
  getByCreator: async (createdBy: string): Promise<Feedback[]> => {
    return await db
      .select()
      .from(Feedbacks)
      .where(eq(Feedbacks.createdBy, createdBy))
  },
}
