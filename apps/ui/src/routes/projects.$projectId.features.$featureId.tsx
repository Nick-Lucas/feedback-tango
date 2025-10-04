import { createFileRoute } from '@tanstack/react-router'
import { getFeature } from '../server-functions'
import { Card } from '@/components/ui/card'

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

function FormattedDate({ date }: { date: Date | string }) {
  return (
    <span suppressHydrationWarning>{new Date(date).toLocaleDateString()}</span>
  )
}

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
              <Card key={feedback.id} className="p-4">
                <p className="text-card-foreground italic">
                  "{feedback.feedback.trim()}"
                </p>

                <div className="text-sm text-card-foreground/70">
                  <FormattedDate date={feedback.createdAt} />

                  <span className="mx-2">•</span>

                  <span>
                    {feedback.createdByUser?.name || feedback.createdBy}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
