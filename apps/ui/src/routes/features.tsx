import {
  createFileRoute,
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
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Input } from '@/components/ui/input'
import { createProject, getFeatures, getProjects } from '@/server-functions'
import { ProjectPicker } from '@/components/project-picker'
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

  const [search, setSearch] = useState('')

  const filteredFeatures = data.features.filter((feature) =>
    feature.name.toLowerCase().includes(search.toLowerCase())
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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
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
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Features</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredFeatures.map((feature) => (
                    <SidebarMenuItem key={feature.id}>
                      <SidebarMenuButton asChild>
                        <Link
                          to="/features/$id"
                          params={{ id: feature.id.toString() }}
                        >
                          {feature.name}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
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
