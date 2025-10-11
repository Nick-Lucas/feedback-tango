import type * as React from 'react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'
import { cva } from 'class-variance-authority'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/src/react/lib/utils'

function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Root> & {
  viewport?: boolean
}) {
  return (
    <NavigationMenuPrimitive.Root
      data-slot="navigation-menu"
      data-viewport={viewport}
      className={cn(
        'tangosdk:group/navigation-menu tangosdk:relative tangosdk:flex tangosdk:max-w-max tangosdk:flex-1 tangosdk:items-center tangosdk:justify-center',
        className
      )}
      {...props}
    >
      {children}
      {viewport && <NavigationMenuViewport />}
    </NavigationMenuPrimitive.Root>
  )
}

function NavigationMenuList({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.List>) {
  return (
    <NavigationMenuPrimitive.List
      data-slot="navigation-menu-list"
      className={cn(
        'tangosdk:group tangosdk:flex tangosdk:flex-1 tangosdk:list-none tangosdk:items-center tangosdk:justify-center tangosdk:gap-1',
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Item>) {
  return (
    <NavigationMenuPrimitive.Item
      data-slot="navigation-menu-item"
      className={cn('tangosdk:relative', className)}
      {...props}
    />
  )
}

const navigationMenuTriggerStyle = cva(
  'tangosdk:group tangosdk:inline-flex tangosdk:h-9 tangosdk:w-max tangosdk:items-center tangosdk:justify-center tangosdk:rounded-md tangosdk:bg-background tangosdk:px-4 tangosdk:py-2 tangosdk:text-sm tangosdk:font-medium tangosdk:hover:bg-accent tangosdk:hover:text-accent-foreground tangosdk:focus:bg-accent tangosdk:focus:text-accent-foreground tangosdk:disabled:pointer-events-none tangosdk:disabled:opacity-50 tangosdk:data-[state=open]:hover:bg-accent tangosdk:data-[state=open]:text-accent-foreground tangosdk:data-[state=open]:focus:bg-accent tangosdk:data-[state=open]:bg-accent/50 tangosdk:focus-visible:ring-ring/50 tangosdk:outline-none tangosdk:transition-[color,box-shadow] tangosdk:focus-visible:ring-[3px] tangosdk:focus-visible:outline-1'
)

function NavigationMenuTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Trigger>) {
  return (
    <NavigationMenuPrimitive.Trigger
      data-slot="navigation-menu-trigger"
      className={cn(navigationMenuTriggerStyle(), 'tangosdk:group', className)}
      {...props}
    >
      {children}{' '}
      <ChevronDownIcon
        className="tangosdk:relative tangosdk:top-[1px] tangosdk:ml-1 tangosdk:size-3 tangosdk:transition tangosdk:duration-300 tangosdk:group-data-[state=open]:rotate-180"
        aria-hidden="true"
      />
    </NavigationMenuPrimitive.Trigger>
  )
}

function NavigationMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Content>) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        'tangosdk:data-[motion^=from-]:animate-in tangosdk:data-[motion^=to-]:animate-out tangosdk:data-[motion^=from-]:fade-in tangosdk:data-[motion^=to-]:fade-out tangosdk:data-[motion=from-end]:slide-in-from-right-52 tangosdk:data-[motion=from-start]:slide-in-from-left-52 tangosdk:data-[motion=to-end]:slide-out-to-right-52 tangosdk:data-[motion=to-start]:slide-out-to-left-52 tangosdk:top-0 tangosdk:left-0 tangosdk:w-full tangosdk:p-2 tangosdk:pr-2.5 tangosdk:md:absolute tangosdk:md:w-auto',
        'tangosdk:group-data-[viewport=false]/navigation-menu:bg-popover tangosdk:group-data-[viewport=false]/navigation-menu:text-popover-foreground tangosdk:group-data-[viewport=false]/navigation-menu:data-[state=open]:animate-in tangosdk:group-data-[viewport=false]/navigation-menu:data-[state=closed]:animate-out tangosdk:group-data-[viewport=false]/navigation-menu:data-[state=closed]:zoom-out-95 tangosdk:group-data-[viewport=false]/navigation-menu:data-[state=open]:zoom-in-95 tangosdk:group-data-[viewport=false]/navigation-menu:data-[state=open]:fade-in-0 tangosdk:group-data-[viewport=false]/navigation-menu:data-[state=closed]:fade-out-0 tangosdk:group-data-[viewport=false]/navigation-menu:top-full tangosdk:group-data-[viewport=false]/navigation-menu:mt-1.5 tangosdk:group-data-[viewport=false]/navigation-menu:overflow-hidden tangosdk:group-data-[viewport=false]/navigation-menu:rounded-md tangosdk:group-data-[viewport=false]/navigation-menu:border tangosdk:group-data-[viewport=false]/navigation-menu:shadow tangosdk:group-data-[viewport=false]/navigation-menu:duration-200 tangosdk:**:data-[slot=navigation-menu-link]:focus:ring-0 tangosdk:**:data-[slot=navigation-menu-link]:focus:outline-none',
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuViewport({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Viewport>) {
  return (
    <div
      className={cn(
        'tangosdk:absolute tangosdk:top-full tangosdk:left-0 tangosdk:isolate tangosdk:z-50 tangosdk:flex tangosdk:justify-center'
      )}
    >
      <NavigationMenuPrimitive.Viewport
        data-slot="navigation-menu-viewport"
        className={cn(
          'tangosdk:origin-top-center tangosdk:bg-popover tangosdk:text-popover-foreground tangosdk:data-[state=open]:animate-in tangosdk:data-[state=closed]:animate-out tangosdk:data-[state=closed]:zoom-out-95 tangosdk:data-[state=open]:zoom-in-90 tangosdk:relative tangosdk:mt-1.5 tangosdk:h-[var(--radix-navigation-menu-viewport-height)] tangosdk:w-full tangosdk:overflow-hidden tangosdk:rounded-md tangosdk:border tangosdk:shadow tangosdk:md:w-[var(--radix-navigation-menu-viewport-width)]',
          className
        )}
        {...props}
      />
    </div>
  )
}

function NavigationMenuLink({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Link>) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        'tangosdk:data-[active=true]:focus:bg-accent tangosdk:data-[active=true]:hover:bg-accent tangosdk:data-[active=true]:bg-accent/50 tangosdk:data-[active=true]:text-accent-foreground tangosdk:hover:bg-accent tangosdk:hover:text-accent-foreground tangosdk:focus:bg-accent tangosdk:focus:text-accent-foreground tangosdk:focus-visible:ring-ring/50 tangosdk:[&_svg:not([class*=text-])]:text-muted-foreground tangosdk:flex tangosdk:flex-col tangosdk:gap-1 tangosdk:rounded-sm tangosdk:p-2 tangosdk:text-sm tangosdk:transition-all tangosdk:outline-none tangosdk:focus-visible:ring-[3px] tangosdk:focus-visible:outline-1 tangosdk:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    />
  )
}

function NavigationMenuIndicator({
  className,
  ...props
}: React.ComponentProps<typeof NavigationMenuPrimitive.Indicator>) {
  return (
    <NavigationMenuPrimitive.Indicator
      data-slot="navigation-menu-indicator"
      className={cn(
        'tangosdk:data-[state=visible]:animate-in tangosdk:data-[state=hidden]:animate-out tangosdk:data-[state=hidden]:fade-out tangosdk:data-[state=visible]:fade-in tangosdk:top-full tangosdk:z-[1] tangosdk:flex tangosdk:h-1.5 tangosdk:items-end tangosdk:justify-center tangosdk:overflow-hidden',
        className
      )}
      {...props}
    >
      <div className="tangosdk:bg-border tangosdk:relative tangosdk:top-[60%] tangosdk:h-2 tangosdk:w-2 tangosdk:rotate-45 tangosdk:rounded-tl-sm tangosdk:shadow-md" />
    </NavigationMenuPrimitive.Indicator>
  )
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuContent,
  NavigationMenuTrigger,
  NavigationMenuLink,
  NavigationMenuIndicator,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
}
