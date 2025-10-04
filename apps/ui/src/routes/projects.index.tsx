import { getProjects } from '@/server-functions'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/')({
  component: RouteComponent,
  async loader() {
    return {
      projects: await getProjects(),
    }
  },
})

function RouteComponent() {
  const { projects } = Route.useLoaderData()

  if (projects.length === 0) {
    // TODO: implement a form
    return (
      <div className="p-8">
        No projects found. Please create a project first.
      </div>
    )
  }

  return (
    <Navigate
      to="/projects/$projectId/features"
      params={{ projectId: projects[0].id }}
      replace
    />
  )
}
