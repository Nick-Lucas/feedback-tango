import { createServerFn } from '@tanstack/react-start'
import { createDb, Projects, Feedbacks, Features } from '@feedback-thing/db'
import { inArray } from 'drizzle-orm'
import z from 'zod'

const db = createDb()

export const getProjects = createServerFn().handler(() => {
  return db.query.Projects.findMany()
})

export const createProject = createServerFn()
  .inputValidator(
    z.object({
      name: z.string().min(1),
      createdBy: z.string(),
    })
  )
  .handler(async (ctx) => {
    const [project] = await db
      .insert(Projects)
      .values({
        name: ctx.data.name,
        createdBy: ctx.data.createdBy,
      })
      .returning()

    return project
  })

export const getFeatures = createServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
    })
  )
  .handler((ctx) => {
    return db.query.Features.findMany({
      where(fields, operators) {
        return operators.eq(fields.projectId, ctx.data.projectId)
      },
    })
  })

export const getFeature = createServerFn()
  .inputValidator(
    z.object({
      featureId: z.string(),
    })
  )
  .handler((ctx) => {
    return db.query.Features.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, ctx.data.featureId)
      },
      with: {
        feedbacks: {
          with: {
            createdByUser: true,
          },
        },
      },
    })
  })

export const mergeFeatures = createServerFn()
  .inputValidator(
    z.object({
      featureIds: z.array(z.string()).min(2),
      newFeatureName: z.string().min(1),
      newFeatureDescription: z.string().min(1),
      projectId: z.string(),
    })
  )
  .handler(async (ctx) => {
    const { featureIds, newFeatureName, newFeatureDescription, projectId } =
      ctx.data

    let newFeatureId: string

    return await db.transaction(async (tx) => {
      const [newFeature] = await tx
        .insert(Features)
        .values({
          projectId,
          name: newFeatureName,
          description: newFeatureDescription,
          createdBy: '', //TODO: current user from auth
        })
        .returning()

      newFeatureId = newFeature!.id

      await tx
        .update(Feedbacks)
        .set({ featureId: newFeatureId })
        .where(inArray(Feedbacks.featureId, featureIds))

      // TODO: actually just mark them as merged with a foriegnKey to the new feature so they're also searchable later
      await tx.delete(Features).where(inArray(Features.id, featureIds))

      return { success: true, newFeatureId }
    })
  })
