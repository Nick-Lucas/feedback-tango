import { createFileRoute, Outlet, useMatches } from '@tanstack/react-router'
import { ProjectTabs } from '@/components/project-tabs'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectLayout,
})

function ProjectLayout() {
  const { projectId } = Route.useParams()
  const matches = useMatches()

  // Determine active tab based on current route
  const currentRoute = matches[matches.length - 1]?.routeId
  let activeTab: 'feedback' | 'raw-feedback' | 'config' = 'feedback'

  if (currentRoute?.includes('raw-feedback')) {
    activeTab = 'raw-feedback'
  } else if (currentRoute?.includes('config')) {
    activeTab = 'config'
  }

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
        <ProjectTabs projectId={projectId} activeTab={activeTab} />
      </div>
      <Outlet />
    </>
  )
}
