'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'

import { cn } from '@/src/react/lib/utils'

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'tangosdk:peer tangosdk:border-input tangosdk:dark:bg-input/30 tangosdk:data-[state=checked]:bg-primary tangosdk:data-[state=checked]:text-primary-foreground tangosdk:dark:data-[state=checked]:bg-primary tangosdk:data-[state=checked]:border-primary tangosdk:focus-visible:border-ring tangosdk:focus-visible:ring-ring/50 tangosdk:aria-invalid:ring-destructive/20 tangosdk:dark:aria-invalid:ring-destructive/40 tangosdk:aria-invalid:border-destructive tangosdk:size-4 tangosdk:shrink-0 tangosdk:rounded-[4px] tangosdk:border tangosdk:shadow-xs tangosdk:transition-shadow tangosdk:outline-none tangosdk:focus-visible:ring-[3px] tangosdk:disabled:cursor-not-allowed tangosdk:disabled:opacity-50',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="tangosdk:flex tangosdk:items-center tangosdk:justify-center tangosdk:text-current tangosdk:transition-none"
      >
        <CheckIcon className="tangosdk:size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
