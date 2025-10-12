import { createFileRoute } from '@tanstack/react-router'
import { FeedbackCard } from '@/components/feedback-card'
import { useSuspenseQuery } from '@tanstack/react-query'
import { featureQueryOptions } from '@/lib/query-options'

export const Route = createFileRoute(
  '/projects/$projectId/features/$featureId'
)({
  component: RouteComponent,
  loader: async (ctx) => {
    const queryClient = ctx.context.queryClient
    await queryClient.ensureQueryData(featureQueryOptions(ctx.params.featureId))
  },
})

function RouteComponent() {
  const { featureId } = Route.useParams()
  const { data: feature } = useSuspenseQuery(featureQueryOptions(featureId))

  if (!feature) {
    return <div className="p-8">Feature not found</div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{feature.name}</h1>
      <p className="text-gray-400 mb-8">{feature.description}</p>

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
