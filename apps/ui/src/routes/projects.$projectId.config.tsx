import { createFileRoute } from '@tanstack/react-router'
import { getProject, getProjectMembers } from '@/server-functions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/projects/$projectId/config')({
  component: RouteComponent,
  async loader(ctx) {
    const project = await getProject({
      data: { projectId: ctx.params.projectId },
    })

    const users = await getProjectMembers({
      data: { projectId: ctx.params.projectId },
    })

    return {
      project,
      users,
    }
  },
})

function RouteComponent() {
  const data = Route.useLoaderData()
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(data.project.id)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Project Configuration</h1>
        <p className="text-muted-foreground">
          Manage your project settings and integrations
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Public Key</CardTitle>
        </CardHeader>

        <CardContent className="flex gap-2">
          <Input
            id="public-key"
            value={data.project.id}
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

      <Card>
        <CardHeader>
          <CardTitle>Members</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-3">
            {data.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2 rounded-lg border"
              >
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sync Settings</CardTitle>
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
