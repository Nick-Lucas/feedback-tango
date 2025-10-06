import * as React from 'react'
import { OTPInput, OTPInputContext } from 'input-otp'
import { MinusIcon } from 'lucide-react'

import { cn } from '@/src/react/lib/utils'

function InputOTP({
  className,
  containerClassName,
  ...props
}: React.ComponentProps<typeof OTPInput> & {
  containerClassName?: string
}) {
  return (
    <OTPInput
      data-slot="input-otp"
      containerClassName={cn(
        'flex items-center gap-2 has-disabled:opacity-50',
        containerClassName
      )}
      className={cn('tangosdk:disabled:cursor-not-allowed', className)}
      {...props}
    />
  )
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="input-otp-group"
      className={cn('tangosdk:flex tangosdk:items-center', className)}
      {...props}
    />
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number
}) {
  const inputOTPContext = React.useContext(OTPInputContext)
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {}

  return (
    <div
      data-slot="input-otp-slot"
      data-active={isActive}
      className={cn(
        'tangosdk:data-[active=true]:border-ring tangosdk:data-[active=true]:ring-ring/50 tangosdk:data-[active=true]:aria-invalid:ring-destructive/20 tangosdk:dark:data-[active=true]:aria-invalid:ring-destructive/40 tangosdk:aria-invalid:border-destructive tangosdk:data-[active=true]:aria-invalid:border-destructive tangosdk:dark:bg-input/30 tangosdk:border-input tangosdk:relative tangosdk:flex tangosdk:h-9 tangosdk:w-9 tangosdk:items-center tangosdk:justify-center tangosdk:border-y tangosdk:border-r tangosdk:text-sm tangosdk:shadow-xs tangosdk:transition-all tangosdk:outline-none tangosdk:first:rounded-l-md tangosdk:first:border-l tangosdk:last:rounded-r-md tangosdk:data-[active=true]:z-10 tangosdk:data-[active=true]:ring-[3px]',
        className
      )}
      {...props}
    >
      {char}
      {hasFakeCaret && (
        <div className="tangosdk:pointer-events-none tangosdk:absolute tangosdk:inset-0 tangosdk:flex tangosdk:items-center tangosdk:justify-center">
          <div className="tangosdk:animate-caret-blink tangosdk:bg-foreground tangosdk:h-4 tangosdk:w-px tangosdk:duration-1000" />
        </div>
      )}
    </div>
  )
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return (
    <div data-slot="input-otp-separator" role="separator" {...props}>
      <MinusIcon />
    </div>
  )
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator }
