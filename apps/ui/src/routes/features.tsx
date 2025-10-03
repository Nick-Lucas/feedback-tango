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

export const Route = createFileRoute('/features')({
  component: App,
})

const mockFeatures = [
  { id: 1, name: 'User Authentication' },
  { id: 2, name: 'Dashboard Analytics' },
  { id: 3, name: 'Payment Integration' },
  { id: 4, name: 'Email Notifications' },
  { id: 5, name: 'Dark Mode Support' },
  { id: 6, name: 'API Documentation' },
]

function App() {
  const [search, setSearch] = useState('')

  const filteredFeatures = mockFeatures.filter((feature) =>
    feature.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarContent>
            <div className="p-2">
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
