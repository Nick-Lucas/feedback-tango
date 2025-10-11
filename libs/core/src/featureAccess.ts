import { eq, cosineDistance, and } from 'drizzle-orm'
import { Features } from '@feedback-thing/db'
import type { Feature, NewFeature } from './access.ts'
import { db } from './access.ts'

// Feature CRUD operations

export const featureAccess = {
  // Create a new feature
  create: async (data: Omit<NewFeature, 'id' | 'createdAt'>) => {
    const [feature] = await db
      .insert(Features)
      .values({ ...data })
      .returning()
    if (!feature) {
      throw new Error('Failed to create feature')
    }

    return {
      id: feature.id,
      name: feature.name,
      description: feature.description,
    }
  },

  // Get features by creator
  getByName: async (
    projectId: string,
    name: string
  ): Promise<Feature | undefined> => {
    return (
      await db
        .select()
        .from(Features)
        .where(and(eq(Features.projectId, projectId), eq(Features.name, name)))
        .limit(1)
    )[0]
  },

  // Search features by name
  search: async (projectId: string, searchTerm: number[]) => {
    return await db
      .select({
        id: Features.id,
        name: Features.name,
        description: Features.description,
        searchDistance: cosineDistance(Features.nameEmbedding, searchTerm),
      })
      .from(Features)
      .where(eq(Features.projectId, projectId))
      .orderBy(cosineDistance(Features.nameEmbedding, searchTerm))
      .limit(5)
  },
}
