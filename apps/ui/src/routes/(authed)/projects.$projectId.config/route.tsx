import { createFileRoute } from '@tanstack/react-router'
import { ProjectMembershipSection } from '@/components/project-membership-section'
import {
  projectQueryOptions,
  projectMembersQueryOptions,
  useProjectQuery,
  useProjectMembersQuery,
} from '@/lib/query-options'
import { PublicKeyCard } from './-/PublicKeyCard'
import { ReprocessFeedbackCard } from './-/ReprocessFeedbackCard'
import { SyncSettingsCard } from './-/SyncSettingsCard'

export const Route = createFileRoute('/(authed)/projects/$projectId/config')({
  component: RouteComponent,
  async loader(ctx) {
    const queryClient = ctx.context.queryClient
    const projectId = ctx.params.projectId

    await Promise.all([
      queryClient.ensureQueryData(
        projectQueryOptions({
          data: { projectId },
        })
      ),
      queryClient.ensureQueryData(
        projectMembersQueryOptions({
          data: { projectId },
        })
      ),
    ])
  },
})

function RouteComponent() {
  const { projectId } = Route.useParams()
  const { data: project } = useProjectQuery(projectId)
  const { data: members } = useProjectMembersQuery(projectId)

  const currentUserMembership = members.find(
    (m) => m.user.id === project.createdBy
  )
  const isOwner = currentUserMembership?.role === 'owner'

  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Project Configuration</h1>
        <p className="text-muted-foreground">
          Manage your project settings and integrations
        </p>
      </div>

      <PublicKeyCard projectId={project.id} />

      <ProjectMembershipSection
        projectId={project.id}
        members={members}
        projectCreatorId={project.createdBy}
        isOwner={isOwner}
      />

      <ReprocessFeedbackCard projectId={projectId} isOwner={isOwner} />

      <SyncSettingsCard />
    </div>
  )
}
