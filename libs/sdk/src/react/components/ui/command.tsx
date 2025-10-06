import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { SearchIcon } from 'lucide-react'

import { cn } from '@/src/react/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/src/react/components/ui/dialog'

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        'tangosdk:bg-popover tangosdk:text-popover-foreground tangosdk:flex tangosdk:h-full tangosdk:w-full tangosdk:flex-col tangosdk:overflow-hidden tangosdk:rounded-md',
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  className,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof Dialog> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="tangosdk:sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn('tangosdk:overflow-hidden tangosdk:p-0', className)}
        showCloseButton={showCloseButton}
      >
        <Command className="tangosdk:[&_[cmdk-group-heading]]:text-muted-foreground tangosdk:**:data-[slot=command-input-wrapper]:h-12 tangosdk:[&_[cmdk-group-heading]]:px-2 tangosdk:[&_[cmdk-group-heading]]:font-medium tangosdk:[&_[cmdk-group]]:px-2 tangosdk:[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 tangosdk:[&_[cmdk-input-wrapper]_svg]:h-5 tangosdk:[&_[cmdk-input-wrapper]_svg]:w-5 tangosdk:[&_[cmdk-input]]:h-12 tangosdk:[&_[cmdk-item]]:px-2 tangosdk:[&_[cmdk-item]]:py-3 tangosdk:[&_[cmdk-item]_svg]:h-5 tangosdk:[&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="tangosdk:flex tangosdk:h-9 tangosdk:items-center tangosdk:gap-2 tangosdk:border-b tangosdk:px-3"
    >
      <SearchIcon className="tangosdk:size-4 tangosdk:shrink-0 tangosdk:opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          'tangosdk:placeholder:text-muted-foreground tangosdk:flex tangosdk:h-10 tangosdk:w-full tangosdk:rounded-md tangosdk:bg-transparent tangosdk:py-3 tangosdk:text-sm tangosdk:outline-hidden tangosdk:disabled:cursor-not-allowed tangosdk:disabled:opacity-50',
          className
        )}
        {...props}
      />
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        'tangosdk:max-h-[300px] tangosdk:scroll-py-1 tangosdk:overflow-x-hidden tangosdk:overflow-y-auto',
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="tangosdk:py-6 tangosdk:text-center tangosdk:text-sm"
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        'tangosdk:text-foreground tangosdk:[&_[cmdk-group-heading]]:text-muted-foreground tangosdk:overflow-hidden tangosdk:p-1 tangosdk:[&_[cmdk-group-heading]]:px-2 tangosdk:[&_[cmdk-group-heading]]:py-1.5 tangosdk:[&_[cmdk-group-heading]]:text-xs tangosdk:[&_[cmdk-group-heading]]:font-medium',
        className
      )}
      {...props}
    />
  )
}

function CommandSeparator({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn(
        'tangosdk:bg-border tangosdk:-mx-1 tangosdk:h-px',
        className
      )}
      {...props}
    />
  )
}

function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        'tangosdk:data-[selected=true]:bg-accent tangosdk:data-[selected=true]:text-accent-foreground tangosdk:[&_svg:not([class*=text-])]:text-muted-foreground tangosdk:relative tangosdk:flex tangosdk:cursor-default tangosdk:items-center tangosdk:gap-2 tangosdk:rounded-sm tangosdk:px-2 tangosdk:py-1.5 tangosdk:text-sm tangosdk:outline-hidden tangosdk:select-none tangosdk:data-[disabled=true]:pointer-events-none tangosdk:data-[disabled=true]:opacity-50 tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg]:shrink-0 tangosdk:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    />
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:ml-auto tangosdk:text-xs tangosdk:tracking-widest',
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
