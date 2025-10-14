import { useState } from 'react'
import { useMatches, useNavigate, useParams } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useProjectsQuery, useCreateProjectMutation } from '@/lib/query-options'
import { useIsMobile } from '@/hooks/use-mobile'

interface ProjectPickerProps {
  className?: string
}

export function ProjectPicker({ className }: ProjectPickerProps) {
  const { projectId } = useParams({
    from: '/(authed)/projects/$projectId',
  })
  const leafMatchId = useProjectRouteId()
  const navigate = useNavigate({ from: '/projects/$projectId' })

  const { data: projects } = useProjectsQuery()
  const createProjectMutation = useCreateProjectMutation()

  const [open, setOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [projectName, setProjectName] = useState('')

  const isMobile = useIsMobile()
  const selectedProject = projects.find((p) => p.id === projectId)

  const handleCreateProject = async () => {
    if (projectName.trim()) {
      const newProject = await createProjectMutation.mutateAsync({
        name: projectName.trim(),
      })

      await navigate({
        to: '/projects/$projectId/config',
        params: { projectId: newProject.id },
      })

      setProjectName('')
      setCreateDialogOpen(false)
    }
  }

  const commandContent = (
    <Command>
      <CommandInput placeholder="Search projects..." />
      <CommandList>
        <CommandEmpty>No project found.</CommandEmpty>
        <CommandGroup>
          {projects.map((project) => (
            <CommandItem
              key={project.id}
              value={project.name}
              onSelect={async () => {
                await navigate({
                  to: leafMatchId,
                  params: {
                    projectId: project.id,
                  },
                })

                setOpen(false)
              }}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  selectedProject?.id === project.id
                    ? 'opacity-100'
                    : 'opacity-0'
                )}
              />
              {project.name}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup>
          <CommandItem
            onSelect={() => {
              setOpen(false)
              setCreateDialogOpen(true)
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create project
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )

  return (
    <>
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Project</DialogTitle>
            <DialogDescription>
              Enter a name for your new project.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    void handleCreateProject()
                  }
                }}
                placeholder="My Project"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setCreateDialogOpen(false)
                setProjectName('')
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateProject}
              disabled={!projectName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isMobile ? (
        <>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            onClick={() => setOpen(true)}
            className={cn(
              'h-7 justify-between px-2 hover:bg-background/50',
              className
            )}
          >
            {selectedProject?.name || 'Select project...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
              showCloseButton={false}
              className="p-0 gap-0 max-w-[calc(100vw-2rem)] top-[4rem] translate-y-0"
            >
              {commandContent}
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              role="combobox"
              aria-expanded={open}
              className={cn(
                'h-7 justify-between px-2 hover:bg-background/50',
                className
              )}
            >
              {selectedProject?.name || 'Select project...'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 p-0" align="start">
            {commandContent}
          </PopoverContent>
        </Popover>
      )}
    </>
  )
}
function useProjectRouteId() {
  return useMatches({
    select(matches) {
      const routePath = matches[matches.length - 1].fullPath

      type StripTrailingSlash<TPath extends string> =
        TPath extends `${infer TStrippedPath}/` ? TStrippedPath : TPath

      type ProjectIdRoutes = StripTrailingSlash<
        Extract<typeof routePath, `/projects/$projectId/${string}`>
      >

      return routePath as ProjectIdRoutes
    },
  })
}
