import * as React from 'react'

import { cn } from '@/src/react/lib/utils'

function Table({ className, ...props }: React.ComponentProps<'table'>) {
  return (
    <div
      data-slot="table-container"
      className="tangosdk:relative tangosdk:w-full tangosdk:overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn(
          'tangosdk:w-full tangosdk:caption-bottom tangosdk:text-sm',
          className
        )}
        {...props}
      />
    </div>
  )
}

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return (
    <thead
      data-slot="table-header"
      className={cn('tangosdk:[&_tr]:border-b', className)}
      {...props}
    />
  )
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return (
    <tbody
      data-slot="table-body"
      className={cn('tangosdk:[&_tr:last-child]:border-0', className)}
      {...props}
    />
  )
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        'tangosdk:bg-muted/50 tangosdk:border-t tangosdk:font-medium tangosdk:[&>tr]:last:border-b-0',
        className
      )}
      {...props}
    />
  )
}

function TableRow({ className, ...props }: React.ComponentProps<'tr'>) {
  return (
    <tr
      data-slot="table-row"
      className={cn(
        'tangosdk:hover:bg-muted/50 tangosdk:data-[state=selected]:bg-muted tangosdk:border-b tangosdk:transition-colors',
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        'tangosdk:text-foreground tangosdk:h-10 tangosdk:px-2 tangosdk:text-left tangosdk:align-middle tangosdk:font-medium tangosdk:whitespace-nowrap tangosdk:[&:has([role=checkbox])]:pr-0 tangosdk:[&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        'tangosdk:p-2 tangosdk:align-middle tangosdk:whitespace-nowrap tangosdk:[&:has([role=checkbox])]:pr-0 tangosdk:[&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  )
}

function TableCaption({
  className,
  ...props
}: React.ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:mt-4 tangosdk:text-sm',
        className
      )}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
