import { createFileRoute } from '@tanstack/react-router'
import { getFeature } from '../server-functions'
import { FeedbackCard } from '@/components/feedback-card'

export const Route = createFileRoute(
  '/projects/$projectId/features/$featureId'
)({
  component: RouteComponent,
  loader: async ({ params }) => {
    const feature = await getFeature({ data: { featureId: params.featureId } })
    if (!feature) {
      throw new Error('Feature not found')
    }
    return { feature }
  },
})

function RouteComponent() {
  const { feature } = Route.useLoaderData()

  if (!feature) {
    return <div className="p-8">Feature not found</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{feature.name}</h1>
      <p className="text-gray-600 mb-8">{feature.description}</p>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-4">
          Feedback ({feature.feedbacks?.length || 0})
        </h2>

        {!feature.feedbacks || feature.feedbacks.length === 0 ? (
          <p className="text-gray-500">No feedback yet</p>
        ) : (
          <div className="space-y-4">
            {feature.feedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
