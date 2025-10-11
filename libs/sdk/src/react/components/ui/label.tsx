'use client'

import type * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

import { cn } from '@/src/react/lib/utils'

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        'tangosdk:flex tangosdk:items-center tangosdk:gap-2 tangosdk:text-sm tangosdk:leading-none tangosdk:font-medium tangosdk:select-none tangosdk:group-data-[disabled=true]:pointer-events-none tangosdk:group-data-[disabled=true]:opacity-50 tangosdk:peer-disabled:cursor-not-allowed tangosdk:peer-disabled:opacity-50',
        className
      )}
      {...props}
    />
  )
}

export { Label }
