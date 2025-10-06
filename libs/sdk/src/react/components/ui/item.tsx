import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/src/react/lib/utils'
import { Separator } from '@/src/react/components/ui/separator'

function ItemGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      role="list"
      data-slot="item-group"
      className={cn(
        'tangosdk:group/item-group tangosdk:flex tangosdk:flex-col',
        className
      )}
      {...props}
    />
  )
}

function ItemSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="item-separator"
      orientation="horizontal"
      className={cn('tangosdk:my-0', className)}
      {...props}
    />
  )
}

const itemVariants = cva(
  'tangosdk:group/item tangosdk:flex tangosdk:items-center tangosdk:border tangosdk:border-transparent tangosdk:text-sm tangosdk:rounded-md tangosdk:transition-colors tangosdk:[a]:hover:bg-accent/50 tangosdk:[a]:transition-colors tangosdk:duration-100 tangosdk:flex-wrap tangosdk:outline-none tangosdk:focus-visible:border-ring tangosdk:focus-visible:ring-ring/50 tangosdk:focus-visible:ring-[3px]',
  {
    variants: {
      variant: {
        default: 'tangosdk:bg-transparent',
        outline: 'tangosdk:border-border',
        muted: 'tangosdk:bg-muted/50',
      },
      size: {
        default: 'tangosdk:p-4 tangosdk:gap-4 tangosdk:',
        sm: 'tangosdk:py-3 tangosdk:px-4 tangosdk:gap-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function Item({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'div'> &
  VariantProps<typeof itemVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'
  return (
    <Comp
      data-slot="item"
      data-variant={variant}
      data-size={size}
      className={cn(itemVariants({ variant, size, className }))}
      {...props}
    />
  )
}

const itemMediaVariants = cva(
  'tangosdk:flex tangosdk:shrink-0 tangosdk:items-center tangosdk:justify-center tangosdk:gap-2 tangosdk:group-has-[[data-slot=item-description]]/item:self-start tangosdk:[&_svg]:pointer-events-none tangosdk:group-has-[[data-slot=item-description]]/item:translate-y-0.5',
  {
    variants: {
      variant: {
        default: 'tangosdk:bg-transparent',
        icon: 'tangosdk:size-8 tangosdk:border tangosdk:rounded-sm tangosdk:bg-muted tangosdk:[&_svg:not([class*=size-])]:size-4',
        image:
          'tangosdk:size-10 tangosdk:rounded-sm tangosdk:overflow-hidden tangosdk:[&_img]:size-full tangosdk:[&_img]:object-cover',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function ItemMedia({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof itemMediaVariants>) {
  return (
    <div
      data-slot="item-media"
      data-variant={variant}
      className={cn(itemMediaVariants({ variant, className }))}
      {...props}
    />
  )
}

function ItemContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-content"
      className={cn(
        'tangosdk:flex tangosdk:flex-1 tangosdk:flex-col tangosdk:gap-1 tangosdk:[&+[data-slot=item-content]]:flex-none',
        className
      )}
      {...props}
    />
  )
}

function ItemTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-title"
      className={cn(
        'tangosdk:flex tangosdk:w-fit tangosdk:items-center tangosdk:gap-2 tangosdk:text-sm tangosdk:leading-snug tangosdk:font-medium',
        className
      )}
      {...props}
    />
  )
}

function ItemDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="item-description"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:line-clamp-2 tangosdk:text-sm tangosdk:leading-normal tangosdk:font-normal tangosdk:text-balance',
        'tangosdk:[&>a:hover]:text-primary tangosdk:[&>a]:underline tangosdk:[&>a]:underline-offset-4',
        className
      )}
      {...props}
    />
  )
}

function ItemActions({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-actions"
      className={cn(
        'tangosdk:flex tangosdk:items-center tangosdk:gap-2',
        className
      )}
      {...props}
    />
  )
}

function ItemHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-header"
      className={cn(
        'tangosdk:flex tangosdk:basis-full tangosdk:items-center tangosdk:justify-between tangosdk:gap-2',
        className
      )}
      {...props}
    />
  )
}

function ItemFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="item-footer"
      className={cn(
        'tangosdk:flex tangosdk:basis-full tangosdk:items-center tangosdk:justify-between tangosdk:gap-2',
        className
      )}
      {...props}
    />
  )
}

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
  ItemHeader,
  ItemFooter,
}
