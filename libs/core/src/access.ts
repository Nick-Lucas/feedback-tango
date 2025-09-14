import { db, projects, feedback } from '@feedback-thing/db'
import { eq } from 'drizzle-orm'

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert
export type Feedback = typeof feedback.$inferSelect
export type NewFeedback = typeof feedback.$inferInsert

// Project CRUD operations
export const projectAccess = {
  // Create a new project
  create: async (
    data: Omit<NewProject, 'id' | 'createdAt'>
  ): Promise<Project> => {
    const [project] = await db.insert(projects).values(data).returning()
    if (!project) {
      throw new Error('Failed to create project')
    }
    return project
  },

  // Get all projects
  getAll: async (): Promise<Project[]> => {
    return await db.select().from(projects)
  },

  // Get project by ID
  getById: async (id: number): Promise<Project | undefined> => {
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
    return project
  },

  // Get project with its feedback
  getWithFeedback: async (id: number) => {
    return await db.query.projects.findFirst({
      where: eq(projects.id, id),
      with: {
        feedbacks: true,
      },
    })
  },

  // Update a project
  update: async (
    id: number,
    data: Partial<Omit<NewProject, 'id' | 'createdAt'>>
  ): Promise<Project | undefined> => {
    const [project] = await db
      .update(projects)
      .set(data)
      .where(eq(projects.id, id))
      .returning()
    return project
  },

  // Delete a project
  delete: async (id: number): Promise<boolean> => {
    const result = await db.delete(projects).where(eq(projects.id, id))
    return result.changes > 0
  },

  // Get projects by creator
  getByCreator: async (createdBy: string): Promise<Project[]> => {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.createdBy, createdBy))
  },
}

// Feedback CRUD operations
export const feedbackAccess = {
  // Create new feedback
  create: async (
    data: Omit<NewFeedback, 'id' | 'createdAt'>
  ): Promise<Feedback> => {
    const [feedbackItem] = await db.insert(feedback).values(data).returning()
    if (!feedbackItem) {
      throw new Error('Failed to create feedback')
    }
    return feedbackItem
  },

  // Get all feedback
  getAll: async (): Promise<Feedback[]> => {
    return await db.select().from(feedback)
  },

  // Get feedback by ID
  getById: async (id: number): Promise<Feedback | undefined> => {
    const [feedbackItem] = await db
      .select()
      .from(feedback)
      .where(eq(feedback.id, id))
    return feedbackItem
  },

  // Get feedback with project info
  getWithProject: async (id: number) => {
    return await db.query.feedback.findFirst({
      where: eq(feedback.id, id),
      with: {
        project: true,
      },
    })
  },

  // Get all feedback for a project
  getByProject: async (projectId: number): Promise<Feedback[]> => {
    return await db
      .select()
      .from(feedback)
      .where(eq(feedback.projectId, projectId))
  },

  // Update feedback
  update: async (
    id: number,
    data: Partial<Omit<NewFeedback, 'id' | 'createdAt' | 'projectId'>>
  ): Promise<Feedback | undefined> => {
    const [feedbackItem] = await db
      .update(feedback)
      .set(data)
      .where(eq(feedback.id, id))
      .returning()
    return feedbackItem
  },

  // Delete feedback
  delete: async (id: number): Promise<boolean> => {
    const result = await db.delete(feedback).where(eq(feedback.id, id))
    return result.changes > 0
  },

  // Get feedback by creator
  getByCreator: async (createdBy: string): Promise<Feedback[]> => {
    return await db
      .select()
      .from(feedback)
      .where(eq(feedback.createdBy, createdBy))
  },
}
