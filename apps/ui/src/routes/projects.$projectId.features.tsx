import {
  createFileRoute,
  useChildMatches,
  Link,
  Outlet,
  useRouter,
} from '@tanstack/react-router'
import { useState } from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  createProject,
  getFeatures,
  getProjects,
  suggestMergedFeatureDetails,
} from '@/server-functions'
import { ProjectPicker } from '@/components/project-picker'
import { MergeFeaturesModal } from '@/components/merge-features-modal'
import { useServerFn } from '@tanstack/react-start'
import { cn } from '@/lib/utils'
import { X, ChevronDown, Merge, Plus, Check, Minus, Cross } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export const Route = createFileRoute('/projects/$projectId/features')({
  component: App,
  async loader(ctx) {
    const projects = await getProjects()
    const projectId = ctx.params.projectId

    return {
      projects: await getProjects(),
      project: projects.find((p) => p.id === projectId)!,
      features: projectId
        ? await getFeatures({
            data: {
              projectId,
            },
          })
        : [],
    }
  },
})

function App() {
  const data = Route.useLoaderData()
  const router = useRouter()
  const { projectId } = Route.useParams()
  const requestSuggestMergedFeatureDetails = useServerFn(
    suggestMergedFeatureDetails
  )
  const featureMatches = useChildMatches({
    select(matches) {
      return matches.filter(
        (m) => m.routeId === '/projects/$projectId/features/$featureId'
      )
    },
  })

  const [search, setSearch] = useState('')
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(
    new Set()
  )
  const [mergeModalOpen, setMergeModalOpen] = useState<
    { open: true; suggestion?: { name: string; description: string } } | false
  >(false)

  const filteredFeatures = data.features.filter((feature) =>
    feature.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedFeatures = data.features.filter((f) =>
    selectedFeatureIds.has(f.id)
  )

  const handleCreateProject = async (name: string) => {
    await createProject({
      data: {
        name,
        createdBy: 'user',
      },
    })
    await router.invalidate()
  }

  const toggleFeatureSelection = (featureId: string) => {
    const newSelected = new Set(selectedFeatureIds)
    if (newSelected.has(featureId)) {
      newSelected.delete(featureId)
    } else {
      newSelected.add(featureId)
    }
    setSelectedFeatureIds(newSelected)
  }

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

  const handleMergeComplete = async () => {
    setSelectedFeatureIds(new Set())
    setMergeModalOpen(false)
    await router.invalidate()
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent className="gap-0">
            <div className="p-2 space-y-2">
              <div>
                <ProjectPicker
                  projects={data.projects}
                  selectedProject={data.project}
                  onCreateProject={handleCreateProject}
                  className="rounded-b-none"
                />

                <Input
                  type="search"
                  placeholder="Search features..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 rounded-t-none mt-[-1px]"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant={
                        selectedFeatureIds.size > 0 ? 'default' : 'outline'
                      }
                      size="sm"
                      className="h-7 flex-1 justify-between"
                      disabled={selectedFeatureIds.size === 0}
                    >
                      <span className="text-sm">
                        {selectedFeatureIds.size > 0
                          ? `${selectedFeatureIds.size} selected`
                          : 'No selection'}
                      </span>
                      <ChevronDown className="h-4 w-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="w-[calc(var(--radix-dropdown-menu-trigger-width))]"
                  >
                    <DropdownMenuItem
                      onClick={handleMergeClick}
                      disabled={selectedFeatureIds.size < 2}
                    >
                      <Merge className="h-4 w-4" />
                      Merge {selectedFeatureIds.size} features
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setSelectedFeatureIds(new Set())}
                  className="h-7 w-7 hover:brightness-90"
                  disabled={selectedFeatureIds.size === 0}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="gap-0">
                  {filteredFeatures.map((feature) => {
                    const isSelected = selectedFeatureIds.has(feature.id)
                    const isCurrent = featureMatches.some(
                      (match) => match.params.featureId === feature.id
                    )

                    return (
                      <SidebarMenuItem key={feature.id}>
                        <div className="flex items-center gap-2 w-full">
                          <SidebarMenuButton
                            asChild
                            className="flex-1 transition-all duration-75"
                            isActive={isCurrent}
                          >
                            <Link
                              to="/projects/$projectId/features/$featureId"
                              params={{
                                projectId: projectId,
                                featureId: feature.id.toString(),
                              }}
                            >
                              {feature.name}
                            </Link>
                          </SidebarMenuButton>

                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              'w-7 h-7',
                              `flex items-center justify-center transition-opacity duration-75 opacity-0`,
                              'group-hover/menu-item:opacity-100',
                              isCurrent ? 'active opacity-100' : '',
                              isSelected
                                ? 'selected opacity-100 text-destructive'
                                : ''
                            )}
                            onClick={(e) => {
                              e.preventDefault()
                              toggleFeatureSelection(feature.id)
                            }}
                          >
                            {isSelected ? (
                              <X className="w-4 h-4 stroke-3" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      {data.project?.id &&
        selectedFeatures.length >= 2 &&
        selectedFeatures[0] && (
          <MergeFeaturesModal
            // TODO: bit of a hack to reset internal state when suggestions change, improving internal state would be better
            key={JSON.stringify(mergeModalOpen)}
            suggestion={mergeModalOpen ? mergeModalOpen?.suggestion : undefined}
            open={!!mergeModalOpen}
            onOpenChange={async (open, reason) => {
              setMergeModalOpen(open ? { open: true } : false)
              if (!open && reason === 'complete') {
                await handleMergeComplete()
              }
            }}
            projectId={data.project.id}
            availableFeatures={selectedFeatures}
          />
        )}
    </SidebarProvider>
  )
}
