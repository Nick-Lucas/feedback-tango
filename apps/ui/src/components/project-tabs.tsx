import { Link, useParams, useMatches } from '@tanstack/react-router'
import { Notebook, Database, Settings, Menu } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProjectPicker } from './project-picker'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Separator } from './ui/separator'

export function ProjectTabs() {
  const { projectId } = useParams({ from: '/(authed)/projects/$projectId' })

  const leafMatch = useMatches({
    select(matches) {
      return matches[matches.length - 1]
    },
  })

  const tabs = [
    {
      id: 'feedback' as const,
      label: 'Feedback',
      icon: Notebook,
      to: '/projects/$projectId/features' as const,
      params: { projectId },
    },
    {
      id: 'raw-feedback' as const,
      label: 'Raw Feedback',
      icon: Database,
      to: '/projects/$projectId/raw-feedback' as const,
      params: { projectId },
      search: { filter: 'pending' as const },
    },
    {
      id: 'config' as const,
      label: 'Config',
      icon: Settings,
      to: '/projects/$projectId/config' as const,
      params: { projectId },
    },
  ]

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:inline-flex h-9 items-center justify-center rounded-lg bg-card text-muted-foreground gap-1">
        <ProjectPicker />

        <Separator orientation="vertical" />

        {tabs.map((tab) => {
          const Icon = tab.icon

          // TODO: router probably has a method which can do this better
          const isActive = leafMatch.fullPath.startsWith(tab.to)

          return (
            <Link
              key={tab.id}
              to={tab.to}
              params={tab.params}
              search={'search' in tab ? tab.search : undefined}
              className={cn(
                'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
                isActive
                  ? 'bg-accent text-foreground shadow '
                  : 'hover:bg-background/50'
              )}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </Link>
          )
        })}
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-2">
        <ProjectPicker />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = leafMatch.fullPath.startsWith(tab.to)

              return (
                <DropdownMenuItem key={tab.id} asChild>
                  <Link
                    to={tab.to}
                    params={tab.params}
                    search={'search' in tab ? tab.search : undefined}
                    className={cn(
                      'flex items-center w-full cursor-pointer',
                      isActive && 'bg-accent'
                    )}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {tab.label}
                  </Link>
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  )
}
