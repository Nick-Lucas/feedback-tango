import * as React from 'react'
import * as MenubarPrimitive from '@radix-ui/react-menubar'
import { CheckIcon, ChevronRightIcon, CircleIcon } from 'lucide-react'

import { cn } from '@/src/react/lib/utils'

function Menubar({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Root>) {
  return (
    <MenubarPrimitive.Root
      data-slot="menubar"
      className={cn(
        'tangosdk:bg-background tangosdk:flex tangosdk:h-9 tangosdk:items-center tangosdk:gap-1 tangosdk:rounded-md tangosdk:border tangosdk:p-1 tangosdk:shadow-xs',
        className
      )}
      {...props}
    />
  )
}

function MenubarMenu({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
  return <MenubarPrimitive.Menu data-slot="menubar-menu" {...props} />
}

function MenubarGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
  return <MenubarPrimitive.Group data-slot="menubar-group" {...props} />
}

function MenubarPortal({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
  return <MenubarPrimitive.Portal data-slot="menubar-portal" {...props} />
}

function MenubarRadioGroup({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
  return (
    <MenubarPrimitive.RadioGroup data-slot="menubar-radio-group" {...props} />
  )
}

function MenubarTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Trigger>) {
  return (
    <MenubarPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        'tangosdk:focus:bg-accent tangosdk:focus:text-accent-foreground tangosdk:data-[state=open]:bg-accent tangosdk:data-[state=open]:text-accent-foreground tangosdk:flex tangosdk:items-center tangosdk:rounded-sm tangosdk:px-2 tangosdk:py-1 tangosdk:text-sm tangosdk:font-medium tangosdk:outline-hidden tangosdk:select-none',
        className
      )}
      {...props}
    />
  )
}

function MenubarContent({
  className,
  align = 'start',
  alignOffset = -4,
  sideOffset = 8,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Content>) {
  return (
    <MenubarPortal>
      <MenubarPrimitive.Content
        data-slot="menubar-content"
        align={align}
        alignOffset={alignOffset}
        sideOffset={sideOffset}
        className={cn(
          'tangosdk:bg-popover tangosdk:text-popover-foreground tangosdk:data-[state=open]:animate-in tangosdk:data-[state=closed]:fade-out-0 tangosdk:data-[state=open]:fade-in-0 tangosdk:data-[state=closed]:zoom-out-95 tangosdk:data-[state=open]:zoom-in-95 tangosdk:data-[side=bottom]:slide-in-from-top-2 tangosdk:data-[side=left]:slide-in-from-right-2 tangosdk:data-[side=right]:slide-in-from-left-2 tangosdk:data-[side=top]:slide-in-from-bottom-2 tangosdk:z-50 tangosdk:min-w-[12rem] tangosdk:origin-(--radix-menubar-content-transform-origin) tangosdk:overflow-hidden tangosdk:rounded-md tangosdk:border tangosdk:p-1 tangosdk:shadow-md',
          className
        )}
        {...props}
      />
    </MenubarPortal>
  )
}

function MenubarItem({
  className,
  inset,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Item> & {
  inset?: boolean
  variant?: 'default' | 'destructive'
}) {
  return (
    <MenubarPrimitive.Item
      data-slot="menubar-item"
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

function MenubarCheckboxItem({
  className,
  children,
  checked,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
  return (
    <MenubarPrimitive.CheckboxItem
      data-slot="menubar-checkbox-item"
      className={cn(
        'tangosdk:focus:bg-accent tangosdk:focus:text-accent-foreground tangosdk:relative tangosdk:flex tangosdk:cursor-default tangosdk:items-center tangosdk:gap-2 tangosdk:rounded-xs tangosdk:py-1.5 tangosdk:pr-2 tangosdk:pl-8 tangosdk:text-sm tangosdk:outline-hidden tangosdk:select-none tangosdk:data-[disabled]:pointer-events-none tangosdk:data-[disabled]:opacity-50 tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg]:shrink-0 tangosdk:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="tangosdk:pointer-events-none tangosdk:absolute tangosdk:left-2 tangosdk:flex tangosdk:size-3.5 tangosdk:items-center tangosdk:justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CheckIcon className="tangosdk:size-4" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.CheckboxItem>
  )
}

function MenubarRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioItem>) {
  return (
    <MenubarPrimitive.RadioItem
      data-slot="menubar-radio-item"
      className={cn(
        'tangosdk:focus:bg-accent tangosdk:focus:text-accent-foreground tangosdk:relative tangosdk:flex tangosdk:cursor-default tangosdk:items-center tangosdk:gap-2 tangosdk:rounded-xs tangosdk:py-1.5 tangosdk:pr-2 tangosdk:pl-8 tangosdk:text-sm tangosdk:outline-hidden tangosdk:select-none tangosdk:data-[disabled]:pointer-events-none tangosdk:data-[disabled]:opacity-50 tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg]:shrink-0 tangosdk:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      <span className="tangosdk:pointer-events-none tangosdk:absolute tangosdk:left-2 tangosdk:flex tangosdk:size-3.5 tangosdk:items-center tangosdk:justify-center">
        <MenubarPrimitive.ItemIndicator>
          <CircleIcon className="tangosdk:size-2 tangosdk:fill-current" />
        </MenubarPrimitive.ItemIndicator>
      </span>
      {children}
    </MenubarPrimitive.RadioItem>
  )
}

function MenubarLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Label> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.Label
      data-slot="menubar-label"
      data-inset={inset}
      className={cn(
        'tangosdk:px-2 tangosdk:py-1.5 tangosdk:text-sm tangosdk:font-medium tangosdk:data-[inset]:pl-8',
        className
      )}
      {...props}
    />
  )
}

function MenubarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Separator>) {
  return (
    <MenubarPrimitive.Separator
      data-slot="menubar-separator"
      className={cn(
        'tangosdk:bg-border tangosdk:-mx-1 tangosdk:my-1 tangosdk:h-px',
        className
      )}
      {...props}
    />
  )
}

function MenubarShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="menubar-shortcut"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:ml-auto tangosdk:text-xs tangosdk:tracking-widest',
        className
      )}
      {...props}
    />
  )
}

function MenubarSub({
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
  return <MenubarPrimitive.Sub data-slot="menubar-sub" {...props} />
}

function MenubarSubTrigger({
  className,
  inset,
  children,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubTrigger> & {
  inset?: boolean
}) {
  return (
    <MenubarPrimitive.SubTrigger
      data-slot="menubar-sub-trigger"
      data-inset={inset}
      className={cn(
        'tangosdk:focus:bg-accent tangosdk:focus:text-accent-foreground tangosdk:data-[state=open]:bg-accent tangosdk:data-[state=open]:text-accent-foreground tangosdk:flex tangosdk:cursor-default tangosdk:items-center tangosdk:rounded-sm tangosdk:px-2 tangosdk:py-1.5 tangosdk:text-sm tangosdk:outline-none tangosdk:select-none tangosdk:data-[inset]:pl-8',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon className="tangosdk:ml-auto tangosdk:h-4 tangosdk:w-4" />
    </MenubarPrimitive.SubTrigger>
  )
}

function MenubarSubContent({
  className,
  ...props
}: React.ComponentProps<typeof MenubarPrimitive.SubContent>) {
  return (
    <MenubarPrimitive.SubContent
      data-slot="menubar-sub-content"
      className={cn(
        'tangosdk:bg-popover tangosdk:text-popover-foreground tangosdk:data-[state=open]:animate-in tangosdk:data-[state=closed]:animate-out tangosdk:data-[state=closed]:fade-out-0 tangosdk:data-[state=open]:fade-in-0 tangosdk:data-[state=closed]:zoom-out-95 tangosdk:data-[state=open]:zoom-in-95 tangosdk:data-[side=bottom]:slide-in-from-top-2 tangosdk:data-[side=left]:slide-in-from-right-2 tangosdk:data-[side=right]:slide-in-from-left-2 tangosdk:data-[side=top]:slide-in-from-bottom-2 tangosdk:z-50 tangosdk:min-w-[8rem] tangosdk:origin-(--radix-menubar-content-transform-origin) tangosdk:overflow-hidden tangosdk:rounded-md tangosdk:border tangosdk:p-1 tangosdk:shadow-lg',
        className
      )}
      {...props}
    />
  )
}

export {
  Menubar,
  MenubarPortal,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarGroup,
  MenubarSeparator,
  MenubarLabel,
  MenubarItem,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
}
