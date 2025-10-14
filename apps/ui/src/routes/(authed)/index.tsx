import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/(authed)/')({
  component: () => <Navigate to="/projects" replace />,
})
