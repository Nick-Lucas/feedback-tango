import type * as React from 'react'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/src/react/lib/utils'

function Accordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn('tangosdk:border-b tangosdk:last:border-b-0', className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="tangosdk:flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          'tangosdk:focus-visible:border-ring tangosdk:focus-visible:ring-ring/50 tangosdk:flex tangosdk:flex-1 tangosdk:items-start tangosdk:justify-between tangosdk:gap-4 tangosdk:rounded-md tangosdk:py-4 tangosdk:text-left tangosdk:text-sm tangosdk:font-medium tangosdk:transition-all tangosdk:outline-none tangosdk:hover:underline tangosdk:focus-visible:ring-[3px] tangosdk:disabled:pointer-events-none tangosdk:disabled:opacity-50 tangosdk:[&[data-state=open]>svg]:rotate-180',
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="tangosdk:text-muted-foreground tangosdk:pointer-events-none tangosdk:size-4 tangosdk:shrink-0 tangosdk:translate-y-0.5 tangosdk:transition-transform tangosdk:duration-200" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="tangosdk:data-[state=closed]:animate-accordion-up tangosdk:data-[state=open]:animate-accordion-down tangosdk:overflow-hidden tangosdk:text-sm"
      {...props}
    >
      <div className={cn('tangosdk:pt-0 tangosdk:pb-4', className)}>
        {children}
      </div>
    </AccordionPrimitive.Content>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
