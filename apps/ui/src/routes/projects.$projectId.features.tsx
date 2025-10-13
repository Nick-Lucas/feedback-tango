import {
  createFileRoute,
  useChildMatches,
  Link,
  Outlet,
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
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FeaturesSelectionMenu } from '@/components/features-selection-menu'
import { cn } from '@/lib/utils'
import { X, Plus } from 'lucide-react'
import {
  projectsQueryOptions,
  featuresQueryOptions,
  useFeaturesQuery,
} from '@/lib/query-options'

export const Route = createFileRoute('/projects/$projectId/features')({
  component: App,
  async loader(ctx) {
    const projectId = ctx.params.projectId
    const queryClient = ctx.context.queryClient

    await Promise.all([
      queryClient.ensureQueryData(projectsQueryOptions({})),
      queryClient.ensureQueryData(
        featuresQueryOptions({
          data: { projectId },
        })
      ),
    ])
  },
})

function App() {
  const { projectId } = Route.useParams()
  const { data: features } = useFeaturesQuery(projectId)

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

  const filteredFeatures = features.filter((feature) =>
    feature.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedFeatures = features.filter((f) => selectedFeatureIds.has(f.id))

  const toggleFeatureSelection = (featureId: string) => {
    const newSelected = new Set(selectedFeatureIds)
    if (newSelected.has(featureId)) {
      newSelected.delete(featureId)
    } else {
      newSelected.add(featureId)
    }
    setSelectedFeatureIds(newSelected)
  }

  const handleMergeComplete = () => {
    setSelectedFeatureIds(new Set())
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent className="gap-0">
            <div className="p-2 space-y-2">
              <Input
                type="search"
                placeholder="Search features..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8"
              />

              <FeaturesSelectionMenu
                projectId={projectId}
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
                            className="flex-1 transition-all duration-75 h-fit [&>span:last-child]:text-wrap"
                            isActive={isCurrent}
                          >
                            <Link
                              to="/projects/$projectId/features/$featureId"
                              params={{
                                projectId: projectId,
                                featureId: feature.id.toString(),
                              }}
                            >
                              <span className="line-clamp-2">
                                {feature.name}
                              </span>
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

        <main className="flex-1 p-6 pt-16 relative">
          <div className="md:hidden fixed top-2 left-2 z-50">
            <SidebarTrigger className="size-8" />
          </div>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
