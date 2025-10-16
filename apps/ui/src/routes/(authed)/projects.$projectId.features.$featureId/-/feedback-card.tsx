import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical, ThumbsUp, ThumbsDown, Wrench } from 'lucide-react'
import { MoveFeedbackModal } from './move-feedback-modal'
import type { FeatureResult } from '@/lib/query-options'

interface FeedbackCardProps {
  feedback: FeatureResult['feedbacks'][number]
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card className="p-4 relative">
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-card-foreground italic flex-1">
            "{feedback.content.trim()}"
          </p>
          {feedback.sentiment && (
            <SentimentBadge sentiment={feedback.sentiment} />
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-card-foreground/70">
            <FormattedDate date={feedback.createdAt} />

            <span className="mx-2">•</span>

            <span>{feedback.email || 'Anonymous'}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                Move to Feature
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>

      <MoveFeedbackModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        feedback={feedback}
      />
    </>
  )
}

const SENTIMENT_CONFIG = {
  positive: {
    label: 'Positive',
    className: 'bg-green-500/20 text-green-300 border-green-500/30',
    icon: <ThumbsUp fill="currentColor" className="h-3 w-3" />,
  },
  constructive: {
    label: 'Constructive',
    className: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    icon: <Wrench fill="currentColor" className="h-3 w-3" />,
  },
  negative: {
    label: 'Negative',
    className: 'bg-red-500/20 text-red-300 border-red-500/30',
    icon: <ThumbsDown fill="currentColor" className="h-3 w-3" />,
  },
} as const

function SentimentBadge({
  sentiment,
}: {
  sentiment: 'positive' | 'constructive' | 'negative'
}) {
  const { label, className, icon } = SENTIMENT_CONFIG[sentiment]

  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium border ${className} shrink-0 flex items-center gap-1.5`}
    >
      {icon}
      {label}
    </span>
  )
}

function FormattedDate({ date }: { date: Date | string }) {
  return (
    <span suppressHydrationWarning>{new Date(date).toLocaleDateString()}</span>
  )
}
