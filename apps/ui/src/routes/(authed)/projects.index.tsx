import { Button } from '@/components/ui/button'
import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  projectsQueryOptions,
  useProjectsQuery,
  useCreateProjectMutation,
} from '@/lib/query-options'

export const Route = createFileRoute('/(authed)/projects/')({
  component: RouteComponent,
  async loader(ctx) {
    const queryClient = ctx.context.queryClient
    await queryClient.ensureQueryData(projectsQueryOptions({}))
  },
})

function RouteComponent() {
  const { data: projects } = useProjectsQuery()
  const navigate = useNavigate()
  const [projectName, setProjectName] = useState('')

  const createProjectMutation = useCreateProjectMutation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim() || createProjectMutation.isPending) return

    try {
      const project = await createProjectMutation.mutateAsync({
        name: projectName.trim(),
      })

      await navigate({
        to: '/projects/$projectId/config',
        params: { projectId: project.id },
      })
    } catch (error) {
      console.error('Failed to create project:', error)
    }
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold mb-6">
            Let's create your first Project
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="projectName"
                className="block text-sm font-medium mb-2"
              >
                Project Name
              </label>

              <input
                type="text"
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="My Project"
                autoFocus
                required
              />
            </div>

            <Button
              type="submit"
              disabled={!projectName.trim() || createProjectMutation.isPending}
              className="w-full px-4 py-2 rounded-md"
            >
              {createProjectMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </form>
        </div>
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
