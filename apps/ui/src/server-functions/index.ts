import { createMiddleware, createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'
import { createDb, Projects, Feedbacks, Features } from '@feedback-thing/db'
import { eq, inArray } from 'drizzle-orm'
import z from 'zod'
import { generateObject } from 'ai'
import { google } from '@ai-sdk/google'
import { authClient } from '@/lib/auth'

const db = createDb()

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
    const project = await db.query.Projects.findFirst({
      with: {},
      where(fields, operators) {
        return operators.eq(fields.id, ctx.data.projectId)
      },
    })

    if (!project) {
      throw new Error('Project not found')
    }

    return project
  })

export const getProjects = authedServerFn().handler(() => {
  return db.query.Projects.findMany()
})

export const getProjectMembers = authedServerFn()
  .inputValidator(
    z.object({
      projectId: z.string(),
    })
  )
  .handler(async () => {
    // TODO: add project or organisation memberships and fetch only members of the project
    return db.query.user.findMany()
  })

export const createProject = authedServerFn()
  .inputValidator(
    z.object({
      name: z.string().min(1),
    })
  )
  .handler(async (ctx) => {
    const [project] = await db
      .insert(Projects)
      .values({
        name: ctx.data.name,
        createdBy: ctx.context.user.id,
      })
      .returning()

    return project
  })

export const getFeatures = authedServerFn()
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

export const mergeFeatures = authedServerFn()
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
          createdBy: ctx.context.user.id,
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

export const suggestMergedFeatureDetails = authedServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      featureIds: z.array(z.string()).min(2),
    })
  )
  .handler(async (ctx) => {
    const { featureIds } = ctx.data

    const features = await db.query.Features.findMany({
      where(fields) {
        return inArray(fields.id, featureIds)
      },
    })

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
    const { feedbackId, featureId } = ctx.data

    await db
      .update(Feedbacks)
      .set({ featureId })
      .where(eq(Feedbacks.id, feedbackId))

    return { success: true }
  })
