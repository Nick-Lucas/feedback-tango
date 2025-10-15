import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { RawFeedbacksResult } from '@/lib/query-options'
import {
  rawFeedbacksQueryOptions,
  rawFeedbackCountsQueryOptions,
  useRawFeedbacksQuery,
  useRawFeedbackCountsQuery,
} from '@/lib/query-options'
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Wrench,
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export const Route = createFileRoute(
  '/(authed)/projects/$projectId/raw-feedback'
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      filter:
        (search.filter as 'all' | 'pending' | 'completed' | 'errors') ||
        'pending',
    }
  },
  loaderDeps: ({ search }) => ({ filter: search.filter }),
  loader: async (ctx) => {
    const queryClient = ctx.context.queryClient
    await Promise.all([
      queryClient.ensureQueryData(
        rawFeedbacksQueryOptions({
          data: {
            projectId: ctx.params.projectId,
            filter: ctx.deps.filter,
          },
        })
      ),
      queryClient.ensureQueryData(
        rawFeedbackCountsQueryOptions({
          data: {
            projectId: ctx.params.projectId,
          },
        })
      ),
    ])
  },
})

function FormattedDate({ date }: { date: Date | string }) {
  return (
    <span suppressHydrationWarning>
      {new Date(date).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })}
    </span>
  )
}

interface RawFeedbackCardProps {
  rawFeedback: RawFeedbacksResult[number]
}

const SENTIMENT_ICONS = {
  positive: <ThumbsUp fill="currentColor" className="h-3 w-3 text-green-500" />,
  constructive: <Wrench fill="currentColor" className="h-3 w-3 text-primary" />,
  negative: <ThumbsDown fill="currentColor" className="h-3 w-3 text-red-500" />,
} as const

function RawFeedbackCard({ rawFeedback }: RawFeedbackCardProps) {
  const safetyComplete = !!rawFeedback.safetyCheckComplete
  const splittingComplete = !!rawFeedback.splittingComplete
  // const processingComplete = !!rawFeedback.processingComplete
  const hasError = !!rawFeedback.processingError
  const hasItems = rawFeedback.items.length > 0

  // Calculate overall progress for raw feedback level (safety + splitting)
  let progressValue = 0
  if (safetyComplete) progressValue = 50
  if (splittingComplete) progressValue = 100

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-card-foreground italic flex-1">
            "{rawFeedback.content.trim()}"
          </p>
        </div>

        <div className="text-sm text-card-foreground/70 flex items-center gap-2">
          <FormattedDate date={rawFeedback.createdAt} />
          <span className="mx-2">•</span>
          <span>{rawFeedback.email || 'Anonymous'}</span>
        </div>

        {hasError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              {rawFeedback.processingError}
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {/* Raw Feedback Level Progress */}
            <div className="space-y-2">
              <Progress value={progressValue} className="h-2" />

              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  {safetyComplete ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Clock className="h-3 w-3 text-yellow-500" />
                  )}
                  <span className="text-muted-foreground">Safety Check</span>
                </div>

                <div className="flex items-center gap-1">
                  {splittingComplete ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : safetyComplete ? (
                    <Clock className="h-3 w-3 text-yellow-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-gray-500" />
                  )}
                  <span className="text-muted-foreground">
                    Splitting ({rawFeedback.items.length} item
                    {rawFeedback.items.length === 1 ? '' : 's'})
                  </span>
                </div>
              </div>
            </div>

            {/* Items Processing */}
            {hasItems && (
              <div className="space-y-2 pl-4 border-l-2 border-muted">
                {rawFeedback.items.map((item, index) => {
                  const itemSentimentComplete = !!item.sentimentCheckComplete
                  const itemFeatureComplete = !!item.featureAssociationComplete
                  const itemHasError = !!item.processingError
                  const feedbackText = item.content.trim()

                  return (
                    <div
                      key={item.id}
                      className="space-y-1 pb-2 border-b border-muted last:border-0"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs text-card-foreground/80 flex-1">
                          Item {index + 1}: "{feedbackText.substring(0, 60)}
                          {feedbackText.length > 60 ? '...' : ''}"
                        </p>
                        {item.feedback && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            asChild
                          >
                            <Link
                              to="/projects/$projectId/features/$featureId"
                              params={{
                                projectId: rawFeedback.projectId,
                                featureId: item.feedback.feature.id,
                              }}
                              target="_blank"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                          </Button>
                        )}
                      </div>
                      {itemHasError ? (
                        <div className="flex items-start gap-1">
                          <AlertCircle className="h-3 w-3 text-red-500 mt-0.5" />
                          <span className="text-xs text-red-500">
                            {item.processingError}
                          </span>
                        </div>
                      ) : (
                        <div className="flex gap-3 text-xs">
                          <div className="flex items-center gap-1">
                            {itemSentimentComplete ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : (
                              <Clock className="h-3 w-3 text-yellow-500" />
                            )}
                            <span className="text-muted-foreground">
                              Sentiment
                            </span>
                            {item.sentimentCheckResult && (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="inline-flex">
                                      {
                                        SENTIMENT_ICONS[
                                          item.sentimentCheckResult
                                        ]
                                      }
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p className="capitalize">
                                      {item.sentimentCheckResult}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            {itemFeatureComplete ? (
                              <CheckCircle className="h-3 w-3 text-green-500" />
                            ) : itemSentimentComplete ? (
                              <Clock className="h-3 w-3 text-yellow-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-gray-500" />
                            )}
                            <span className="text-muted-foreground">
                              Feature
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

type FilterType = 'all' | 'pending' | 'completed' | 'errors'

function RouteComponent() {
  const { projectId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate()
  const filter = search.filter || 'pending'

  const { data: rawFeedbacks } = useRawFeedbacksQuery(projectId, filter)
  const { data: counts } = useRawFeedbackCountsQuery(projectId)

  const handleFilterChange = (newFilter: FilterType) => {
    void navigate({
      to: '/projects/$projectId/raw-feedback',
      params: { projectId },
      search: { filter: newFilter },
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pt-16 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Raw Feedback</h1>
        <p className="text-gray-400 mb-6">
          All submitted feedback and processing status
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Badge
          variant={filter === 'all' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => handleFilterChange('all')}
        >
          Total: {counts.total}
        </Badge>
        <Badge
          variant={filter === 'pending' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleFilterChange('pending')}
        >
          Pending: {counts.pending}
        </Badge>
        <Badge
          variant={filter === 'completed' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleFilterChange('completed')}
        >
          Completed: {counts.completed}
        </Badge>
        <Badge
          variant={filter === 'errors' ? 'destructive' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleFilterChange('errors')}
        >
          Errors: {counts.errors}
        </Badge>
      </div>

      {rawFeedbacks.length === 0 ? (
        <p className="text-gray-500">
          {filter === 'all' ? 'No raw feedback yet' : `No ${filter} feedback`}
        </p>
      ) : (
        <div className="space-y-4">
          {rawFeedbacks.map((rawFeedback) => (
            <RawFeedbackCard key={rawFeedback.id} rawFeedback={rawFeedback} />
          ))}
        </div>
      )}
    </div>
  )
}
