import type * as React from 'react'
import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'

import { cn } from '@/src/react/lib/utils'

function Sheet({ ...props }: React.ComponentProps<typeof SheetPrimitive.Root>) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />
}

function SheetTrigger({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Trigger>) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />
}

function SheetClose({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Close>) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />
}

function SheetPortal({
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Portal>) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />
}

function SheetOverlay({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Overlay>) {
  return (
    <SheetPrimitive.Overlay
      data-slot="sheet-overlay"
      className={cn(
        'tangosdk:data-[state=open]:animate-in tangosdk:data-[state=closed]:animate-out tangosdk:data-[state=closed]:fade-out-0 tangosdk:data-[state=open]:fade-in-0 tangosdk:fixed tangosdk:inset-0 tangosdk:z-50 tangosdk:bg-black/50',
        className
      )}
      {...props}
    />
  )
}

function SheetContent({
  className,
  children,
  side = 'right',
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'top' | 'right' | 'bottom' | 'left'
}) {
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Content
        data-slot="sheet-content"
        className={cn(
          'tangosdk:bg-background tangosdk:data-[state=open]:animate-in tangosdk:data-[state=closed]:animate-out tangosdk:fixed tangosdk:z-50 tangosdk:flex tangosdk:flex-col tangosdk:gap-4 tangosdk:shadow-lg tangosdk:transition tangosdk:ease-in-out tangosdk:data-[state=closed]:duration-300 tangosdk:data-[state=open]:duration-500',
          side === 'right' &&
            'tangosdk:data-[state=closed]:slide-out-to-right tangosdk:data-[state=open]:slide-in-from-right tangosdk:inset-y-0 tangosdk:right-0 tangosdk:h-full tangosdk:w-3/4 tangosdk:border-l tangosdk:sm:max-w-sm',
          side === 'left' &&
            'tangosdk:data-[state=closed]:slide-out-to-left tangosdk:data-[state=open]:slide-in-from-left tangosdk:inset-y-0 tangosdk:left-0 tangosdk:h-full tangosdk:w-3/4 tangosdk:border-r tangosdk:sm:max-w-sm',
          side === 'top' &&
            'tangosdk:data-[state=closed]:slide-out-to-top tangosdk:data-[state=open]:slide-in-from-top tangosdk:inset-x-0 tangosdk:top-0 tangosdk:h-auto tangosdk:border-b',
          side === 'bottom' &&
            'tangosdk:data-[state=closed]:slide-out-to-bottom tangosdk:data-[state=open]:slide-in-from-bottom tangosdk:inset-x-0 tangosdk:bottom-0 tangosdk:h-auto tangosdk:border-t',
          className
        )}
        {...props}
      >
        {children}
        <SheetPrimitive.Close className="tangosdk:ring-offset-background tangosdk:focus:ring-ring tangosdk:data-[state=open]:bg-secondary tangosdk:absolute tangosdk:top-4 tangosdk:right-4 tangosdk:rounded-xs tangosdk:opacity-70 tangosdk:transition-opacity tangosdk:hover:opacity-100 tangosdk:focus:ring-2 tangosdk:focus:ring-offset-2 tangosdk:focus:outline-hidden tangosdk:disabled:pointer-events-none">
          <XIcon className="tangosdk:size-4" />
          <span className="tangosdk:sr-only">Close</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPortal>
  )
}

function SheetHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        'tangosdk:flex tangosdk:flex-col tangosdk:gap-1.5 tangosdk:p-4',
        className
      )}
      {...props}
    />
  )
}

function SheetFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sheet-footer"
      className={cn(
        'tangosdk:mt-auto tangosdk:flex tangosdk:flex-col tangosdk:gap-2 tangosdk:p-4',
        className
      )}
      {...props}
    />
  )
}

function SheetTitle({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Title>) {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn(
        'tangosdk:text-foreground tangosdk:font-semibold',
        className
      )}
      {...props}
    />
  )
}

function SheetDescription({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:text-sm',
        className
      )}
      {...props}
    />
  )
}

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}
