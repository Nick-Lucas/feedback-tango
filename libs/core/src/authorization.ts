import type { createDb } from '@feedback-thing/db'
import { Feedbacks, Features, ProjectMembers } from '@feedback-thing/db'
import { and, eq, inArray, getTableColumns } from 'drizzle-orm'

export class AuthorizationChecks {
  private db: ReturnType<typeof createDb>

  constructor(db: ReturnType<typeof createDb>) {
    this.db = db
  }

  async checkProjectAccessAndThrow(userId: string, projectId: string) {
    const projectMembership = await this.db.query.ProjectMembers.findFirst({
      where(fields, operators) {
        return operators.and(
          operators.eq(fields.projectId, projectId),
          operators.eq(fields.userId, userId)
        )
      },
    })

    if (!projectMembership) {
      throw new Error('Project Not Found')
    }

    return projectMembership
  }

  async checkFeatureAccessAndThrow(userId: string, featureId: string[]) {
    const results = await this.db
      .select(getTableColumns(Features))
      .from(Features)
      .innerJoin(
        ProjectMembers,
        and(
          eq(Features.projectId, ProjectMembers.projectId),
          eq(ProjectMembers.userId, userId)
        )
      )
      .where(inArray(Features.id, featureId))

    if (results.length === 0) {
      throw new Error('Feature Not Found')
    }

    return results
  }

  async checkFeedbackAccessAndThrow(userId: string, feedbackId: string[]) {
    const results = await this.db
      .select({
        feedbackId: Feedbacks.id,
        projectId: Feedbacks.projectId,
      })
      .from(Feedbacks)
      .innerJoin(
        ProjectMembers,
        and(
          eq(Feedbacks.projectId, ProjectMembers.projectId),
          eq(ProjectMembers.userId, userId)
        )
      )
      .where(inArray(Feedbacks.id, feedbackId))

    if (results.length === 0) {
      throw new Error('Feedback Not Found')
    }

    return results
  }
}
