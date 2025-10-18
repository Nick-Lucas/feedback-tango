import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { RotateCcw } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { useReprocessAllFeedbackMutation } from '@/lib/query-options'

interface ReprocessFeedbackCardProps {
  projectId: string
  isOwner: boolean
}

export function ReprocessFeedbackCard({
  projectId,
  isOwner,
}: ReprocessFeedbackCardProps) {
  const [isReprocessing, setIsReprocessing] = useState(false)
  const reprocessMutation = useReprocessAllFeedbackMutation()

  const handleReprocessAll = async () => {
    setIsReprocessing(true)
    try {
      const result = await reprocessMutation.mutateAsync({
        projectId,
      })
      toast.success(
        `Successfully cleared ${result.clearedCount} raw feedback items for reprocessing`
      )
    } catch (error) {
      toast.error('Failed to reprocess feedback')
      console.error(error)
    } finally {
      setIsReprocessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Re-Process All Feedback</CardTitle>
        <CardDescription>
          Delete all processed feedback and reset raw feedback items to be
          reprocessed
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              This will delete all Feedbacks in this project and clear the
              processing states of all Raw Feedback items, allowing them to be
              processed again from scratch.
            </p>
            <p className="text-sm text-amber-600 dark:text-amber-500 font-medium">
              Warning: This action cannot be undone.
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isReprocessing || !isOwner}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                {isReprocessing ? 'Reprocessing...' : 'Re-Process All Feedback'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will delete all processed feedback and reset all raw
                  feedback items to be reprocessed. This action cannot be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleReprocessAll}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Re-Process All Feedback
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {!isOwner && (
            <p className="text-sm text-muted-foreground">
              Only project owners can reprocess feedback
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
