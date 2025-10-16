import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Badge } from '@/components/ui/badge'
import {
  rawFeedbacksQueryOptions,
  rawFeedbackCountsQueryOptions,
  useRawFeedbacksQuery,
  useRawFeedbackCountsQuery,
} from '@/lib/query-options'
import { RawFeedbackCard } from './-/RawFeedbackCard'

export const Route = createFileRoute(
  '/(authed)/projects/$projectId/raw-feedback'
)({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      filter:
        (search.filter as 'all' | 'pending' | 'completed' | 'errors') ||
        'pending',
    }
  },
  loaderDeps: ({ search }) => ({ filter: search.filter }),
  loader: async (ctx) => {
    const queryClient = ctx.context.queryClient
    await Promise.all([
      queryClient.ensureQueryData(
        rawFeedbacksQueryOptions({
          data: {
            projectId: ctx.params.projectId,
            filter: ctx.deps.filter,
          },
        })
      ),
      queryClient.ensureQueryData(
        rawFeedbackCountsQueryOptions({
          data: {
            projectId: ctx.params.projectId,
          },
        })
      ),
    ])
  },
})

type FilterType = 'all' | 'pending' | 'completed' | 'errors'

function RouteComponent() {
  const { projectId } = Route.useParams()
  const search = Route.useSearch()
  const navigate = useNavigate()
  const filter = search.filter || 'pending'

  const { data: rawFeedbacks } = useRawFeedbacksQuery(projectId, filter)
  const { data: counts } = useRawFeedbackCountsQuery(projectId)

  const handleFilterChange = (newFilter: FilterType) => {
    void navigate({
      to: '/projects/$projectId/raw-feedback',
      params: { projectId },
      search: { filter: newFilter },
    })
  }

  return (
    <div className="max-w-4xl mx-auto p-6 pt-16 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Raw Feedback</h1>
        <p className="text-gray-400 mb-6">
          All submitted feedback and processing status
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Badge
          variant={filter === 'all' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleFilterChange('all')}
        >
          All: {counts.total}
        </Badge>
        <Badge
          variant={filter === 'pending' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleFilterChange('pending')}
        >
          Pending: {counts.pending}
        </Badge>
        <Badge
          variant={filter === 'completed' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleFilterChange('completed')}
        >
          Completed: {counts.completed}
        </Badge>
        <Badge
          variant={filter === 'errors' ? 'destructive' : 'outline'}
          className="cursor-pointer"
          onClick={() => handleFilterChange('errors')}
        >
          Errors: {counts.errors}
        </Badge>
      </div>

      {rawFeedbacks.length === 0 ? (
        <p className="text-gray-500">
          {filter === 'all' ? 'No raw feedback yet' : `No ${filter} feedback`}
        </p>
      ) : (
        <div className="space-y-4">
          {rawFeedbacks.map((rawFeedback) => (
            <RawFeedbackCard key={rawFeedback.id} rawFeedback={rawFeedback} />
          ))}
        </div>
      )}
    </div>
  )
}
