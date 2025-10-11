import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import {
  createDb,
  Projects,
  Feedbacks,
  Features,
  ProjectMembers,
} from '@feedback-thing/db'
import { and, eq, inArray } from 'drizzle-orm'
import z from 'zod'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { authClient } from '@/lib/auth'
import { AuthorizationChecks } from '@feedback-thing/core'

const db = createDb()
const authz = new AuthorizationChecks(db)

const model = google('gemini-2.5-flash-lite')

const authMiddleware = createMiddleware({ type: 'function' }).server(
  async (ctx) => {
    const cookie = getRequestHeader('Cookie')

    if (!cookie) {
      console.log('No session cookie found on request')
      throw new Response('Unauthorized', { status: 401 })
    }

    const session = await authClient.getSession({
      fetchOptions: {
        headers: { Cookie: cookie },
      },
    })
    if (!session.data) {
      console.log('No session found for cookie')
      throw new Response('Unauthorized', { status: 401 })
    }

    return ctx.next({
      context: {
        user: session.data.user,
        session: session.data.session,
      },
    })
  }
)

const authedServerFn = createServerFn().middleware([authMiddleware])

export const getProject = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
    })
  )
  .handler(async (ctx) => {
    await authz.checkProjectAccessAndThrow(
      ctx.context.user.id,
      ctx.data.projectId
    )

    const project = await db.query.Projects.findFirst({
      with: {
        members: {
          columns: {
            userId: true,
            role: true,
          },
          with: {
            user: {
              columns: {
                name: true,
                email: true,
              },
            },
          },
        },
      },
      where(fields, operators) {
        return operators.eq(fields.id, ctx.data.projectId)
      },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    return project
  })

export const getProjects = authedServerFn().handler(async (ctx) => {
  const results = await db
    .select()
    .from(Projects)
    .innerJoin(
      ProjectMembers,
      and(
        eq(Projects.id, ProjectMembers.projectId),
        eq(ProjectMembers.userId, ctx.context.user.id)
      )
    )

  return results.map(({ projects }) => projects)
})

export const getProjectMembers = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
    })
  )
  .handler(async (ctx) => {
    await authz.checkProjectAccessAndThrow(
      ctx.context.user.id,
      ctx.data.projectId
    )

    const result = await db.query.user.findMany({
      with: {
        projectMemberships: {
          with: {
            user: {
              columns: {
                id: true,
                name: true,
                email: true,
                image: true,
                role: true,
              },
            },
          },
        },
      },
    })

    return result.flatMap((u) => u.projectMemberships)
  })

export const createProject = authedServerFn()
  .inputValidator(
    z.object({
      name: z.string().min(1),
    })
  )
  .handler(async (ctx) => {
    return await db.transaction(async (tx) => {
      const [project] = await tx
        .insert(Projects)
        .values({
          name: ctx.data.name,
          createdBy: ctx.context.user.id,
        })
        .returning()

      await tx.insert(ProjectMembers).values({
        projectId: project.id,
        userId: ctx.context.user.id,
        role: 'owner',
      })

      return project
    })
  })

export const getFeatures = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
    })
  )
  .handler(async (ctx) => {
    await authz.checkProjectAccessAndThrow(
      ctx.context.user.id,
      ctx.data.projectId
    )

    return db.query.Features.findMany({
      where(fields, operators) {
        return operators.eq(fields.projectId, ctx.data.projectId)
      },
      orderBy(fields, operators) {
        return operators.asc(fields.name)
      },
    })
  })

export const getFeature = authedServerFn()
  .inputValidator(
    z.object({
      featureId: z.string(),
    })
  )
  .handler(async (ctx) => {
    await authz.checkFeatureAccessAndThrow(ctx.context.user.id, [
      ctx.data.featureId,
    ])

    return db.query.Features.findFirst({
      where(fields, operators) {
        return operators.eq(fields.id, ctx.data.featureId)
      },
      with: {
        feedbacks: {
          with: {
            createdByUser: true,
          },
          orderBy(fields, operators) {
            return operators.desc(fields.createdAt)
          },
        },
      },
    })
  })

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

    return await db.transaction(async (tx) => {
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

export const suggestMergedFeatureDetails = authedServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      featureIds: z.array(z.string()).min(2),
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

    try {
      const result = await generateObject({
        model,
        schema: z.object({
          name: z.string().min(1),
          description: z.string().min(1),
        }),
        system: `
          You are a Product Owner who is combining multiple feature concepts into one overarching feature concept based on their names and descriptions.

          Given the following features, generate a new name and description that accurately and concisely encapsulated all of them.

          Avoid combining feature details into the name/description, instead focus on the higher level concept that encompasses them all. For instance:

          - If the features are "Add dark mode", "Add light mode", and "Add system theme support", a good combined feature name might be "Add theme support" with a description of "Allow users to select and switch between different themes, including dark, light, and system default."
          - If the features are "Improve products search speed", "Add products search filter for color", and "Enable products search suggestions", a good combined feature name might be "Products Search" with a description of "Improvements to the Products Search such as filters, performance, and intelligence."
        `,
        prompt: `
          ${features
            .map(
              (f, i) =>
                `${i + 1}. Name: ${f.name}, Description: ${f.description}`
            )
            .join('\n')}
        `,
      })

      return {
        success: true,
        suggestion: result.object,
      } as const
    } catch (err) {
      console.error('Error during AI Feature Suggestion generation:', err)

      return {
        success: false,
      } as const
    }
  })

export const moveFeedbackToFeature = authedServerFn()
  .inputValidator(
    z.object({
      feedbackId: z.string().min(1),
      featureId: z.string().min(1),
    })
  )
  .handler(async (ctx) => {
    await authz.checkFeedbackAccessAndThrow(ctx.context.user.id, [
      ctx.data.feedbackId,
    ])

    const feature = await db.query.Features.findFirst({
      with: {
        project: {
          with: {
            members: {
              where(fields, operators) {
                return operators.eq(fields.userId, ctx.context.user.id)
              },
            },
          },
        },
      },
      where(fields) {
        return eq(fields.id, ctx.data.featureId)
      },
    })

    if (!feature) {
      throw new Error('Feature Not Found')
    }

    await db
      .update(Feedbacks)
      .set({ featureId: ctx.data.featureId })
      .where(eq(Feedbacks.id, ctx.data.feedbackId))

    return { success: true }
  })

export const searchUsers = authedServerFn()
  .inputValidator(
    z.object({
      query: z.string().min(1),
      projectId: z.string(),
    })
  )
  .handler(async (ctx) => {
    await authz.checkProjectAccessAndThrow(
      ctx.context.user.id,
      ctx.data.projectId
    )

    const results = await db.query.user.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
      where(fields, operators) {
        return operators.like(fields.email, `%${ctx.data.query}%`)
      },
      limit: 10,
    })

    return results
  })

export const addProjectMember = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
      userId: z.string(),
      role: z.enum(['owner', 'editor']).default('editor'),
    })
  )
  .handler(async (ctx) => {
    const membership = await authz.checkProjectAccessAndThrow(
      ctx.context.user.id,
      ctx.data.projectId
    )

    if (membership.role !== 'owner') {
      throw new Error('Only project owners can add members')
    }

    const existingMember = await db.query.ProjectMembers.findFirst({
      where(fields, operators) {
        return operators.and(
          operators.eq(fields.projectId, ctx.data.projectId),
          operators.eq(fields.userId, ctx.data.userId)
        )
      },
    })

    if (existingMember) {
      throw new Error('User is already a member of this project')
    }

    await db.insert(ProjectMembers).values({
      projectId: ctx.data.projectId,
      userId: ctx.data.userId,
      role: ctx.data.role,
    })

    return { success: true }
  })

export const removeProjectMember = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
      userId: z.string(),
    })
  )
  .handler(async (ctx) => {
    const membership = await authz.checkProjectAccessAndThrow(
      ctx.context.user.id,
      ctx.data.projectId
    )

    if (membership.role !== 'owner') {
      throw new Error('Only project owners can remove members')
    }

    if (ctx.context.user.id === ctx.data.userId) {
      throw new Error('Cannot remove yourself from the project')
    }

    await db
      .delete(ProjectMembers)
      .where(
        and(
          eq(ProjectMembers.projectId, ctx.data.projectId),
          eq(ProjectMembers.userId, ctx.data.userId)
        )
      )

    return { success: true }
  })
