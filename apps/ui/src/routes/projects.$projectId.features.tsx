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
import { createProject, getFeatures, getProjects } from '@/server-functions'
import { ProjectPicker } from '@/components/project-picker'
import { FeaturesSelectionMenu } from '@/components/features-selection-menu'
import { cn } from '@/lib/utils'
import { X, Plus } from 'lucide-react'

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

  const handleMergeComplete = async () => {
    setSelectedFeatureIds(new Set())
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

              <FeaturesSelectionMenu
                projectId={data.project.id}
                selectedFeatureIds={selectedFeatureIds}
                selectedFeatures={selectedFeatures}
                onClearSelection={() => setSelectedFeatureIds(new Set())}
                onSelectionProcessed={handleMergeComplete}
              />
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
                            className="flex-1 transition-all duration-75 h-fit"
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
    </SidebarProvider>
  )
}
