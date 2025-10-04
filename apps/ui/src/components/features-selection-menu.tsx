import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, ChevronDown, Merge } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MergeFeaturesModal } from '@/components/merge-features-modal'
import { suggestMergedFeatureDetails } from '@/server-functions'
import { useServerFn } from '@tanstack/react-start'

interface Feature {
  id: string
  name: string
  description: string
  projectId: string
  createdBy: string
}

interface FeaturesSelectionMenuProps {
  projectId: string
  selectedFeatureIds: Set<string>
  onClearSelection: () => void
  selectedFeatures: Feature[]
  onSelectionProcessed: () => void
}

export function FeaturesSelectionMenu({
  selectedFeatureIds,
  onClearSelection,
  projectId,
  selectedFeatures,
  onSelectionProcessed,
}: FeaturesSelectionMenuProps) {
  const requestSuggestMergedFeatureDetails = useServerFn(
    suggestMergedFeatureDetails
  )
  const [mergeModalOpen, setMergeModalOpen] = useState<
    { open: true; suggestion?: { name: string; description: string } } | false
  >(false)

  const selectedCount = selectedFeatureIds.size

  const handleMergeClick = async () => {
    const result = await requestSuggestMergedFeatureDetails({
      data: {
        featureIds: Array.from(selectedFeatureIds),
      },
    })

    if (result.success) {
      setMergeModalOpen({
        open: true,
        suggestion: result.suggestion,
      })
    } else {
      setMergeModalOpen({
        open: true,
      })
    }
  }

  const handleMergeModalOpenChange = (
    open: boolean,
    reason?: 'cancel' | 'complete'
  ) => {
    setMergeModalOpen(open ? { open: true } : false)
    if (!open && reason === 'complete') {
      void onSelectionProcessed()
    }
  }
  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={selectedCount > 0 ? 'default' : 'outline'}
              size="sm"
              className="h-8 flex-1 justify-between enabled:border enabled:border-primary"
              disabled={selectedCount === 0}
            >
              <span className="text-sm">
                {selectedCount > 0
                  ? `${selectedCount} selected`
                  : 'No selection'}
              </span>
              <ChevronDown className="size-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="start"
            className="w-[calc(var(--radix-dropdown-menu-trigger-width))]"
          >
            <DropdownMenuItem
              onClick={handleMergeClick}
              disabled={selectedCount < 2}
            >
              <Merge className="size-4" />
              Merge {selectedCount} features
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="destructive"
          size="icon"
          onClick={onClearSelection}
          className="h-8 w-8 hover:brightness-90"
          disabled={selectedCount === 0}
        >
          <X className="size-4" />
        </Button>
      </div>

      {projectId && selectedFeatures.length >= 2 && selectedFeatures[0] && (
        <MergeFeaturesModal
          // TODO: bit of a hack to reset internal state when suggestions change, improving internal state would be better
          key={JSON.stringify(mergeModalOpen)}
          suggestion={mergeModalOpen ? mergeModalOpen?.suggestion : undefined}
          open={!!mergeModalOpen}
          onOpenChange={handleMergeModalOpenChange}
          projectId={projectId}
          availableFeatures={selectedFeatures}
        />
      )}
    </>
  )
}
