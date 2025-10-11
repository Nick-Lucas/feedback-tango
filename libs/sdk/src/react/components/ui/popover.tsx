'use client'

import type * as React from 'react'
import * as PopoverPrimitive from '@radix-ui/react-popover'

import { cn } from '@/src/react/lib/utils'

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = 'center',
  sideOffset = 4,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        align={align}
        sideOffset={sideOffset}
        className={cn(
          'tangosdk:bg-popover tangosdk:text-popover-foreground tangosdk:data-[state=open]:animate-in tangosdk:data-[state=closed]:animate-out tangosdk:data-[state=closed]:fade-out-0 tangosdk:data-[state=open]:fade-in-0 tangosdk:data-[state=closed]:zoom-out-95 tangosdk:data-[state=open]:zoom-in-95 tangosdk:data-[side=bottom]:slide-in-from-top-2 tangosdk:data-[side=left]:slide-in-from-right-2 tangosdk:data-[side=right]:slide-in-from-left-2 tangosdk:data-[side=top]:slide-in-from-bottom-2 tangosdk:z-50 tangosdk:w-72 tangosdk:origin-(--radix-popover-content-transform-origin) tangosdk:rounded-md tangosdk:border tangosdk:p-4 tangosdk:shadow-md tangosdk:outline-hidden',
          className
        )}
        {...props}
      />
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
