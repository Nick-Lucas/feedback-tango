import { createFileRoute } from '@tanstack/react-router'
import { Ellipsis } from 'lucide-react'

export const Route = createFileRoute('/(authed)/projects/$projectId/features/')(
  {
    component: RouteComponent,
  }
)

function RouteComponent() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <Ellipsis className="w-24 h-24 text-gray-500 mb-4" />
      <p className="text-gray-500">Select a feature to explore its feedback</p>
    </div>
  )
}
