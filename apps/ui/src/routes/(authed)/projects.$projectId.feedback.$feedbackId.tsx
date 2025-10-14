import { createFileRoute, redirect } from '@tanstack/react-router'
import { getFeedback } from '@/server-functions/getFeedback'

export const Route = createFileRoute(
  '/(authed)/projects/$projectId/feedback/$feedbackId'
)({
  loader: async (ctx) => {
    const feedback = await getFeedback({
      data: { feedbackId: ctx.params.feedbackId },
    })

    // Redirect to the feature page
    throw redirect({
      to: '/projects/$projectId/features/$featureId',
      params: {
        projectId: ctx.params.projectId,
        featureId: feedback.featureId,
      },
      replace: true,
    })
  },
})
