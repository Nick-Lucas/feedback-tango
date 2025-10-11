import type * as React from 'react'

import { cn } from '@/src/react/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'tangosdk:file:text-foreground tangosdk:placeholder:text-muted-foreground tangosdk:selection:bg-primary tangosdk:selection:text-primary-foreground tangosdk:dark:bg-input/30 tangosdk:border-input tangosdk:h-9 tangosdk:w-full tangosdk:min-w-0 tangosdk:rounded-md tangosdk:border tangosdk:bg-transparent tangosdk:px-3 tangosdk:py-1 tangosdk:text-base tangosdk:shadow-xs tangosdk:transition-[color,box-shadow] tangosdk:outline-none tangosdk:file:inline-flex tangosdk:file:h-7 tangosdk:file:border-0 tangosdk:file:bg-transparent tangosdk:file:text-sm tangosdk:file:font-medium tangosdk:disabled:pointer-events-none tangosdk:disabled:cursor-not-allowed tangosdk:disabled:opacity-50 tangosdk:md:text-sm',
        'tangosdk:focus-visible:border-ring tangosdk:focus-visible:ring-ring/50 tangosdk:focus-visible:ring-[3px]',
        'tangosdk:aria-invalid:ring-destructive/20 tangosdk:dark:aria-invalid:ring-destructive/40 tangosdk:aria-invalid:border-destructive',
        className
      )}
      {...props}
    />
  )
}

export { Input }
