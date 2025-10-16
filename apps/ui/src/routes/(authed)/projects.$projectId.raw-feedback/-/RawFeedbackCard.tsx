import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { RawFeedbacksResult } from '@/lib/query-options'
import { CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { FormattedDate } from './FormattedDate'
import { RawFeedbackItemCard } from './RawFeedbackItemCard'

interface RawFeedbackCardProps {
  rawFeedback: RawFeedbacksResult[number]
}

export function RawFeedbackCard({ rawFeedback }: RawFeedbackCardProps) {
  const hasItems = rawFeedback.items.length > 0

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

        {rawFeedback.processingError ? (
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
              <Progress value={rawFeedback.progress.percent} className="h-2" />

              <div className="flex gap-4 text-xs">
                <div className="flex items-center gap-1">
                  {rawFeedback.safetyCheckComplete ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Clock className="h-3 w-3 text-yellow-500" />
                  )}
                  <span className="text-muted-foreground">Safety Check</span>
                </div>

                <div className="flex items-center gap-1">
                  {rawFeedback.splittingComplete ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <Clock className="h-3 w-3 text-yellow-500" />
                  )}
                  <span className="text-muted-foreground">
                    Splitting ({rawFeedback.items.length} item
                    {rawFeedback.items.length === 1 ? '' : 's'})
                  </span>
                </div>
              </div>
            </div>

            {hasItems && (
              <div className="space-y-2">
                {rawFeedback.items.map((item) => (
                  <RawFeedbackItemCard
                    key={item.id}
                    item={item}
                    projectId={rawFeedback.projectId}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
