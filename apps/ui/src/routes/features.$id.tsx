import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/features/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/features/$id"!</div>
}
