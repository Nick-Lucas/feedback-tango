import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/src/react/lib/utils'
import { Separator } from '@/src/react/components/ui/separator'

const buttonGroupVariants = cva(
  'tangosdk:flex tangosdk:w-fit tangosdk:items-stretch tangosdk:[&>*]:focus-visible:z-10 tangosdk:[&>*]:focus-visible:relative tangosdk:[&>[data-slot=select-trigger]:not([class*=w-])]:w-fit tangosdk:[&>input]:flex-1 tangosdk:has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md tangosdk:has-[>[data-slot=button-group]]:gap-2',
  {
    variants: {
      orientation: {
        horizontal:
          'tangosdk:[&>*:not(:first-child)]:rounded-l-none tangosdk:[&>*:not(:first-child)]:border-l-0 tangosdk:[&>*:not(:last-child)]:rounded-r-none',
        vertical:
          'tangosdk:flex-col tangosdk:[&>*:not(:first-child)]:rounded-t-none tangosdk:[&>*:not(:first-child)]:border-t-0 tangosdk:[&>*:not(:last-child)]:rounded-b-none',
      },
    },
    defaultVariants: {
      orientation: 'horizontal',
    },
  }
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      className={cn(
        'tangosdk:bg-muted tangosdk:flex tangosdk:items-center tangosdk:gap-2 tangosdk:rounded-md tangosdk:border tangosdk:px-4 tangosdk:text-sm tangosdk:font-medium tangosdk:shadow-xs tangosdk:[&_svg]:pointer-events-none tangosdk:[&_svg:not([class*=size-])]:size-4',
        className
      )}
      {...props}
    />
  )
}

function ButtonGroupSeparator({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        'tangosdk:bg-input tangosdk:relative tangosdk:!m-0 tangosdk:self-stretch tangosdk:data-[orientation=vertical]:h-auto',
        className
      )}
      {...props}
    />
  )
}

export {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
  buttonGroupVariants,
}
