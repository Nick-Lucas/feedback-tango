'use client'

import type * as React from 'react'
import { Drawer as DrawerPrimitive } from 'vaul'

import { cn } from '@/src/react/lib/utils'

function Drawer({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) {
  return <DrawerPrimitive.Root data-slot="drawer" {...props} />
}

function DrawerTrigger({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Trigger>) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
}

function DrawerPortal({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Portal>) {
  return <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
}

function DrawerClose({
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Close>) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
}

function DrawerOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Overlay>) {
  return (
    <DrawerPrimitive.Overlay
      data-slot="drawer-overlay"
      className={cn(
        'tangosdk:data-[state=open]:animate-in tangosdk:data-[state=closed]:animate-out tangosdk:data-[state=closed]:fade-out-0 tangosdk:data-[state=open]:fade-in-0 tangosdk:fixed tangosdk:inset-0 tangosdk:z-50 tangosdk:bg-black/50',
        className
      )}
      {...props}
    />
  )
}

function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Content>) {
  return (
    <DrawerPortal data-slot="drawer-portal">
      <DrawerOverlay />
      <DrawerPrimitive.Content
        data-slot="drawer-content"
        className={cn(
          'tangosdk:group/drawer-content tangosdk:bg-background tangosdk:fixed tangosdk:z-50 tangosdk:flex tangosdk:h-auto tangosdk:flex-col',
          'tangosdk:data-[vaul-drawer-direction=top]:inset-x-0 tangosdk:data-[vaul-drawer-direction=top]:top-0 tangosdk:data-[vaul-drawer-direction=top]:mb-24 tangosdk:data-[vaul-drawer-direction=top]:max-h-[80vh] tangosdk:data-[vaul-drawer-direction=top]:rounded-b-lg tangosdk:data-[vaul-drawer-direction=top]:border-b',
          'tangosdk:data-[vaul-drawer-direction=bottom]:inset-x-0 tangosdk:data-[vaul-drawer-direction=bottom]:bottom-0 tangosdk:data-[vaul-drawer-direction=bottom]:mt-24 tangosdk:data-[vaul-drawer-direction=bottom]:max-h-[80vh] tangosdk:data-[vaul-drawer-direction=bottom]:rounded-t-lg tangosdk:data-[vaul-drawer-direction=bottom]:border-t',
          'tangosdk:data-[vaul-drawer-direction=right]:inset-y-0 tangosdk:data-[vaul-drawer-direction=right]:right-0 tangosdk:data-[vaul-drawer-direction=right]:w-3/4 tangosdk:data-[vaul-drawer-direction=right]:border-l tangosdk:data-[vaul-drawer-direction=right]:sm:max-w-sm',
          'tangosdk:data-[vaul-drawer-direction=left]:inset-y-0 tangosdk:data-[vaul-drawer-direction=left]:left-0 tangosdk:data-[vaul-drawer-direction=left]:w-3/4 tangosdk:data-[vaul-drawer-direction=left]:border-r tangosdk:data-[vaul-drawer-direction=left]:sm:max-w-sm',
          className
        )}
        {...props}
      >
        <div className="tangosdk:bg-muted tangosdk:mx-auto tangosdk:mt-4 tangosdk:hidden tangosdk:h-2 tangosdk:w-[100px] tangosdk:shrink-0 tangosdk:rounded-full tangosdk:group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  )
}

function DrawerHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-header"
      className={cn(
        'tangosdk:flex tangosdk:flex-col tangosdk:gap-0.5 tangosdk:p-4 tangosdk:group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center tangosdk:group-data-[vaul-drawer-direction=top]/drawer-content:text-center tangosdk:md:gap-1.5 tangosdk:md:text-left',
        className
      )}
      {...props}
    />
  )
}

function DrawerFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn(
        'tangosdk:mt-auto tangosdk:flex tangosdk:flex-col tangosdk:gap-2 tangosdk:p-4',
        className
      )}
      {...props}
    />
  )
}

function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Title>) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn(
        'tangosdk:text-foreground tangosdk:font-semibold',
        className
      )}
      {...props}
    />
  )
}

function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Description>) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:text-sm',
        className
      )}
      {...props}
    />
  )
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
