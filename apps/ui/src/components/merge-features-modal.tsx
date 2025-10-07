import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
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
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { mergeFeatures } from '../server-functions'
import { SquareArrowOutUpRight } from 'lucide-react'

interface Feature {
  id: string
  name: string
  description: string
  projectId: string
  createdBy: string
}

interface MergeFeaturesModalProps {
  open: boolean
  suggestion?: { name: string; description: string }
  onOpenChange: (open: boolean, reason?: 'cancel' | 'complete') => void
  projectId: string
  availableFeatures: Feature[]
}

export function MergeFeaturesModal({
  open,
  suggestion,
  onOpenChange,
  projectId,
  availableFeatures,
}: MergeFeaturesModalProps) {
  const navigate = useNavigate()
  const [newFeatureName, setNewFeatureName] = useState(suggestion?.name || '')
  const [newFeatureDescription, setNewFeatureDescription] = useState(
    suggestion?.description || ''
  )
  const [isMerging, setIsMerging] = useState(false)

  // Use availableFeatures directly as they are pre-selected from sidebar
  const selectedFeatures = availableFeatures

  const handleMerge = async () => {
    if (
      selectedFeatures.length < 2 ||
      !newFeatureName ||
      !newFeatureDescription
    ) {
      return
    }

    setIsMerging(true)
    try {
      const result = await mergeFeatures({
        data: {
          featureIds: selectedFeatures.map((f) => f.id),
          newFeatureName,
          newFeatureDescription,
        },
      })
      await navigate({
        to: '/projects/$projectId/features/$featureId',
        params: {
          projectId,
          featureId: result.newFeatureId,
        },
      })
    } catch (error) {
      console.error('Failed to merge features:', error)
    } finally {
      setIsMerging(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    setNewFeatureName('')
    setNewFeatureDescription('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Merging {selectedFeatures.length} features</DialogTitle>
          <DialogDescription>
            Create a new feature from the selected features. All feedback will
            be moved to the new feature and the original features will be
            deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <ul className="border rounded-md p-3 space-y-2">
            {selectedFeatures.map((f) => (
              <li key={f.id} className="flex flex-col text-sm">
                <Link
                  className="font-medium text-blue-400 hover:text-blue-500"
                  to="/projects/$projectId/features/$featureId"
                  params={{ projectId, featureId: f.id }}
                  target="_blank"
                >
                  <SquareArrowOutUpRight className="inline w-4 mt-[-2px]" />{' '}
                  {f.name}
                </Link>

                <span className="text-gray-500">{f.description}</span>
              </li>
            ))}
          </ul>

          <div className="flex gap-2 flex-col">
            <Label htmlFor="feature-name">New Feature Name</Label>
            <Input
              id="feature-name"
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              placeholder="Enter feature name"
              autoFocus
            />
          </div>

          <div className="flex gap-2 flex-col">
            <Label htmlFor="feature-description">New Feature Description</Label>
            <Textarea
              id="feature-description"
              value={newFeatureDescription}
              onChange={(e) => setNewFeatureDescription(e.target.value)}
              placeholder="Enter feature description"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleMerge}
            disabled={
              isMerging ||
              selectedFeatures.length < 2 ||
              !newFeatureName ||
              !newFeatureDescription
            }
          >
            {isMerging ? 'Merging...' : 'Merge Features'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
