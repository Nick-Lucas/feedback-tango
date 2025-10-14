import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/(authed)/projects/$projectId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Navigate
      to="/projects/$projectId/features"
      params={{
        projectId: Route.useParams().projectId,
      }}
      replace
    />
  )
}
