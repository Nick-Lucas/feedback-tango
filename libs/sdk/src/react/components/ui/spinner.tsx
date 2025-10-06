import { Loader2Icon } from 'lucide-react'

import { cn } from '@/src/react/lib/utils'

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn('tangosdk:size-4 tangosdk:animate-spin', className)}
      {...props}
    />
  )
}

export { Spinner }
