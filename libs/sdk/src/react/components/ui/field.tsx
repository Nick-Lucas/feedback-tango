import { useMemo } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/src/react/lib/utils'
import { Label } from '@/src/react/components/ui/label'
import { Separator } from '@/src/react/components/ui/separator'

function FieldSet({ className, ...props }: React.ComponentProps<'fieldset'>) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        'tangosdk:flex tangosdk:flex-col tangosdk:gap-6',
        'tangosdk:has-[>[data-slot=checkbox-group]]:gap-3 tangosdk:has-[>[data-slot=radio-group]]:gap-3',
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = 'legend',
  ...props
}: React.ComponentProps<'legend'> & { variant?: 'legend' | 'label' }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        'tangosdk:mb-3 tangosdk:font-medium',
        'tangosdk:data-[variant=legend]:text-base',
        'tangosdk:data-[variant=label]:text-sm',
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-group"
      className={cn(
        'tangosdk:group/field-group tangosdk:@container/field-group tangosdk:flex tangosdk:w-full tangosdk:flex-col tangosdk:gap-7 tangosdk:data-[slot=checkbox-group]:gap-3 tangosdk:[&>[data-slot=field-group]]:gap-4',
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva(
  'tangosdk:group/field tangosdk:flex tangosdk:w-full tangosdk:gap-3 tangosdk:data-[invalid=true]:text-destructive',
  {
    variants: {
      orientation: {
        vertical: ['flex-col [&>*]:w-full [&>.sr-only]:w-auto'],
        horizontal: [
          'flex-row items-center',
          '[&>[data-slot=field-label]]:flex-auto',
          'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        ],
        responsive: [
          'flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto',
          '@md/field-group:[&>[data-slot=field-label]]:flex-auto',
          '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
        ],
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  }
)

function Field({
  className,
  orientation = 'vertical',
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        'tangosdk:group/field-content tangosdk:flex tangosdk:flex-1 tangosdk:flex-col tangosdk:gap-1.5 tangosdk:leading-snug',
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        'tangosdk:group/field-label tangosdk:peer/field-label tangosdk:flex tangosdk:w-fit tangosdk:gap-2 tangosdk:leading-snug tangosdk:group-data-[disabled=true]/field:opacity-50',
        'tangosdk:has-[>[data-slot=field]]:w-full tangosdk:has-[>[data-slot=field]]:flex-col tangosdk:has-[>[data-slot=field]]:rounded-md tangosdk:has-[>[data-slot=field]]:border tangosdk:[&>*]:data-[slot=field]:p-4',
        'tangosdk:has-data-[state=checked]:bg-primary/5 tangosdk:has-data-[state=checked]:border-primary tangosdk:dark:has-data-[state=checked]:bg-primary/10',
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        'tangosdk:flex tangosdk:w-fit tangosdk:items-center tangosdk:gap-2 tangosdk:text-sm tangosdk:leading-snug tangosdk:font-medium tangosdk:group-data-[disabled=true]/field:opacity-50',
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        'tangosdk:text-muted-foreground tangosdk:text-sm tangosdk:leading-normal tangosdk:font-normal tangosdk:group-has-[[data-orientation=horizontal]]/field:text-balance',
        'tangosdk:last:mt-0 tangosdk:nth-last-2:-mt-1 tangosdk:[[data-variant=legend]+&]:-mt-1.5',
        'tangosdk:[&>a:hover]:text-primary tangosdk:[&>a]:underline tangosdk:[&>a]:underline-offset-4',
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        'tangosdk:relative tangosdk:-my-2 tangosdk:h-5 tangosdk:text-sm tangosdk:group-data-[variant=outline]/field-group:-mb-2',
        className
      )}
      {...props}
    >
      <Separator className="tangosdk:absolute tangosdk:inset-0 tangosdk:top-1/2" />
      {children && (
        <span
          className="tangosdk:bg-background tangosdk:text-muted-foreground tangosdk:relative tangosdk:mx-auto tangosdk:block tangosdk:w-fit tangosdk:px-2"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<'div'> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors) {
      return null
    }

    if (errors?.length === 1 && errors[0]?.message) {
      return errors[0].message
    }

    return (
      <ul className="tangosdk:ml-4 tangosdk:flex tangosdk:list-disc tangosdk:flex-col tangosdk:gap-1">
        {errors.map(
          (error, index) =>
            error?.message && <li key={index}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn(
        'tangosdk:text-destructive tangosdk:text-sm tangosdk:font-normal',
        className
      )}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldContent,
  FieldTitle,
}
