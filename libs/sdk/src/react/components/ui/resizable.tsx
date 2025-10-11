import type * as React from 'react'
import { GripVerticalIcon } from 'lucide-react'
import * as ResizablePrimitive from 'react-resizable-panels'

import { cn } from '@/src/react/lib/utils'

function ResizablePanelGroup({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup>) {
  return (
    <ResizablePrimitive.PanelGroup
      data-slot="resizable-panel-group"
      className={cn(
        'tangosdk:flex tangosdk:h-full tangosdk:w-full tangosdk:data-[panel-group-direction=vertical]:flex-col',
        className
      )}
      {...props}
    />
  )
}

function ResizablePanel({
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.Panel>) {
  return <ResizablePrimitive.Panel data-slot="resizable-panel" {...props} />
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.PanelResizeHandle
      data-slot="resizable-handle"
      className={cn(
        'tangosdk:bg-border tangosdk:focus-visible:ring-ring tangosdk:relative tangosdk:flex tangosdk:w-px tangosdk:items-center tangosdk:justify-center tangosdk:after:absolute tangosdk:after:inset-y-0 tangosdk:after:left-1/2 tangosdk:after:w-1 tangosdk:after:-translate-x-1/2 tangosdk:focus-visible:ring-1 tangosdk:focus-visible:ring-offset-1 tangosdk:focus-visible:outline-hidden tangosdk:data-[panel-group-direction=vertical]:h-px tangosdk:data-[panel-group-direction=vertical]:w-full tangosdk:data-[panel-group-direction=vertical]:after:left-0 tangosdk:data-[panel-group-direction=vertical]:after:h-1 tangosdk:data-[panel-group-direction=vertical]:after:w-full tangosdk:data-[panel-group-direction=vertical]:after:translate-x-0 tangosdk:data-[panel-group-direction=vertical]:after:-translate-y-1/2 tangosdk:[&[data-panel-group-direction=vertical]>div]:rotate-90',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="tangosdk:bg-border tangosdk:z-10 tangosdk:flex tangosdk:h-4 tangosdk:w-3 tangosdk:items-center tangosdk:justify-center tangosdk:rounded-xs tangosdk:border">
          <GripVerticalIcon className="tangosdk:size-2.5" />
        </div>
      )}
    </ResizablePrimitive.PanelResizeHandle>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
