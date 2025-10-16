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

    return rawFeedbacks.map(appendProgress)
  })

function appendProgress<
  TRawFeedback extends {
    processingComplete: Date | null
    safetyCheckComplete: Date | null
    splittingComplete: Date | null
    items: {
      sentimentCheckComplete: Date | null
      featureAssociationComplete: Date | null
    }[]
  },
>(rf: TRawFeedback) {
  if (rf.processingComplete) {
    return {
      ...rf,
      progress: {
        percent: 100,
      },
    }
  }

  const safetyCheckComplete = truthyToNum(rf.safetyCheckComplete)
  const splittingComplete = truthyToNum(rf.splittingComplete)
  const rawFeedbackProgress = {
    position: (safetyCheckComplete + splittingComplete) / 2,
    total: 1,
  }

  const subitemProgress = rf.items
    .map((item) => {
      const sentimentCheckComplete = truthyToNum(item.sentimentCheckComplete)
      const featureAssociationComplete = truthyToNum(
        item.featureAssociationComplete
      )

      return {
        position: sentimentCheckComplete + featureAssociationComplete,
        total: 2,
      }
    })
    .reduce(
      (acc, item) => {
        acc.position += item.position
        acc.total += item.total
        return acc
      },
      { position: 0, total: 0 }
    )

  // Normalise subitem progress to be out of 1
  subitemProgress.position /= subitemProgress.total
  subitemProgress.total = 1

  return {
    ...rf,
    progress: {
      percent:
        ((rawFeedbackProgress.position + subitemProgress.position) /
          (rawFeedbackProgress.total + subitemProgress.total)) *
        100,
    },
  }
}

function truthyToNum(value: unknown) {
  return value ? 1 : 0
}
