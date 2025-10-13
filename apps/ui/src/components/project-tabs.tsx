import { Link } from '@tanstack/react-router'
import { Notebook, Database, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ProjectPicker } from './project-picker'

interface Project {
  id: string
  name: string
}

interface ProjectTabsProps {
  projectId: string
  activeTab: 'feedback' | 'raw-feedback' | 'config'
  projects: Project[]
  selectedProject: Project
  onCreateProject: (name: string) => Promise<void> | void
}

export function ProjectTabs({
  projectId,
  activeTab,
  projects,
  selectedProject,
  onCreateProject,
}: ProjectTabsProps) {
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
      label: 'Project Config',
      icon: Settings,
      to: '/projects/$projectId/config' as const,
      params: { projectId },
    },
  ]

  return (
    <nav className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground gap-1">
      <ProjectPicker
        projects={projects}
        selectedProject={selectedProject}
        onCreateProject={onCreateProject}
      />
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id

        return (
          <Link
            key={tab.id}
            to={tab.to}
            params={tab.params}
            search={'search' in tab ? tab.search : undefined}
            className={cn(
              'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
              isActive
                ? 'bg-background text-foreground shadow'
                : 'hover:bg-background/50'
            )}
          >
            <Icon className="h-4 w-4 mr-2" />
            {tab.label}
          </Link>
        )
      })}
    </nav>
  )
}
