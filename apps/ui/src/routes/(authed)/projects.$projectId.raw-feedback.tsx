import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  rawFeedbacksQueryOptions,
  rawFeedbackCountsQueryOptions,
  useRawFeedbacksQuery,
  useRawFeedbackCountsQuery,
} from '@/lib/query-options'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

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
  rawFeedback: {
    id: string
    projectId: string
    email: string | null
    feedback: string
    createdAt: Date | string
    safetyCheckComplete: Date | string | null
    sentimentCheckResult: 'positive' | 'constructive' | 'negative' | null
    sentimentCheckComplete: Date | string | null
    featureAssociationComplete: Date | string | null
    processingError: string | null
  }
}

function RawFeedbackCard({ rawFeedback }: RawFeedbackCardProps) {
  const safetyComplete = !!rawFeedback.safetyCheckComplete
  const sentimentComplete = !!rawFeedback.sentimentCheckComplete
  const featureComplete = !!rawFeedback.featureAssociationComplete
  const hasError = !!rawFeedback.processingError

  let progressValue = 0
  if (safetyComplete) progressValue = 33
  if (sentimentComplete) progressValue = 66
  if (featureComplete) progressValue = 100

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-card-foreground italic flex-1">
            "{rawFeedback.feedback.trim()}"
          </p>
          {rawFeedback.sentimentCheckResult && (
            <Badge
              variant={
                rawFeedback.sentimentCheckResult === 'positive'
                  ? 'default'
                  : rawFeedback.sentimentCheckResult === 'constructive'
                    ? 'secondary'
                    : 'destructive'
              }
              className="shrink-0"
            >
              {rawFeedback.sentimentCheckResult}
            </Badge>
          )}
        </div>

        <div className="text-sm text-card-foreground/70">
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
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Processing Status</span>
              <span className="text-muted-foreground">
                {progressValue === 100 ? 'Complete' : 'In Progress'}
              </span>
            </div>
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
                {sentimentComplete ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : safetyComplete ? (
                  <Clock className="h-3 w-3 text-yellow-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-gray-500" />
                )}
                <span className="text-muted-foreground">Sentiment Check</span>
              </div>

              <div className="flex items-center gap-1">
                {featureComplete ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : sentimentComplete ? (
                  <Clock className="h-3 w-3 text-yellow-500" />
                ) : (
                  <XCircle className="h-3 w-3 text-gray-500" />
                )}
                <span className="text-muted-foreground">
                  Feature Association
                </span>
              </div>
            </div>
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
