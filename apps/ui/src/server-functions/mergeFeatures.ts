import { getDb } from './core'
import { Features, Feedbacks } from '@feedback-thing/db'
import { inArray } from 'drizzle-orm'
import { authedServerFn, authz } from './core'
import z from 'zod'

export const mergeFeatures = authedServerFn()
  .inputValidator(
    z.object({
      featureIds: z.array(z.string()).min(2),
      newFeatureName: z.string().min(1),
      newFeatureDescription: z.string().min(1),
    })
  )
  .handler(async (ctx) => {
    if (ctx.data.featureIds.length < 2) {
      throw new Error('At least two features must be merged')
    }

    const features = await authz.checkFeatureAccessAndThrow(
      ctx.context.user.id,
      ctx.data.featureIds
    )

    const projectIds = Array.from(new Set(features.map((f) => f.projectId)))
    if (projectIds.length > 1) {
      throw new Error('Features must belong to the same project')
    }
    const projectId = projectIds[0]

    await authz.checkProjectAccessAndThrow(ctx.context.user.id, projectId)

    return await getDb().transaction(async (tx) => {
      const [newFeature] = await tx
        .insert(Features)
        .values({
          projectId: projectId,
          name: ctx.data.newFeatureName,
          description: ctx.data.newFeatureDescription,
          createdBy: ctx.context.user.id,
        })
        .returning()

      await tx
        .update(Feedbacks)
        .set({ featureId: newFeature.id })
        .where(inArray(Feedbacks.featureId, ctx.data.featureIds))

      // TODO: actually just mark them as merged with a foriegnKey to the new feature so they're also searchable later
      await tx.delete(Features).where(inArray(Features.id, ctx.data.featureIds))

      return { success: true, newFeatureId: newFeature.id }
    })
  })
