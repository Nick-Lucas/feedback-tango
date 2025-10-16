import { createFileRoute } from '@tanstack/react-router'
import { FeedbackCard } from './-/feedback-card'
import { SentimentFilterBadge } from './-/sentiment-filter-badge'
import {
  featureQueryOptions,
  useFeatureQuery,
  feedbackSentimentCountsQueryOptions,
  useFeedbackSentimentCountsQuery,
} from '@/lib/query-options'
import { z } from 'zod'

const searchSchema = z.object({
  sentiment: z
    .enum(['positive', 'constructive', 'negative'])
    .optional()
    .catch(undefined),
})

export const Route = createFileRoute(
  '/(authed)/projects/$projectId/features/$featureId'
)({
  component: RouteComponent,
  validateSearch: searchSchema,
  loader: async (ctx) => {
    const queryClient = ctx.context.queryClient
    await Promise.all([
      queryClient.ensureQueryData(
        featureQueryOptions({
          data: { featureId: ctx.params.featureId },
        })
      ),
      queryClient.ensureQueryData(
        feedbackSentimentCountsQueryOptions({
          data: { featureId: ctx.params.featureId },
        })
      ),
    ])
  },
})

function RouteComponent() {
  const { featureId } = Route.useParams()
  const { data: feature } = useFeatureQuery(featureId)
  const { data: sentimentCounts } = useFeedbackSentimentCountsQuery(featureId)
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  // Filter feedbacks based on sentiment query param
  const filteredFeedbacks = search.sentiment
    ? feature.feedbacks?.filter((f) => f.sentiment === search.sentiment)
    : feature.feedbacks

  const handleSentimentClick = (
    sentiment: 'positive' | 'constructive' | 'negative' | undefined
  ) => {
    void navigate({
      search: (prev) => ({
        ...prev,
        sentiment:
          sentiment === undefined || prev.sentiment === sentiment
            ? undefined
            : sentiment,
      }),
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{feature.name}</h1>
      <p className="text-gray-400 mb-8">{feature.description}</p>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Feedback ({feature.feedbacks?.length || 0})
          </h2>

          <div className="flex gap-2">
            <SentimentFilterBadge
              sentiment="all"
              count={sentimentCounts.total}
              active={!search.sentiment}
              onClick={() => handleSentimentClick(undefined)}
            />
            <SentimentFilterBadge
              sentiment="positive"
              count={sentimentCounts.positive}
              active={search.sentiment === 'positive'}
              onClick={() => handleSentimentClick('positive')}
            />
            <SentimentFilterBadge
              sentiment="constructive"
              count={sentimentCounts.constructive}
              active={search.sentiment === 'constructive'}
              onClick={() => handleSentimentClick('constructive')}
            />
            <SentimentFilterBadge
              sentiment="negative"
              count={sentimentCounts.negative}
              active={search.sentiment === 'negative'}
              onClick={() => handleSentimentClick('negative')}
            />
          </div>
        </div>

        {!filteredFeedbacks || filteredFeedbacks.length === 0 ? (
          <p className="text-gray-500">
            {search.sentiment
              ? `No ${search.sentiment} feedback`
              : 'No feedback yet'}
          </p>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
