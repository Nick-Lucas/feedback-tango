'use client'

import type * as React from 'react'
import * as SeparatorPrimitive from '@radix-ui/react-separator'

import { cn } from '@/src/react/lib/utils'

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'tangosdk:bg-border tangosdk:shrink-0 tangosdk:data-[orientation=horizontal]:h-px tangosdk:data-[orientation=horizontal]:w-full tangosdk:data-[orientation=vertical]:h-full tangosdk:data-[orientation=vertical]:w-px',
        className
      )}
      {...props}
    />
  )
}

export { Separator }
