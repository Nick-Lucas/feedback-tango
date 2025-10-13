import { useState } from 'react'
import { useMatches, useNavigate } from '@tanstack/react-router'
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

interface Project {
  id: string
  name: string
}

interface ProjectPickerProps {
  projects: Project[]
  selectedProject: Project
  onCreateProject?: (name: string) => Promise<void> | void
  className?: string
}

export function ProjectPicker({
  projects,
  selectedProject,
  onCreateProject,
  className,
}: ProjectPickerProps) {
  const leafMatchId = useProjectRouteId()
  const navigate = useNavigate({ from: '/projects/$projectId' })
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [projectName, setProjectName] = useState('')

  const handleCreateProject = async () => {
    if (projectName.trim() && onCreateProject) {
      await onCreateProject(projectName.trim())
      setProjectName('')
      setDialogOpen(false)
    }
  }

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                setDialogOpen(false)
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
            {selectedProject.name || 'Select project...'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-0" align="start">
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
                        selectedProject.id === project.id
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    {project.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              {onCreateProject && (
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setDialogOpen(true)
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create project
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
function useProjectRouteId() {
  return useMatches({
    select(matches) {
      const routeId = matches[matches.length - 1].routeId

      type StripTrailingSlash<S extends string> = S extends `${infer T}/`
        ? T
        : S
      type ProjectIdRoutes = StripTrailingSlash<
        Extract<
          typeof routeId,
          `/projects/$projectId` | `/projects/$projectId/${string}`
        >
      >

      return routeId as ProjectIdRoutes
    },
  })
}
