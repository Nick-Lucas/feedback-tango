import type * as React from 'react'

import { cn } from '@/src/react/lib/utils'

function Card({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card"
      className={cn(
        'tangosdk:bg-card tangosdk:text-card-foreground tangosdk:flex tangosdk:flex-col tangosdk:gap-6 tangosdk:rounded-xl tangosdk:border tangosdk:py-6 tangosdk:shadow-sm',
        className
      )}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        'tangosdk:@container/card-header tangosdk:grid tangosdk:auto-rows-min tangosdk:grid-rows-[auto_auto] tangosdk:items-start tangosdk:gap-2 tangosdk:px-6 tangosdk:has-data-[slot=card-action]:grid-cols-[1fr_auto] tangosdk:[.border-b]:pb-6',
        className
      )}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-title"
      className={cn('tangosdk:leading-none tangosdk:font-semibold', className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-description"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:text-sm',
        className
      )}
      {...props}
    />
  )
}

function CardAction({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        'tangosdk:col-start-2 tangosdk:row-span-2 tangosdk:row-start-1 tangosdk:self-start tangosdk:justify-self-end',
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-content"
      className={cn('tangosdk:px-6', className)}
      {...props}
    />
  )
}

function CardFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        'tangosdk:flex tangosdk:items-center tangosdk:px-6 tangosdk:[.border-t]:pt-6',
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
