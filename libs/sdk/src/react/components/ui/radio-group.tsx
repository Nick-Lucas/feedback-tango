'use client'

import * as React from 'react'
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group'
import { CircleIcon } from 'lucide-react'

import { cn } from '@/src/react/lib/utils'

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn('tangosdk:grid tangosdk:gap-3', className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        'tangosdk:border-input tangosdk:text-primary tangosdk:focus-visible:border-ring tangosdk:focus-visible:ring-ring/50 tangosdk:aria-invalid:ring-destructive/20 tangosdk:dark:aria-invalid:ring-destructive/40 tangosdk:aria-invalid:border-destructive tangosdk:dark:bg-input/30 tangosdk:aspect-square tangosdk:size-4 tangosdk:shrink-0 tangosdk:rounded-full tangosdk:border tangosdk:shadow-xs tangosdk:transition-[color,box-shadow] tangosdk:outline-none tangosdk:focus-visible:ring-[3px] tangosdk:disabled:cursor-not-allowed tangosdk:disabled:opacity-50',
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="tangosdk:relative tangosdk:flex tangosdk:items-center tangosdk:justify-center"
      >
        <CircleIcon className="tangosdk:fill-primary tangosdk:absolute tangosdk:top-1/2 tangosdk:left-1/2 tangosdk:size-2 tangosdk:-translate-x-1/2 tangosdk:-translate-y-1/2" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
