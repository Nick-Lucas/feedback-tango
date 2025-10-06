import * as React from 'react'

import { cn } from '@/src/react/lib/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'tangosdk:border-input tangosdk:placeholder:text-muted-foreground tangosdk:focus-visible:border-ring tangosdk:focus-visible:ring-ring/50 tangosdk:aria-invalid:ring-destructive/20 tangosdk:dark:aria-invalid:ring-destructive/40 tangosdk:aria-invalid:border-destructive tangosdk:dark:bg-input/30 tangosdk:flex tangosdk:field-sizing-content tangosdk:min-h-16 tangosdk:w-full tangosdk:rounded-md tangosdk:border tangosdk:bg-transparent tangosdk:px-3 tangosdk:py-2 tangosdk:text-base tangosdk:shadow-xs tangosdk:transition-[color,box-shadow] tangosdk:outline-none tangosdk:focus-visible:ring-[3px] tangosdk:disabled:cursor-not-allowed tangosdk:disabled:opacity-50 tangosdk:md:text-sm',
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
