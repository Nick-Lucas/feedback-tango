'use client'

import type * as React from 'react'
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'

import { cn } from '@/src/react/lib/utils'

function ContextMenu({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Root>) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />
}

function ContextMenuTrigger({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Trigger>) {
  return (
    <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" {...props} />
  )
}

function ContextMenuGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Group>) {
  return (
    <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />
  )
}

function ContextMenuPortal({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Portal>) {
  return (
    <ContextMenuPrimitive.Portal data-slot="context-menu-portal" {...props} />
  )
}

function ContextMenuSub({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Sub>) {
  return <ContextMenuPrimitive.Sub data-slot="context-menu-sub" {...props} />
}

function ContextMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup>) {
  return (
    <ContextMenuPrimitive.RadioGroup
      data-slot="context-menu-radio-group"
      {...props}
    />
  )
}

function ContextMenuSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.SubTrigger
      data-slot="context-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        'tangosdk:focus:bg-accent tangosdk:focus:text-accent-foreground tangosdk:data-[state=open]:bg-accent tangosdk:data-[state=open]:text-accent-foreground tangosdk:[&_svg:not([class*=text-])]:text-muted-foreground tangosdk:flex tangosdk:cursor-default tangosdk:items-center tangosdk:rounded-sm tangosdk:px-2 tangosdk:py-1.5 tangosdk:text-sm tangosdk:outline-hidden tangosdk:select-none tangosdk:data-[inset]:pl-8 tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg]:shrink-0 tangosdk:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="tangosdk:ml-auto" />
    </ContextMenuPrimitive.SubTrigger>
  )
}

function ContextMenuSubContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.SubContent>) {
  return (
    <ContextMenuPrimitive.SubContent
      data-slot="context-menu-sub-content"
      className={cn(
        'tangosdk:bg-popover tangosdk:text-popover-foreground tangosdk:data-[state=open]:animate-in tangosdk:data-[state=closed]:animate-out tangosdk:data-[state=closed]:fade-out-0 tangosdk:data-[state=open]:fade-in-0 tangosdk:data-[state=closed]:zoom-out-95 tangosdk:data-[state=open]:zoom-in-95 tangosdk:data-[side=bottom]:slide-in-from-top-2 tangosdk:data-[side=left]:slide-in-from-right-2 tangosdk:data-[side=right]:slide-in-from-left-2 tangosdk:data-[side=top]:slide-in-from-bottom-2 tangosdk:z-50 tangosdk:min-w-[8rem] tangosdk:origin-(--radix-context-menu-content-transform-origin) tangosdk:overflow-hidden tangosdk:rounded-md tangosdk:border tangosdk:p-1 tangosdk:shadow-lg',
        className
      )}
      {...props}
    />
  )
}

function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Content>) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Content
        data-slot="context-menu-content"
        className={cn(
          'tangosdk:bg-popover tangosdk:text-popover-foreground tangosdk:data-[state=open]:animate-in tangosdk:data-[state=closed]:animate-out tangosdk:data-[state=closed]:fade-out-0 tangosdk:data-[state=open]:fade-in-0 tangosdk:data-[state=closed]:zoom-out-95 tangosdk:data-[state=open]:zoom-in-95 tangosdk:data-[side=bottom]:slide-in-from-top-2 tangosdk:data-[side=left]:slide-in-from-right-2 tangosdk:data-[side=right]:slide-in-from-left-2 tangosdk:data-[side=top]:slide-in-from-bottom-2 tangosdk:z-50 tangosdk:max-h-(--radix-context-menu-content-available-height) tangosdk:min-w-[8rem] tangosdk:origin-(--radix-context-menu-content-transform-origin) tangosdk:overflow-x-hidden tangosdk:overflow-y-auto tangosdk:rounded-md tangosdk:border tangosdk:p-1 tangosdk:shadow-md',
          className
        )}
        {...props}
      />
    </ContextMenuPrimitive.Portal>
  )
}

function ContextMenuItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Item> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) {
  return (
    <ContextMenuPrimitive.Item
      data-slot="context-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        'tangosdk:focus:bg-accent tangosdk:focus:text-accent-foreground tangosdk:data-[variant=destructive]:text-destructive tangosdk:data-[variant=destructive]:focus:bg-destructive/10 tangosdk:dark:data-[variant=destructive]:focus:bg-destructive/20 tangosdk:data-[variant=destructive]:focus:text-destructive tangosdk:data-[variant=destructive]:*:[svg]:!text-destructive tangosdk:[&_svg:not([class*=text-])]:text-muted-foreground tangosdk:relative tangosdk:flex tangosdk:cursor-default tangosdk:items-center tangosdk:gap-2 tangosdk:rounded-sm tangosdk:px-2 tangosdk:py-1.5 tangosdk:text-sm tangosdk:outline-hidden tangosdk:select-none tangosdk:data-[disabled]:pointer-events-none tangosdk:data-[disabled]:opacity-50 tangosdk:data-[inset]:pl-8 tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg]:shrink-0 tangosdk:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    />
  )
}

function ContextMenuCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem>) {
  return (
    <ContextMenuPrimitive.CheckboxItem
      data-slot="context-menu-checkbox-item"
      className={cn(
        'tangosdk:focus:bg-accent tangosdk:focus:text-accent-foreground tangosdk:relative tangosdk:flex tangosdk:cursor-default tangosdk:items-center tangosdk:gap-2 tangosdk:rounded-sm tangosdk:py-1.5 tangosdk:pr-2 tangosdk:pl-8 tangosdk:text-sm tangosdk:outline-hidden tangosdk:select-none tangosdk:data-[disabled]:pointer-events-none tangosdk:data-[disabled]:opacity-50 tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg]:shrink-0 tangosdk:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="tangosdk:pointer-events-none tangosdk:absolute tangosdk:left-2 tangosdk:flex tangosdk:size-3.5 tangosdk:items-center tangosdk:justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CheckIcon className="tangosdk:size-4" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  )
}

function ContextMenuRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.RadioItem>) {
  return (
    <ContextMenuPrimitive.RadioItem
      data-slot="context-menu-radio-item"
      className={cn(
        'tangosdk:focus:bg-accent tangosdk:focus:text-accent-foreground tangosdk:relative tangosdk:flex tangosdk:cursor-default tangosdk:items-center tangosdk:gap-2 tangosdk:rounded-sm tangosdk:py-1.5 tangosdk:pr-2 tangosdk:pl-8 tangosdk:text-sm tangosdk:outline-hidden tangosdk:select-none tangosdk:data-[disabled]:pointer-events-none tangosdk:data-[disabled]:opacity-50 tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg]:shrink-0 tangosdk:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      <span className="tangosdk:pointer-events-none tangosdk:absolute tangosdk:left-2 tangosdk:flex tangosdk:size-3.5 tangosdk:items-center tangosdk:justify-center">
        <ContextMenuPrimitive.ItemIndicator>
          <CircleIcon className="tangosdk:size-2 tangosdk:fill-current" />
        </ContextMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  )
}

function ContextMenuLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <ContextMenuPrimitive.Label
      data-slot="context-menu-label"
      data-inset={inset}
      className={cn(
        'tangosdk:text-foreground tangosdk:px-2 tangosdk:py-1.5 tangosdk:text-sm tangosdk:font-medium tangosdk:data-[inset]:pl-8',
        className
      )}
      {...props}
    />
  )
}

function ContextMenuSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ContextMenuPrimitive.Separator>) {
  return (
    <ContextMenuPrimitive.Separator
      data-slot="context-menu-separator"
      className={cn(
        'tangosdk:bg-border tangosdk:-mx-1 tangosdk:my-1 tangosdk:h-px',
        className
      )}
      {...props}
    />
  )
}

function ContextMenuShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="context-menu-shortcut"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:ml-auto tangosdk:text-xs tangosdk:tracking-widest',
        className
      )}
      {...props}
    />
  )
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuRadioGroup,
}
