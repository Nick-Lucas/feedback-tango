import {
  createFileRoute,
  Link,
  Outlet,
  useNavigate,
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
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getFeatures, getProjects } from '@/server-functions'
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
  const navigate = useNavigate({ from: '/features' })
  const data = Route.useLoaderData()

  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredFeatures = data.features.filter((feature) =>
    feature.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-2 space-y-2">
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full h-8 justify-between"
                  >
                    {data.project?.name || 'Select project...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="Search projects..." />
                    <CommandList>
                      <CommandEmpty>No project found.</CommandEmpty>
                      <CommandGroup>
                        {data.projects.map((project) => (
                          <CommandItem
                            key={project.id}
                            value={project.name}
                            onSelect={async () => {
                              await navigate({
                                search: {
                                  projectId: project.id,
                                },
                              })

                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                data.project?.id === project.id
                                  ? 'opacity-100'
                                  : 'opacity-0'
                              )}
                            />
                            {project.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

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
