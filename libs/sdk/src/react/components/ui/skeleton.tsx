import { cn } from '@/src/react/lib/utils'

function Skeleton({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        'tangosdk:bg-accent tangosdk:animate-pulse tangosdk:rounded-md',
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
