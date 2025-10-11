import z from 'zod'
import { generateObject } from 'ai'
import { authedServerFn, model } from './core'
import { authz } from './core.server'

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
