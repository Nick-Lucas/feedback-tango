import { createFileRoute, Outlet } from '@tanstack/react-router'
import { ProjectTabs } from '@/components/project-tabs'
import { projectsQueryOptions } from '@/lib/query-options'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectLayout,
  async loader(ctx) {
    const queryClient = ctx.context.queryClient
    await queryClient.ensureQueryData(projectsQueryOptions({}))
  },
})

function ProjectLayout() {
  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ProjectTabs />
      </div>
      <Outlet />
    </>
  )
}
