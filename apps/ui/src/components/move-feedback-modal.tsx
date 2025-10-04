import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import { getFeatures, moveFeedbackToFeature } from '@/server-functions'
import { useServerFn } from '@tanstack/react-start'

interface MoveFeedbackModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feedback: {
    id: string
    projectId: string
    featureId: string
  }
}

export function MoveFeedbackModal({
  open,
  onOpenChange,
  feedback,
}: MoveFeedbackModalProps) {
  const router = useRouter()
  const [features, setFeatures] = useState<
    Array<{ id: string; name: string; description: string }>
  >([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(
    null
  )
  const [isMoving, setIsMoving] = useState(false)

  const requestGetFeatures = useServerFn(getFeatures)
  const requestMoveFeedbackToFeature = useServerFn(moveFeedbackToFeature)

  // TODO: use tanstack query or tanstack db here, this is cheaply implemented for prototyping
  useEffect(() => {
    if (open && features.length === 0) {
      requestGetFeatures({
        data: { projectId: feedback.projectId },
      }).then((result) => setFeatures(result))
    }
  }, [open, features.length, feedback.projectId])

  const handleOpenChange = async (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedFeatureId(null)
      setSearchTerm('')
    }
    onOpenChange(newOpen)
  }

  const filteredFeatures = features.filter(
    (f) =>
      f.id !== feedback.featureId &&
      f.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleMove = async () => {
    if (!selectedFeatureId) {
      return
    }

    setIsMoving(true)
    try {
      await requestMoveFeedbackToFeature({
        data: { feedbackId: feedback.id, featureId: selectedFeatureId },
      })
      await router.invalidate()
      void handleOpenChange(false)
    } catch (error) {
      console.error('Failed to move feedback:', error)
    } finally {
      setIsMoving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Move Feedback to Feature</DialogTitle>
          <DialogDescription>
            Search and select a feature to move this feedback to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            type="search"
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
          />

          <div className="border rounded-md max-h-60 overflow-y-auto">
            {filteredFeatures.length === 0 ? (
              <p className="text-sm text-muted-foreground p-4 text-center">
                No features found
              </p>
            ) : (
              filteredFeatures.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => setSelectedFeatureId(feature.id)}
                  className={`w-full text-left p-3 hover:bg-accent transition-colors ${
                    selectedFeatureId === feature.id ? 'bg-accent' : ''
                  }`}
                >
                  <div className="font-medium">{feature.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {feature.description}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleMove}
            disabled={!selectedFeatureId || isMoving}
          >
            {isMoving ? (
              'Moving...'
            ) : (
              <>
                Move <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
