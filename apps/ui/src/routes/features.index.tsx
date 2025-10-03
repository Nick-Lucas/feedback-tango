import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/features/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Select a feature to explore your feedback!</div>
}
