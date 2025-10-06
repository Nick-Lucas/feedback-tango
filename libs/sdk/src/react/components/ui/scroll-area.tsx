'use client'

import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

import { cn } from '@/src/react/lib/utils'

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root
      data-slot="scroll-area"
      className={cn('tangosdk:relative', className)}
      {...props}
    >
      <ScrollAreaPrimitive.Viewport
        data-slot="scroll-area-viewport"
        className="tangosdk:focus-visible:ring-ring/50 tangosdk:size-full tangosdk:rounded-[inherit] tangosdk:transition-[color,box-shadow] tangosdk:outline-none tangosdk:focus-visible:ring-[3px] tangosdk:focus-visible:outline-1"
      >
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot="scroll-area-scrollbar"
      orientation={orientation}
      className={cn(
        'tangosdk:flex tangosdk:touch-none tangosdk:p-px tangosdk:transition-colors tangosdk:select-none',
        orientation === 'vertical' &&
          'tangosdk:h-full tangosdk:w-2.5 tangosdk:border-l tangosdk:border-l-transparent',
        orientation === 'horizontal' &&
          'tangosdk:h-2.5 tangosdk:flex-col tangosdk:border-t tangosdk:border-t-transparent',
        className
      )}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb
        data-slot="scroll-area-thumb"
        className="tangosdk:bg-border tangosdk:relative tangosdk:flex-1 tangosdk:rounded-full"
      />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

export { ScrollArea, ScrollBar }
