import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  rawFeedbacksQueryOptions,
  rawFeedbackCountsQueryOptions,
  useRawFeedbacksQuery,
  useRawFeedbackCountsQuery,
  useRawFeedbackDetailsQuery,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useState } from 'react'

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

interface RawFeedbackDetailsDialogProps {
  rawFeedbackId: string
  originalFeedback: string
  projectId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

function RawFeedbackDetailsDialog({
  rawFeedbackId,
  originalFeedback,
  projectId,
  open,
  onOpenChange,
}: RawFeedbackDetailsDialogProps) {
  // Only fetch when dialog is open
  const { data: feedbackDetails, isLoading } =
    useRawFeedbackDetailsQuery(rawFeedbackId)

  const items = feedbackDetails?.items || []

  if (!open) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Processed Feedback Entries</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="text-sm text-muted-foreground mb-4">
            <p className="font-semibold mb-1">Original Feedback:</p>
            <p className="italic">"{originalFeedback.trim()}"</p>
          </div>
          {isLoading ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              Loading feedback details...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              No feedback entries found
            </div>
          ) : (
            <div className="space-y-3">
              <p className="font-semibold text-sm">
                Split into {items.length} feedback{' '}
                {items.length === 1 ? 'item' : 'items'}:
              </p>
              {items.map((item, index) => (
                <Card key={item.id} className="p-3 bg-muted/50">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm flex-1">
                        {index + 1}. "{item.feedback}"
                      </p>
                      {item.feedback && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0"
                          asChild
                        >
                          <Link
                            to="/projects/$projectId/features/$featureId"
                            params={{
                              projectId,
                              featureId: item.feedback.feature.id,
                            }}
                            target="_blank"
                            onClick={() => onOpenChange(false)}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      )}
                    </div>
                    {item.feedback && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.feedback.feature.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {item.feedback.feature.description}
                        </span>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
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
    splittingComplete: Date | string | null
    processingComplete: Date | string | null
    processingError: string | null
    items: Array<{
      id: string
      feedback: string
      sentimentCheckResult: 'positive' | 'constructive' | 'negative' | null
      sentimentCheckComplete: Date | string | null
      featureAssociationComplete: Date | string | null
      processingError: string | null
    }>
  }
}

const SENTIMENT_ICONS = {
  positive: <ThumbsUp fill="currentColor" className="h-3 w-3 text-green-500" />,
  constructive: <Wrench fill="currentColor" className="h-3 w-3 text-primary" />,
  negative: <ThumbsDown fill="currentColor" className="h-3 w-3 text-red-500" />,
} as const

function RawFeedbackCard({ rawFeedback }: RawFeedbackCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const safetyComplete = !!rawFeedback.safetyCheckComplete
  const splittingComplete = !!rawFeedback.splittingComplete
  const processingComplete = !!rawFeedback.processingComplete
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
            "{rawFeedback.feedback.trim()}"
          </p>
          {hasItems && (
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDialogOpen(true)}
              >
                View Details
              </Button>
              <RawFeedbackDetailsDialog
                rawFeedbackId={rawFeedback.id}
                originalFeedback={rawFeedback.feedback}
                projectId={rawFeedback.projectId}
                open={dialogOpen}
                onOpenChange={setDialogOpen}
              />
            </div>
          )}
        </div>

        <div className="text-sm text-card-foreground/70 flex items-center gap-2">
          <div>
            <FormattedDate date={rawFeedback.createdAt} />
            <span className="mx-2">•</span>
            <span>{rawFeedback.email || 'Anonymous'}</span>
          </div>
          {processingComplete && (
            <Badge variant="outline" className="text-xs text-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Complete
            </Badge>
          )}
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
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  Initial Processing
                </span>
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

                  return (
                    <div
                      key={item.id}
                      className="space-y-1 pb-2 border-b border-muted last:border-0"
                    >
                      <p className="text-xs text-card-foreground/80">
                        Item {index + 1}: "{item.feedback.substring(0, 60)}
                        {item.feedback.length > 60 ? '...' : ''}"
                      </p>
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
