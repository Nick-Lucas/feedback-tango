'use client'

import type * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'

import { cn } from '@/src/react/lib/utils'

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'tangosdk:peer tangosdk:data-[state=checked]:bg-primary tangosdk:data-[state=unchecked]:bg-input tangosdk:focus-visible:border-ring tangosdk:focus-visible:ring-ring/50 tangosdk:dark:data-[state=unchecked]:bg-input/80 tangosdk:inline-flex tangosdk:h-[1.15rem] tangosdk:w-8 tangosdk:shrink-0 tangosdk:items-center tangosdk:rounded-full tangosdk:border tangosdk:border-transparent tangosdk:shadow-xs tangosdk:transition-all tangosdk:outline-none tangosdk:focus-visible:ring-[3px] tangosdk:disabled:cursor-not-allowed tangosdk:disabled:opacity-50',
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'tangosdk:bg-background tangosdk:dark:data-[state=unchecked]:bg-foreground tangosdk:dark:data-[state=checked]:bg-primary-foreground tangosdk:pointer-events-none tangosdk:block tangosdk:size-4 tangosdk:rounded-full tangosdk:ring-0 tangosdk:transition-transform tangosdk:data-[state=checked]:translate-x-[calc(100%-2px)] tangosdk:data-[state=unchecked]:translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
