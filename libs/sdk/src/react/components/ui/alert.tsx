import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/src/react/lib/utils'

const alertVariants = cva(
  'tangosdk:relative tangosdk:w-full tangosdk:rounded-lg tangosdk:border tangosdk:px-4 tangosdk:py-3 tangosdk:text-sm tangosdk:grid tangosdk:has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] tangosdk:grid-cols-[0_1fr] tangosdk:has-[>svg]:gap-x-3 tangosdk:gap-y-0.5 tangosdk:items-start tangosdk:[&>svg]:size-4 tangosdk:[&>svg]:translate-y-0.5 tangosdk:[&>svg]:text-current',
  {
    variants: {
      variant: {
        default: 'tangosdk:bg-card tangosdk:text-card-foreground',
        destructive:
          'tangosdk:text-destructive tangosdk:bg-card tangosdk:[&>svg]:text-current tangosdk:*:data-[slot=alert-description]:text-destructive/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        'tangosdk:col-start-2 tangosdk:line-clamp-1 tangosdk:min-h-4 tangosdk:font-medium tangosdk:tracking-tight',
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:col-start-2 tangosdk:grid tangosdk:justify-items-start tangosdk:gap-1 tangosdk:text-sm tangosdk:[&_p]:leading-relaxed',
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
