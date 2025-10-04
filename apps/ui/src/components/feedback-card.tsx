import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVertical } from 'lucide-react'
import { MoveFeedbackModal } from './move-feedback-modal'

function FormattedDate({ date }: { date: Date | string }) {
  return (
    <span suppressHydrationWarning>{new Date(date).toLocaleDateString()}</span>
  )
}

interface FeedbackCardProps {
  feedback: {
    id: string
    feedback: string
    createdAt: Date | string
    createdBy: string
    createdByUser?: { name: string } | null
    featureId: string
    projectId: string
  }
}

export function FeedbackCard({ feedback }: FeedbackCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <Card className="p-4 relative">
        <p className="text-card-foreground italic">
          "{feedback.feedback.trim()}"
        </p>

        <div className="flex items-center justify-between">
          <div className="text-sm text-card-foreground/70">
            <FormattedDate date={feedback.createdAt} />

            <span className="mx-2">•</span>

            <span>{feedback.createdByUser?.name || feedback.createdBy}</span>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setDialogOpen(true)}>
                Change Feature
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
