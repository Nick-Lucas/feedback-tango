import * as React from 'react'
import * as TogglePrimitive from '@radix-ui/react-toggle'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/src/react/lib/utils'

const toggleVariants = cva(
  'tangosdk:inline-flex tangosdk:items-center tangosdk:justify-center tangosdk:gap-2 tangosdk:rounded-md tangosdk:text-sm tangosdk:font-medium tangosdk:hover:bg-muted tangosdk:hover:text-muted-foreground tangosdk:disabled:pointer-events-none tangosdk:disabled:opacity-50 tangosdk:data-[state=on]:bg-accent tangosdk:data-[state=on]:text-accent-foreground tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg:not([class*=size-])]:size-4 tangosdk:[&_svg]:shrink-0 tangosdk:focus-visible:border-ring tangosdk:focus-visible:ring-ring/50 tangosdk:focus-visible:ring-[3px] tangosdk:outline-none tangosdk:transition-[color,box-shadow] tangosdk:aria-invalid:ring-destructive/20 tangosdk:dark:aria-invalid:ring-destructive/40 tangosdk:aria-invalid:border-destructive tangosdk:whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'tangosdk:bg-transparent',
        outline:
          'tangosdk:border tangosdk:border-input tangosdk:bg-transparent tangosdk:shadow-xs tangosdk:hover:bg-accent tangosdk:hover:text-accent-foreground',
      },
      size: {
        default: 'tangosdk:h-9 tangosdk:px-2 tangosdk:min-w-9',
        sm: 'tangosdk:h-8 tangosdk:px-1.5 tangosdk:min-w-8',
        lg: 'tangosdk:h-10 tangosdk:px-2.5 tangosdk:min-w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
