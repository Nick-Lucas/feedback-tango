import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'

import { cn } from '@/src/react/lib/utils'

function Dialog({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose({
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'tangosdk:data-[state=open]:animate-in tangosdk:data-[state=closed]:animate-out tangosdk:data-[state=closed]:fade-out-0 tangosdk:data-[state=open]:fade-in-0 tangosdk:fixed tangosdk:inset-0 tangosdk:z-50 tangosdk:bg-black/50',
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean
}) {
  return (
    <DialogPortal data-slot="dialog-portal">
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'tangosdk:bg-background tangosdk:data-[state=open]:animate-in tangosdk:data-[state=closed]:animate-out tangosdk:data-[state=closed]:fade-out-0 tangosdk:data-[state=open]:fade-in-0 tangosdk:data-[state=closed]:zoom-out-95 tangosdk:data-[state=open]:zoom-in-95 tangosdk:fixed tangosdk:top-[50%] tangosdk:left-[50%] tangosdk:z-50 tangosdk:grid tangosdk:w-full tangosdk:max-w-[calc(100%-2rem)] tangosdk:translate-x-[-50%] tangosdk:translate-y-[-50%] tangosdk:gap-4 tangosdk:rounded-lg tangosdk:border tangosdk:p-6 tangosdk:shadow-lg tangosdk:duration-200 tangosdk:sm:max-w-lg',
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            className="tangosdk:ring-offset-background tangosdk:focus:ring-ring tangosdk:data-[state=open]:bg-accent tangosdk:data-[state=open]:text-muted-foreground tangosdk:absolute tangosdk:top-4 tangosdk:right-4 tangosdk:rounded-xs tangosdk:opacity-70 tangosdk:transition-opacity tangosdk:hover:opacity-100 tangosdk:focus:ring-2 tangosdk:focus:ring-offset-2 tangosdk:focus:outline-hidden tangosdk:disabled:pointer-events-none tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg]:shrink-0 tangosdk:[&_svg:not([class*=size-])]:size-4"
          >
            <XIcon />
            <span className="tangosdk:sr-only">Close</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        'tangosdk:flex tangosdk:flex-col tangosdk:gap-2 tangosdk:text-center tangosdk:sm:text-left',
        className
      )}
      {...props}
    />
  )
}

function DialogFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        'tangosdk:flex tangosdk:flex-col-reverse tangosdk:gap-2 tangosdk:sm:flex-row tangosdk:sm:justify-end',
        className
      )}
      {...props}
    />
  )
}

function DialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        'tangosdk:text-lg tangosdk:leading-none tangosdk:font-semibold',
        className
      )}
      {...props}
    />
  )
}

function DialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:text-sm',
        className
      )}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
}
