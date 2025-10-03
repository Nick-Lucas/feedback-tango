import {
  createFileRoute,
  Link,
  Outlet,
  useRouter,
  useParams,
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
import { createProject, getFeatures, getProjects } from '@/server-functions'
import { ProjectPicker } from '@/components/project-picker'
import { MergeFeaturesModal } from '@/components/merge-features-modal'
import z from 'zod'

export const Route = createFileRoute('/features')({
  component: App,
  validateSearch: z.object({
    projectId: z.string().optional(),
  }),
  loaderDeps(opts) {
    return {
      projectId: opts.search.projectId,
    }
  },
  async loader(ctx) {
    const projects = await getProjects()
    const projectId = ctx.deps.projectId ?? projects?.[0]?.id

    return {
      projects: await getProjects(),
      project: projects?.find((p) => p.id === projectId) ?? null,
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
  const params = useParams({ from: '/features/$id' })

  const [search, setSearch] = useState('')
  const [selectedFeatureIds, setSelectedFeatureIds] = useState<Set<string>>(
    new Set()
  )
  const [mergeModalOpen, setMergeModalOpen] = useState(false)
  const [hoveredFeatureId, setHoveredFeatureId] = useState<string | null>(null)

  const currentFeatureId = params?.id

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

  const handleMergeClick = () => {
    setMergeModalOpen(true)
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
              <ProjectPicker
                projects={data.projects}
                selectedProject={data.project}
                onCreateProject={handleCreateProject}
              />

              <Input
                type="search"
                placeholder="Search features..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8"
              />

              <div className="px-2 py-1.5 flex items-center justify-between">
                <span className="flex-1 text-gray-500 text-sm">
                  {selectedFeatureIds.size > 0
                    ? `${selectedFeatureIds.size} selected`
                    : ''}
                </span>

                <Button
                  size="sm"
                  onClick={handleMergeClick}
                  className="h-7"
                  disabled={selectedFeatureIds.size < 2}
                >
                  {selectedFeatureIds.size > 1
                    ? `Merge ${selectedFeatureIds.size}`
                    : 'Merge'}
                </Button>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredFeatures.map((feature) => {
                    const isSelected = selectedFeatureIds.has(feature.id)
                    const isHovered = hoveredFeatureId === feature.id
                    const isCurrent = currentFeatureId === feature.id
                    const showCheckbox = isSelected || isHovered || isCurrent

                    return (
                      <SidebarMenuItem
                        key={feature.id}
                        onMouseEnter={() => setHoveredFeatureId(feature.id)}
                        onMouseLeave={() => setHoveredFeatureId(null)}
                      >
                        <div className="flex items-center gap-2 w-full group">
                          <SidebarMenuButton asChild className="flex-1">
                            <Link
                              to="/features/$id"
                              params={{ id: feature.id.toString() }}
                            >
                              {feature.name}
                            </Link>
                          </SidebarMenuButton>

                          <div
                            className={`flex items-center justify-center transition-opacity ${
                              showCheckbox ? 'opacity-100' : 'opacity-0'
                            }`}
                            onClick={(e) => {
                              e.preventDefault()
                              toggleFeatureSelection(feature.id)
                            }}
                          >
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() =>
                                toggleFeatureSelection(feature.id)
                              }
                            />
                          </div>
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
            open={mergeModalOpen}
            onOpenChange={async (open, reason) => {
              setMergeModalOpen(open)
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
