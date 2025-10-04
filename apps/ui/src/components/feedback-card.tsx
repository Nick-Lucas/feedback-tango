import { Card } from '@/components/ui/card'

function FormattedDate({ date }: { date: Date | string }) {
  return (
    <span suppressHydrationWarning>{new Date(date).toLocaleDateString()}</span>
  )
}

interface FeedbackCardProps {
  feedback: string
  createdAt: Date | string
  createdBy: string
  createdByUser?: { name: string } | null
}

export function FeedbackCard({
  feedback,
  createdAt,
  createdBy,
  createdByUser,
}: FeedbackCardProps) {
  return (
    <Card className="p-4">
      <p className="text-card-foreground italic">"{feedback.trim()}"</p>

      <div className="text-sm text-card-foreground/70">
        <FormattedDate date={createdAt} />

        <span className="mx-2">•</span>

        <span>{createdByUser?.name || createdBy}</span>
      </div>
    </Card>
  )
}
