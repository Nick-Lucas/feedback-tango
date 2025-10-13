import { createFileRoute } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { ProjectMembershipSection } from '@/components/project-membership-section'
import {
  projectQueryOptions,
  projectMembersQueryOptions,
  useProjectQuery,
  useProjectMembersQuery,
} from '@/lib/query-options'

export const Route = createFileRoute('/projects/$projectId/config')({
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
  const [copied, setCopied] = useState(false)

  const currentUserMembership = members.find(
    (m) => m.user.id === project.createdBy
  )
  const isOwner = currentUserMembership?.role === 'owner'

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(project.id)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-16 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Project Configuration</h1>
        <p className="text-muted-foreground">
          Manage your project settings and integrations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Public Key</CardTitle>
          <CardDescription>
            Use this to submit feedback via the SDK
          </CardDescription>
        </CardHeader>

        <CardContent className="flex gap-2">
          <Input
            id="public-key"
            value={project.id}
            readOnly
            className="font-mono"
          />

          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="shrink-0"
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </CardContent>
      </Card>

      <ProjectMembershipSection
        projectId={project.id}
        members={members}
        projectCreatorId={project.createdBy}
        isOwner={isOwner}
      />

      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
          <CardDescription>
            Connect your feedback to tickets in your Issue Tracker
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label>Linear Integration</Label>
              <p className="text-sm text-muted-foreground mb-2">
                Sync your feedback with Linear issues
              </p>
            </div>

            <Button disabled>Connect Linear (Coming Soon)</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
