'use client'

import type * as React from 'react'
import * as TabsPrimitive from '@radix-ui/react-tabs'

import { cn } from '@/src/react/lib/utils'

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn(
        'tangosdk:flex tangosdk:flex-col tangosdk:gap-2',
        className
      )}
      {...props}
    />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        'tangosdk:bg-muted tangosdk:text-muted-foreground tangosdk:inline-flex tangosdk:h-9 tangosdk:w-fit tangosdk:items-center tangosdk:justify-center tangosdk:rounded-lg tangosdk:p-[3px]',
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        'tangosdk:data-[state=active]:bg-background tangosdk:dark:data-[state=active]:text-foreground tangosdk:focus-visible:border-ring tangosdk:focus-visible:ring-ring/50 tangosdk:focus-visible:outline-ring tangosdk:dark:data-[state=active]:border-input tangosdk:dark:data-[state=active]:bg-input/30 tangosdk:text-foreground tangosdk:dark:text-muted-foreground tangosdk:inline-flex tangosdk:h-[calc(100%-1px)] tangosdk:flex-1 tangosdk:items-center tangosdk:justify-center tangosdk:gap-1.5 tangosdk:rounded-md tangosdk:border tangosdk:border-transparent tangosdk:px-2 tangosdk:py-1 tangosdk:text-sm tangosdk:font-medium tangosdk:whitespace-nowrap tangosdk:transition-[color,box-shadow] tangosdk:focus-visible:ring-[3px] tangosdk:focus-visible:outline-1 tangosdk:disabled:pointer-events-none tangosdk:disabled:opacity-50 tangosdk:data-[state=active]:shadow-sm tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg]:shrink-0 tangosdk:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('tangosdk:flex-1 tangosdk:outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
