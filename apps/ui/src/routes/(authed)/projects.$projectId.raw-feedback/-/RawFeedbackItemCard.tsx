import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { RawFeedbacksResult } from '@/lib/query-options'
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  Wrench,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

const SENTIMENT_ICONS = {
  positive: <ThumbsUp fill="currentColor" className="h-3 w-3 text-green-500" />,
  constructive: <Wrench fill="currentColor" className="h-3 w-3 text-primary" />,
  negative: <ThumbsDown fill="currentColor" className="h-3 w-3 text-red-500" />,
} as const

interface RawFeedbackItemCardProps {
  item: RawFeedbacksResult[number]['items'][number]
  projectId: string
}

export function RawFeedbackItemCard({
  item,
  projectId,
}: RawFeedbackItemCardProps) {
  return (
    <div className="space-y-1.5 p-2.5 rounded-md bg-secondary/60 hover:bg-secondary transition-colors border border-border/40">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-card-foreground flex-1 leading-snug">
          "{item.content.trim()}"
        </p>
        {item.feedback && (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 -mt-0.5"
            asChild
          >
            <Link
              to="/projects/$projectId/features/$featureId"
              params={{
                projectId: projectId,
                featureId: item.feedback.feature.id,
              }}
              target="_blank"
            >
              <ExternalLink className="h-3 w-3" />
            </Link>
          </Button>
        )}
      </div>

      {item.processingError ? (
        <div className="flex items-start gap-1.5">
          <AlertCircle className="h-3 w-3 text-red-500 mt-0.5 shrink-0" />
          <span className="text-xs text-red-500 leading-tight">
            {item.processingError}
          </span>
        </div>
      ) : (
        <div className="flex gap-3 text-xs">
          <div className="flex items-center gap-1">
            {item.sentimentCheckComplete ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <Clock className="h-3 w-3 text-yellow-500" />
            )}
            <span className="text-muted-foreground">Sentiment</span>

            {item.sentimentCheckResult && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="inline-flex">
                      {SENTIMENT_ICONS[item.sentimentCheckResult]}
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="capitalize">{item.sentimentCheckResult}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>

          <div className="flex items-center gap-1">
            {item.featureAssociationComplete ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <Clock className="h-3 w-3 text-yellow-500" />
            )}
            <span className="text-muted-foreground">Feature Associated</span>
          </div>
        </div>
      )}
    </div>
  )
}
