import { RawFeedbacks } from '@feedback-thing/db'
import { eq, desc, isNull, isNotNull, and } from 'drizzle-orm'
import { authedServerFn } from './core'
import { getDb, authz } from './core.server'
import z from 'zod'

export const getRawFeedbacks = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
      filter: z.enum(['all', 'pending', 'completed', 'errors']).optional(),
    })
  )
  .handler(async (ctx) => {
    const { projectId, filter = 'pending' } = ctx.data

    // Check if user has access to this project
    await authz.checkProjectAccessAndThrow(ctx.context.user.id, projectId)

    const db = getDb()

    // Build where conditions based on filter
    let whereConditions = eq(RawFeedbacks.projectId, projectId)

    if (filter === 'pending') {
      // Not completed and no errors
      whereConditions = and(
        whereConditions,
        isNull(RawFeedbacks.processingComplete),
        isNull(RawFeedbacks.processingError)
      )!
    } else if (filter === 'completed') {
      // Processing complete
      whereConditions = and(
        whereConditions,
        isNotNull(RawFeedbacks.processingComplete)
      )!
    } else if (filter === 'errors') {
      // Has processing error
      whereConditions = and(
        whereConditions,
        isNotNull(RawFeedbacks.processingError)
      )!
    }

    const rawFeedbacks = await db.query.RawFeedbacks.findMany({
      where: whereConditions,
      orderBy: desc(RawFeedbacks.createdAt),
      with: {
        items: {
          columns: {
            createdAt: false,
          },

          with: {
            feedback: {
              columns: {
                id: true,
              },
              with: {
                feature: {
                  columns: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
    })

    return rawFeedbacks
  })
