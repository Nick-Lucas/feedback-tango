import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/projects/$projectId/config')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/projects/$projectId/config"!</div>
}
