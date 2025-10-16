import {
  ThumbsUp,
  ThumbsDown,
  Wrench,
  Infinity as InfinityIcon,
} from 'lucide-react'

const SENTIMENT_FILTER_BADGE = {
  all: {
    label: 'All',
    className: 'bg-transparent text-gray-400 border-gray-600/40',
    activeClassName: 'bg-white text-gray-900 border-white',
    icon: <InfinityIcon className="h-3 w-3" />,
  },
  positive: {
    label: 'Positive',
    className: 'bg-transparent text-green-300 border-green-500/30',
    activeClassName: 'bg-green-500/50 text-green-200 border-green-500/60',
    icon: <ThumbsUp fill="currentColor" className="h-3 w-3" />,
  },
  constructive: {
    label: 'Constructive',
    className: 'bg-transparent text-yellow-300 border-yellow-500/30',
    activeClassName: 'bg-yellow-500/50 text-yellow-200 border-yellow-500/60',
    icon: <Wrench fill="currentColor" className="h-3 w-3" />,
  },
  negative: {
    label: 'Negative',
    className: 'bg-transparent text-red-300 border-red-500/30',
    activeClassName: 'bg-red-500/50 text-red-200 border-red-500/60',
    icon: <ThumbsDown fill="currentColor" className="h-3 w-3" />,
  },
}

export function SentimentFilterBadge({
  sentiment,
  count,
  active,
  onClick,
}: {
  sentiment: 'all' | 'positive' | 'constructive' | 'negative'
  count: number
  active: boolean
  onClick: () => void
}) {
  const { className, activeClassName, icon } = SENTIMENT_FILTER_BADGE[sentiment]

  return (
    <button
      onClick={onClick}
      className={`px-2 py-1 rounded text-xs font-medium border transition-colors ${
        active ? activeClassName : className
      } hover:opacity-80 flex items-center gap-1.5 cursor-pointer`}
    >
      {icon}
      {count}
    </button>
  )
}
