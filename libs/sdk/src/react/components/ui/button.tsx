import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/src/react/lib/utils'

const buttonVariants = cva(
  'tangosdk:inline-flex tangosdk:items-center tangosdk:justify-center tangosdk:gap-2 tangosdk:whitespace-nowrap tangosdk:rounded-md tangosdk:text-sm tangosdk:font-medium tangosdk:transition-all tangosdk:disabled:pointer-events-none tangosdk:disabled:opacity-50 tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg:not([class*=size-])]:size-4 tangosdk:shrink-0 tangosdk:[&_svg]:shrink-0 tangosdk:outline-none tangosdk:focus-visible:border-ring tangosdk:focus-visible:ring-ring/50 tangosdk:focus-visible:ring-[3px] tangosdk:aria-invalid:ring-destructive/20 tangosdk:dark:aria-invalid:ring-destructive/40 tangosdk:aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default:
          'tangosdk:bg-primary tangosdk:text-primary-foreground tangosdk:hover:bg-primary/90',
        destructive:
          'tangosdk:bg-destructive tangosdk:text-white tangosdk:hover:bg-destructive/90 tangosdk:focus-visible:ring-destructive/20 tangosdk:dark:focus-visible:ring-destructive/40 tangosdk:dark:bg-destructive/60',
        outline:
          'tangosdk:border tangosdk:bg-background tangosdk:shadow-xs tangosdk:hover:bg-accent tangosdk:hover:text-accent-foreground tangosdk:dark:bg-input/30 tangosdk:dark:border-input tangosdk:dark:hover:bg-input/50',
        secondary:
          'tangosdk:bg-secondary tangosdk:text-secondary-foreground tangosdk:hover:bg-secondary/80',
        ghost:
          'tangosdk:hover:bg-accent tangosdk:hover:text-accent-foreground tangosdk:dark:hover:bg-accent/50',
        link: 'tangosdk:text-primary tangosdk:underline-offset-4 tangosdk:hover:underline',
      },
      size: {
        default:
          'tangosdk:h-9 tangosdk:px-4 tangosdk:py-2 tangosdk:has-[>svg]:px-3',
        sm: 'tangosdk:h-8 tangosdk:rounded-md tangosdk:gap-1.5 tangosdk:px-3 tangosdk:has-[>svg]:px-2.5',
        lg: 'tangosdk:h-10 tangosdk:rounded-md tangosdk:px-6 tangosdk:has-[>svg]:px-4',
        icon: 'tangosdk:size-9',
        'icon-sm': 'tangosdk:size-8',
        'icon-lg': 'tangosdk:size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
