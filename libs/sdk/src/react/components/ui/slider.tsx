'use client'

import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/src/react/lib/utils'

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root>) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      className={cn(
        'tangosdk:relative tangosdk:flex tangosdk:w-full tangosdk:touch-none tangosdk:items-center tangosdk:select-none tangosdk:data-[disabled]:opacity-50 tangosdk:data-[orientation=vertical]:h-full tangosdk:data-[orientation=vertical]:min-h-44 tangosdk:data-[orientation=vertical]:w-auto tangosdk:data-[orientation=vertical]:flex-col',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'tangosdk:bg-muted tangosdk:relative tangosdk:grow tangosdk:overflow-hidden tangosdk:rounded-full tangosdk:data-[orientation=horizontal]:h-1.5 tangosdk:data-[orientation=horizontal]:w-full tangosdk:data-[orientation=vertical]:h-full tangosdk:data-[orientation=vertical]:w-1.5'
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'tangosdk:bg-primary tangosdk:absolute tangosdk:data-[orientation=horizontal]:h-full tangosdk:data-[orientation=vertical]:w-full'
          )}
        />
      </SliderPrimitive.Track>
      {Array.from({ length: _values.length }, (_, index) => (
        <SliderPrimitive.Thumb
          data-slot="slider-thumb"
          key={index}
          className="tangosdk:border-primary tangosdk:ring-ring/50 tangosdk:block tangosdk:size-4 tangosdk:shrink-0 tangosdk:rounded-full tangosdk:border tangosdk:bg-white tangosdk:shadow-sm tangosdk:transition-[color,box-shadow] tangosdk:hover:ring-4 tangosdk:focus-visible:ring-4 tangosdk:focus-visible:outline-hidden tangosdk:disabled:pointer-events-none tangosdk:disabled:opacity-50"
        />
      ))}
    </SliderPrimitive.Root>
  )
}

export { Slider }
