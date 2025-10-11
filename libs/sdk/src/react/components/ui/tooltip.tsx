'use client'

import type * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

import { cn } from '@/src/react/lib/utils'

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return (
    <TooltipProvider>
      <TooltipPrimitive.Root data-slot="tooltip" {...props} />
    </TooltipProvider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'tangosdk:bg-foreground tangosdk:text-background tangosdk:animate-in tangosdk:fade-in-0 tangosdk:zoom-in-95 tangosdk:data-[state=closed]:animate-out tangosdk:data-[state=closed]:fade-out-0 tangosdk:data-[state=closed]:zoom-out-95 tangosdk:data-[side=bottom]:slide-in-from-top-2 tangosdk:data-[side=left]:slide-in-from-right-2 tangosdk:data-[side=right]:slide-in-from-left-2 tangosdk:data-[side=top]:slide-in-from-bottom-2 tangosdk:z-50 tangosdk:w-fit tangosdk:origin-(--radix-tooltip-content-transform-origin) tangosdk:rounded-md tangosdk:px-3 tangosdk:py-1.5 tangosdk:text-xs tangosdk:text-balance',
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className="tangosdk:bg-foreground tangosdk:fill-foreground tangosdk:z-50 tangosdk:size-2.5 tangosdk:translate-y-[calc(-50%_-_2px)] tangosdk:rotate-45 tangosdk:rounded-[2px]" />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
