import {
  createFileRoute,
  Outlet,
  useMatches,
  useRouter,
} from '@tanstack/react-router'
import { ProjectTabs } from '@/components/project-tabs'
import {
  projectsQueryOptions,
  useProjectsQuery,
  useCreateProjectMutation,
} from '@/lib/query-options'

export const Route = createFileRoute('/projects/$projectId')({
  component: ProjectLayout,
  async loader(ctx) {
    const queryClient = ctx.context.queryClient
    await queryClient.ensureQueryData(projectsQueryOptions({}))
  },
})

function ProjectLayout() {
  const { projectId } = Route.useParams()
  const matches = useMatches()
  const { data: projects } = useProjectsQuery()
  const router = useRouter()
  const createProjectMutation = useCreateProjectMutation()

  const project = projects.find((p) => p.id === projectId)!

  // Determine active tab based on current route
  const currentRoute = matches[matches.length - 1]?.routeId
  let activeTab: 'feedback' | 'raw-feedback' | 'config' = 'feedback'

  if (currentRoute?.includes('raw-feedback')) {
    activeTab = 'raw-feedback'
  } else if (currentRoute?.includes('config')) {
    activeTab = 'config'
  }

  const handleCreateProject = async (name: string) => {
    const newProject = await createProjectMutation.mutateAsync({
      name,
    })

    await router.navigate({
      to: '/projects/$projectId/features',
      params: { projectId: newProject.id },
    })
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <ProjectTabs
          projectId={projectId}
          activeTab={activeTab}
          projects={projects}
          selectedProject={project}
          onCreateProject={handleCreateProject}
        />
      </div>
      <Outlet />
    </>
  )
}
