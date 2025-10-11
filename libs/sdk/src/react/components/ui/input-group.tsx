'use client'

import type * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/src/react/lib/utils'
import { Button } from '@/src/react/components/ui/button'
import { Input } from '@/src/react/components/ui/input'
import { Textarea } from '@/src/react/components/ui/textarea'

function InputGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-group"
      role="group"
      className={cn(
        'tangosdk:group/input-group tangosdk:border-input tangosdk:dark:bg-input/30 tangosdk:relative tangosdk:flex tangosdk:w-full tangosdk:items-center tangosdk:rounded-md tangosdk:border tangosdk:shadow-xs tangosdk:transition-[color,box-shadow] tangosdk:outline-none',
        'tangosdk:h-9 tangosdk:min-w-0 tangosdk:has-[>textarea]:h-auto',

        // Variants based on alignment.
        'tangosdk:has-[>[data-align=inline-start]]:[&>input]:pl-2',
        'tangosdk:has-[>[data-align=inline-end]]:[&>input]:pr-2',
        'tangosdk:has-[>[data-align=block-start]]:h-auto tangosdk:has-[>[data-align=block-start]]:flex-col tangosdk:has-[>[data-align=block-start]]:[&>input]:pb-3',
        'tangosdk:has-[>[data-align=block-end]]:h-auto tangosdk:has-[>[data-align=block-end]]:flex-col tangosdk:has-[>[data-align=block-end]]:[&>input]:pt-3',

        // Focus state.
        'tangosdk:has-[[data-slot=input-group-control]:focus-visible]:border-ring tangosdk:has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 tangosdk:has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]',

        // Error state.
        'tangosdk:has-[[data-slot][aria-invalid=true]]:ring-destructive/20 tangosdk:has-[[data-slot][aria-invalid=true]]:border-destructive tangosdk:dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',

        className
      )}
      {...props}
    />
  )
}

const inputGroupAddonVariants = cva(
  'tangosdk:text-muted-foreground tangosdk:flex tangosdk:h-auto tangosdk:cursor-text tangosdk:items-center tangosdk:justify-center tangosdk:gap-2 tangosdk:py-1.5 tangosdk:text-sm tangosdk:font-medium tangosdk:select-none tangosdk:[&>svg:not([class*=size-])]:size-4 tangosdk:[&>kbd]:rounded-[calc(var(--radius)-5px)] tangosdk:group-data-[disabled=true]/input-group:opacity-50',
  {
    variants: {
      align: {
        'inline-start':
          'tangosdk:order-first tangosdk:pl-3 tangosdk:has-[>button]:ml-[-0.45rem] tangosdk:has-[>kbd]:ml-[-0.35rem]',
        'inline-end':
          'tangosdk:order-last tangosdk:pr-3 tangosdk:has-[>button]:mr-[-0.45rem] tangosdk:has-[>kbd]:mr-[-0.35rem]',
        'block-start':
          'tangosdk:order-first tangosdk:w-full tangosdk:justify-start tangosdk:px-3 tangosdk:pt-3 tangosdk:[.border-b]:pb-3 tangosdk:group-has-[>input]/input-group:pt-2.5',
        'block-end':
          'tangosdk:order-last tangosdk:w-full tangosdk:justify-start tangosdk:px-3 tangosdk:pb-3 tangosdk:[.border-t]:pt-3 tangosdk:group-has-[>input]/input-group:pb-2.5',
      },
    },
    defaultVariants: {
      align: 'inline-start',
    },
  }
)

function InputGroupAddon({
  className,
  align = 'inline-start',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof inputGroupAddonVariants>) {
  return (
    <div
      role="group"
      data-slot="input-group-addon"
      data-align={align}
      className={cn(inputGroupAddonVariants({ align }), className)}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('button')) {
          return
        }
        e.currentTarget.parentElement?.querySelector('input')?.focus()
      }}
      {...props}
    />
  )
}

const inputGroupButtonVariants = cva(
  'tangosdk:text-sm tangosdk:shadow-none tangosdk:flex tangosdk:gap-2 tangosdk:items-center',
  {
    variants: {
      size: {
        xs: 'tangosdk:h-6 tangosdk:gap-1 tangosdk:px-2 tangosdk:rounded-[calc(var(--radius)-5px)] tangosdk:[&>svg:not([class*=size-])]:size-3.5 tangosdk:has-[>svg]:px-2',
        sm: 'tangosdk:h-8 tangosdk:px-2.5 tangosdk:gap-1.5 tangosdk:rounded-md tangosdk:has-[>svg]:px-2.5',
        'icon-xs':
          'tangosdk:size-6 tangosdk:rounded-[calc(var(--radius)-5px)] tangosdk:p-0 tangosdk:has-[>svg]:p-0',
        'icon-sm': 'tangosdk:size-8 tangosdk:p-0 tangosdk:has-[>svg]:p-0',
      },
    },
    defaultVariants: {
      size: 'xs',
    },
  }
)

function InputGroupButton({
  className,
  type = 'button',
  variant = 'ghost',
  size = 'xs',
  ...props
}: Omit<React.ComponentProps<typeof Button>, 'size'> &
  VariantProps<typeof inputGroupButtonVariants>) {
  return (
    <Button
      type={type}
      data-size={size}
      variant={variant}
      className={cn(inputGroupButtonVariants({ size }), className)}
      {...props}
    />
  )
}

function InputGroupText({ className, ...props }: React.ComponentProps<'span'>) {
  return (
    <span
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:flex tangosdk:items-center tangosdk:gap-2 tangosdk:text-sm tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    />
  )
}

function InputGroupInput({
  className,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <Input
      data-slot="input-group-control"
      className={cn(
        'tangosdk:flex-1 tangosdk:rounded-none tangosdk:border-0 tangosdk:bg-transparent tangosdk:shadow-none tangosdk:focus-visible:ring-0 tangosdk:dark:bg-transparent',
        className
      )}
      {...props}
    />
  )
}

function InputGroupTextarea({
  className,
  ...props
}: React.ComponentProps<'textarea'>) {
  return (
    <Textarea
      data-slot="input-group-control"
      className={cn(
        'tangosdk:flex-1 tangosdk:resize-none tangosdk:rounded-none tangosdk:border-0 tangosdk:bg-transparent tangosdk:py-3 tangosdk:shadow-none tangosdk:focus-visible:ring-0 tangosdk:dark:bg-transparent',
        className
      )}
      {...props}
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupInput,
  InputGroupTextarea,
}
