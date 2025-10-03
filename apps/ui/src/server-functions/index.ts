import { createServerFn } from '@tanstack/react-start'
import { createDb, Projects } from '@feedback-thing/db'
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
