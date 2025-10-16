import {
  ThumbsUp,
  ThumbsDown,
  Wrench,
  Infinity as InfinityIcon,
} from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '../../../../lib/utils'

const SENTIMENT_FILTER_BADGE = {
  all: {
    label: 'All',
    className: 'bg-transparent text-gray-400 border-gray-600/40',
    activeClassName: 'bg-white text-gray-900 border-white',
    tooltipClassName: 'font-semibold',
    icon: <InfinityIcon className="h-3 w-3" />,
  },
  positive: {
    label: 'Positive',
    className: 'bg-transparent text-gray-400 border-gray-600/40',
    activeClassName: 'bg-green-500/50 text-green-200 border-green-500/60',
    tooltipClassName:
      'bg-green-500 text-neutral-800 font-semibold border-green-500/60 [&_svg]:!bg-green-500 [&_svg]:!fill-green-500',
    icon: <ThumbsUp fill="currentColor" className="h-3 w-3" />,
  },
  constructive: {
    label: 'Constructive',
    className: 'bg-transparent text-gray-400 border-gray-600/40',
    activeClassName: 'bg-yellow-500/50 text-yellow-200 border-yellow-500/60',
    tooltipClassName:
      'bg-yellow-500 text-neutral-800 font-semibold border-yellow-500 [&_svg]:!bg-yellow-500 [&_svg]:!fill-yellow-500',
    icon: <Wrench fill="currentColor" className="h-3 w-3" />,
  },
  negative: {
    label: 'Negative',
    className: 'bg-transparent text-gray-400 border-gray-600/40',
    activeClassName: 'bg-red-500/50 text-red-200 border-red-500/60',
    tooltipClassName:
      'bg-destructive text-neutral-800 font-semibold border-destructive/60 [&_svg]:!bg-destructive [&_svg]:!fill-destructive',
    icon: <ThumbsDown fill="currentColor" className="h-3 w-3" />,
  },
}

export function SentimentFilterBadge({
  sentiment,
  count,
  active,
  onClick,
  className: customClassName,
}: {
  sentiment: 'all' | 'positive' | 'constructive' | 'negative'
  count: number
  active: boolean
  onClick: () => void
  className?: string
}) {
  const { className, activeClassName, icon, label, tooltipClassName } =
    SENTIMENT_FILTER_BADGE[sentiment]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            `px-2 py-1 rounded text-xs font-medium border transition-colors`,
            active ? activeClassName : className,
            `hover:opacity-80 flex items-center gap-1.5 cursor-pointer`,
            customClassName
          )}
        >
          {icon}
          {count}
        </button>
      </TooltipTrigger>

      <TooltipContent className={tooltipClassName}>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  )
}
