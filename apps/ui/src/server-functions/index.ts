import { createServerFn } from '@tanstack/react-start'
import { db } from '@feedback-thing/db'
import z from 'zod'

export const getProjects = createServerFn().handler(() => {
  return db.query.Projects.findMany()
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
    })
  })
