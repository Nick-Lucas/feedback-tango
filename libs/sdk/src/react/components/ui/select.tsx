import type * as React from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react'

import { cn } from '@/src/react/lib/utils'

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />
}

function SelectGroup({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

function SelectTrigger({
  className,
  size = 'default',
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  size?: 'sm' | 'default'
}) {
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={cn(
        'tangosdk:border-input tangosdk:data-[placeholder]:text-muted-foreground tangosdk:[&_svg:not([class*=text-])]:text-muted-foreground tangosdk:focus-visible:border-ring tangosdk:focus-visible:ring-ring/50 tangosdk:aria-invalid:ring-destructive/20 tangosdk:dark:aria-invalid:ring-destructive/40 tangosdk:aria-invalid:border-destructive tangosdk:dark:bg-input/30 tangosdk:dark:hover:bg-input/50 tangosdk:flex tangosdk:w-fit tangosdk:items-center tangosdk:justify-between tangosdk:gap-2 tangosdk:rounded-md tangosdk:border tangosdk:bg-transparent tangosdk:px-3 tangosdk:py-2 tangosdk:text-sm tangosdk:whitespace-nowrap tangosdk:shadow-xs tangosdk:transition-[color,box-shadow] tangosdk:outline-none tangosdk:focus-visible:ring-[3px] tangosdk:disabled:cursor-not-allowed tangosdk:disabled:opacity-50 tangosdk:data-[size=default]:h-9 tangosdk:data-[size=sm]:h-8 tangosdk:*:data-[slot=select-value]:line-clamp-1 tangosdk:*:data-[slot=select-value]:flex tangosdk:*:data-[slot=select-value]:items-center tangosdk:*:data-[slot=select-value]:gap-2 tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg]:shrink-0 tangosdk:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon className="tangosdk:size-4 tangosdk:opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

function SelectContent({
  className,
  children,
  position = 'popper',
  align = 'center',
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          'tangosdk:bg-popover tangosdk:text-popover-foreground tangosdk:data-[state=open]:animate-in tangosdk:data-[state=closed]:animate-out tangosdk:data-[state=closed]:fade-out-0 tangosdk:data-[state=open]:fade-in-0 tangosdk:data-[state=closed]:zoom-out-95 tangosdk:data-[state=open]:zoom-in-95 tangosdk:data-[side=bottom]:slide-in-from-top-2 tangosdk:data-[side=left]:slide-in-from-right-2 tangosdk:data-[side=right]:slide-in-from-left-2 tangosdk:data-[side=top]:slide-in-from-bottom-2 tangosdk:relative tangosdk:z-50 tangosdk:max-h-(--radix-select-content-available-height) tangosdk:min-w-[8rem] tangosdk:origin-(--radix-select-content-transform-origin) tangosdk:overflow-x-hidden tangosdk:overflow-y-auto tangosdk:rounded-md tangosdk:border tangosdk:shadow-md',
          position === 'popper' &&
            'tangosdk:data-[side=bottom]:translate-y-1 tangosdk:data-[side=left]:-translate-x-1 tangosdk:data-[side=right]:translate-x-1 tangosdk:data-[side=top]:-translate-y-1',
          className
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />
        <SelectPrimitive.Viewport
          className={cn(
            'tangosdk:p-1',
            position === 'popper' &&
              'tangosdk:h-[var(--radix-select-trigger-height)] tangosdk:w-full tangosdk:min-w-[var(--radix-select-trigger-width)] tangosdk:scroll-my-1'
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:px-2 tangosdk:py-1.5 tangosdk:text-xs',
        className
      )}
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        'tangosdk:focus:bg-accent tangosdk:focus:text-accent-foreground tangosdk:[&_svg:not([class*=text-])]:text-muted-foreground tangosdk:relative tangosdk:flex tangosdk:w-full tangosdk:cursor-default tangosdk:items-center tangosdk:gap-2 tangosdk:rounded-sm tangosdk:py-1.5 tangosdk:pr-8 tangosdk:pl-2 tangosdk:text-sm tangosdk:outline-hidden tangosdk:select-none tangosdk:data-[disabled]:pointer-events-none tangosdk:data-[disabled]:opacity-50 tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg]:shrink-0 tangosdk:[&_svg:not([class*=size-])]:size-4 tangosdk:*:[span]:last:flex tangosdk:*:[span]:last:items-center tangosdk:*:[span]:last:gap-2',
        className
      )}
      {...props}
    >
      <span className="tangosdk:absolute tangosdk:right-2 tangosdk:flex tangosdk:size-3.5 tangosdk:items-center tangosdk:justify-center">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="tangosdk:size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn(
        'tangosdk:bg-border tangosdk:pointer-events-none tangosdk:-mx-1 tangosdk:my-1 tangosdk:h-px',
        className
      )}
      {...props}
    />
  )
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        'tangosdk:flex tangosdk:cursor-default tangosdk:items-center tangosdk:justify-center tangosdk:py-1',
        className
      )}
      {...props}
    >
      <ChevronUpIcon className="tangosdk:size-4" />
    </SelectPrimitive.ScrollUpButton>
  )
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        'tangosdk:flex tangosdk:cursor-default tangosdk:items-center tangosdk:justify-center tangosdk:py-1',
        className
      )}
      {...props}
    >
      <ChevronDownIcon className="tangosdk:size-4" />
    </SelectPrimitive.ScrollDownButton>
  )
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
