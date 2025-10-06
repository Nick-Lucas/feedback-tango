import { cn } from '@/src/react/lib/utils'

function Kbd({ className, ...props }: React.ComponentProps<'kbd'>) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        'tangosdk:bg-muted tangosdk:text-muted-foreground tangosdk:pointer-events-none tangosdk:inline-flex tangosdk:h-5 tangosdk:w-fit tangosdk:min-w-5 tangosdk:items-center tangosdk:justify-center tangosdk:gap-1 tangosdk:rounded-sm tangosdk:px-1 tangosdk:font-sans tangosdk:text-xs tangosdk:font-medium tangosdk:select-none',
        'tangosdk:[&_svg:not([class*=size-])]:size-3',
        'tangosdk:[[data-slot=tooltip-content]_&]:bg-background/20 tangosdk:[[data-slot=tooltip-content]_&]:text-background tangosdk:dark:[[data-slot=tooltip-content]_&]:bg-background/10',
        className
      )}
      {...props}
    />
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn(
        'tangosdk:inline-flex tangosdk:items-center tangosdk:gap-1',
        className
      )}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
