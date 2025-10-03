import { createFileRoute, Link, Outlet } from '@tanstack/react-router'
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

export const Route = createFileRoute('/features')({
  component: App,
})

const mockProjects = [
  { id: 1, name: 'E-commerce Platform' },
  { id: 2, name: 'Mobile App' },
  { id: 3, name: 'Admin Dashboard' },
]

const mockFeaturesByProject: Record<
  number,
  Array<{ id: number; name: string }>
> = {
  1: [
    { id: 1, name: 'User Authentication' },
    { id: 2, name: 'Dashboard Analytics' },
    { id: 3, name: 'Payment Integration' },
  ],
  2: [
    { id: 4, name: 'Email Notifications' },
    { id: 5, name: 'Dark Mode Support' },
  ],
  3: [
    { id: 6, name: 'API Documentation' },
    { id: 7, name: 'User Management' },
    { id: 8, name: 'Reporting System' },
  ],
}

function App() {
  const [open, setOpen] = useState(false)
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    mockProjects[0].id.toString()
  )
  const [search, setSearch] = useState('')

  const currentFeatures =
    mockFeaturesByProject[parseInt(selectedProjectId)] || []
  const filteredFeatures = currentFeatures.filter((feature) =>
    feature.name.toLowerCase().includes(search.toLowerCase())
  )

  const selectedProject = mockProjects.find(
    (project) => project.id.toString() === selectedProjectId
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
                    {selectedProject?.name || 'Select project...'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                  <Command>
                    <CommandInput placeholder="Search projects..." />
                    <CommandList>
                      <CommandEmpty>No project found.</CommandEmpty>
                      <CommandGroup>
                        {mockProjects.map((project) => (
                          <CommandItem
                            key={project.id}
                            value={project.name}
                            onSelect={() => {
                              setSelectedProjectId(project.id.toString())
                              setOpen(false)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedProjectId === project.id.toString()
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
