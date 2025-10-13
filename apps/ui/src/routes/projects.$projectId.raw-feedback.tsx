import { createFileRoute, Link } from '@tanstack/react-router'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  rawFeedbacksQueryOptions,
  useRawFeedbacksQuery,
} from '@/lib/query-options'
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

export const Route = createFileRoute('/projects/$projectId/raw-feedback')({
  component: RouteComponent,
  loader: async (ctx) => {
    const queryClient = ctx.context.queryClient
    await queryClient.ensureQueryData(
      rawFeedbacksQueryOptions({
        data: { projectId: ctx.params.projectId },
      })
    )
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
    featureAssociationComplete: Date | string | null
    processingError: string | null
    processedFeedbackId: string | null
  }
}

function RawFeedbackCard({ rawFeedback }: RawFeedbackCardProps) {
  const safetyComplete = !!rawFeedback.safetyCheckComplete
  const featureComplete = !!rawFeedback.featureAssociationComplete
  const hasError = !!rawFeedback.processingError
  const isProcessed = !!rawFeedback.processedFeedbackId

  let progressValue = 0
  if (safetyComplete) progressValue = 50
  if (featureComplete) progressValue = 100

  return (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <p className="text-card-foreground italic flex-1">
            "{rawFeedback.feedback.trim()}"
          </p>
          {isProcessed && (
            <Link
              to="/projects/$projectId/features"
              params={{ projectId: rawFeedback.projectId }}
              className="text-xs text-blue-500 hover:underline whitespace-nowrap"
            >
              View Processed
            </Link>
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
                {featureComplete ? (
                  <CheckCircle className="h-3 w-3 text-green-500" />
                ) : safetyComplete ? (
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

function RouteComponent() {
  const { projectId } = Route.useParams()
  const { data: rawFeedbacks } = useRawFeedbacksQuery(projectId)

  const pendingCount = rawFeedbacks.filter((f) => !f.safetyCheckComplete).length
  const processingCount = rawFeedbacks.filter(
    (f) => f.safetyCheckComplete && !f.featureAssociationComplete
  ).length
  const completedCount = rawFeedbacks.filter(
    (f) => f.featureAssociationComplete
  ).length
  const errorCount = rawFeedbacks.filter((f) => f.processingError).length

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Raw Feedback</h1>
      <p className="text-gray-400 mb-6">
        All submitted feedback and processing status
      </p>

      <div className="flex gap-4 mb-6">
        <Badge variant="secondary">Total: {rawFeedbacks.length}</Badge>
        <Badge variant="outline">Pending: {pendingCount}</Badge>
        <Badge variant="outline">Processing: {processingCount}</Badge>
        <Badge variant="outline">Completed: {completedCount}</Badge>
        {errorCount > 0 && (
          <Badge variant="destructive">Errors: {errorCount}</Badge>
        )}
      </div>

      {rawFeedbacks.length === 0 ? (
        <p className="text-gray-500">No raw feedback yet</p>
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
