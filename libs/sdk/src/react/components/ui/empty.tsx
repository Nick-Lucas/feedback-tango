import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/src/react/lib/utils'

function Empty({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty"
      className={cn(
        'tangosdk:flex tangosdk:min-w-0 tangosdk:flex-1 tangosdk:flex-col tangosdk:items-center tangosdk:justify-center tangosdk:gap-6 tangosdk:rounded-lg tangosdk:border-dashed tangosdk:p-6 tangosdk:text-center tangosdk:text-balance tangosdk:md:p-12',
        className
      )}
      {...props}
    />
  )
}

function EmptyHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-header"
      className={cn(
        'tangosdk:flex tangosdk:max-w-sm tangosdk:flex-col tangosdk:items-center tangosdk:gap-2 tangosdk:text-center',
        className
      )}
      {...props}
    />
  )
}

const emptyMediaVariants = cva(
  'tangosdk:flex tangosdk:shrink-0 tangosdk:items-center tangosdk:justify-center tangosdk:mb-2 tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'tangosdk:bg-transparent',
        icon: 'tangosdk:bg-muted tangosdk:text-foreground tangosdk:flex tangosdk:size-10 tangosdk:shrink-0 tangosdk:items-center tangosdk:justify-center tangosdk:rounded-lg tangosdk:[&_svg:not([class*=size-])]:size-6',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof emptyMediaVariants>) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function EmptyTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-title"
      className={cn(
        'tangosdk:text-lg tangosdk:font-medium tangosdk:tracking-tight',
        className
      )}
      {...props}
    />
  )
}

function EmptyDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <div
      data-slot="empty-description"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:[&>a:hover]:text-primary tangosdk:text-sm/relaxed tangosdk:[&>a]:underline tangosdk:[&>a]:underline-offset-4',
        className
      )}
      {...props}
    />
  )
}

function EmptyContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="empty-content"
      className={cn(
        'tangosdk:flex tangosdk:w-full tangosdk:max-w-sm tangosdk:min-w-0 tangosdk:flex-col tangosdk:items-center tangosdk:gap-4 tangosdk:text-sm tangosdk:text-balance',
        className
      )}
      {...props}
    />
  )
}

export {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
}
