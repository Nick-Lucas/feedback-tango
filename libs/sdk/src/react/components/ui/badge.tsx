import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/src/react/lib/utils'

const badgeVariants = cva(
  'tangosdk:inline-flex tangosdk:items-center tangosdk:justify-center tangosdk:rounded-md tangosdk:border tangosdk:px-2 tangosdk:py-0.5 tangosdk:text-xs tangosdk:font-medium tangosdk:w-fit tangosdk:whitespace-nowrap tangosdk:shrink-0 tangosdk:[&>svg]:size-3 tangosdk:gap-1 tangosdk:[&>svg]:pointer-events-none tangosdk:focus-visible:border-ring tangosdk:focus-visible:ring-ring/50 tangosdk:focus-visible:ring-[3px] tangosdk:aria-invalid:ring-destructive/20 tangosdk:dark:aria-invalid:ring-destructive/40 tangosdk:aria-invalid:border-destructive tangosdk:transition-[color,box-shadow] tangosdk:overflow-hidden',
  {
    variants: {
      variant: {
        default:
          'tangosdk:border-transparent tangosdk:bg-primary tangosdk:text-primary-foreground tangosdk:[a&]:hover:bg-primary/90',
        secondary:
          'tangosdk:border-transparent tangosdk:bg-secondary tangosdk:text-secondary-foreground tangosdk:[a&]:hover:bg-secondary/90',
        destructive:
          'tangosdk:border-transparent tangosdk:bg-destructive tangosdk:text-white tangosdk:[a&]:hover:bg-destructive/90 tangosdk:focus-visible:ring-destructive/20 tangosdk:dark:focus-visible:ring-destructive/40 tangosdk:dark:bg-destructive/60',
        outline:
          'tangosdk:text-foreground tangosdk:[a&]:hover:bg-accent tangosdk:[a&]:hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'span'

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
