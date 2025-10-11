'use client'

import * as React from 'react'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from 'lucide-react'
import type { DayButton } from 'react-day-picker'
import { DayPicker, getDefaultClassNames } from 'react-day-picker'

import { cn } from '@/src/react/lib/utils'
import { Button, buttonVariants } from '@/src/react/components/ui/button'

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = 'label',
  buttonVariant = 'ghost',
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>['variant']
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        'tangosdk:bg-background tangosdk:group/calendar tangosdk:p-3 tangosdk:[--cell-size:--spacing(8)] tangosdk:[[data-slot=card-content]_&]:bg-transparent tangosdk:[[data-slot=popover-content]_&]:bg-transparent',
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString('default', { month: 'short' }),
        ...formatters,
      }}
      classNames={{
        root: cn('tangosdk:w-fit', defaultClassNames.root),
        months: cn(
          'tangosdk:flex tangosdk:gap-4 tangosdk:flex-col tangosdk:md:flex-row tangosdk:relative',
          defaultClassNames.months
        ),
        month: cn(
          'tangosdk:flex tangosdk:flex-col tangosdk:w-full tangosdk:gap-4',
          defaultClassNames.month
        ),
        nav: cn(
          'tangosdk:flex tangosdk:items-center tangosdk:gap-1 tangosdk:w-full tangosdk:absolute tangosdk:top-0 tangosdk:inset-x-0 tangosdk:justify-between',
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          'tangosdk:size-(--cell-size) tangosdk:aria-disabled:opacity-50 tangosdk:p-0 tangosdk:select-none',
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          'tangosdk:size-(--cell-size) tangosdk:aria-disabled:opacity-50 tangosdk:p-0 tangosdk:select-none',
          defaultClassNames.button_next
        ),
        month_caption: cn(
          'tangosdk:flex tangosdk:items-center tangosdk:justify-center tangosdk:h-(--cell-size) tangosdk:w-full tangosdk:px-(--cell-size)',
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          'tangosdk:w-full tangosdk:flex tangosdk:items-center tangosdk:text-sm tangosdk:font-medium tangosdk:justify-center tangosdk:h-(--cell-size) tangosdk:gap-1.5',
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          'tangosdk:relative tangosdk:has-focus:border-ring tangosdk:border tangosdk:border-input tangosdk:shadow-xs tangosdk:has-focus:ring-ring/50 tangosdk:has-focus:ring-[3px] tangosdk:rounded-md',
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          'tangosdk:absolute tangosdk:bg-popover tangosdk:inset-0 tangosdk:opacity-0',
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          'tangosdk:select-none tangosdk:font-medium',
          captionLayout === 'label'
            ? 'tangosdk:text-sm'
            : 'tangosdk:rounded-md tangosdk:pl-2 tangosdk:pr-1 tangosdk:flex tangosdk:items-center tangosdk:gap-1 tangosdk:text-sm tangosdk:h-8 tangosdk:[&>svg]:text-muted-foreground tangosdk:[&>svg]:size-3.5',
          defaultClassNames.caption_label
        ),
        table: 'tangosdk:w-full tangosdk:border-collapse',
        weekdays: cn('tangosdk:flex', defaultClassNames.weekdays),
        weekday: cn(
          'tangosdk:text-muted-foreground tangosdk:rounded-md tangosdk:flex-1 tangosdk:font-normal tangosdk:text-[0.8rem] tangosdk:select-none',
          defaultClassNames.weekday
        ),
        week: cn(
          'tangosdk:flex tangosdk:w-full tangosdk:mt-2',
          defaultClassNames.week
        ),
        week_number_header: cn(
          'tangosdk:select-none tangosdk:w-(--cell-size)',
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          'tangosdk:text-[0.8rem] tangosdk:select-none tangosdk:text-muted-foreground',
          defaultClassNames.week_number
        ),
        day: cn(
          'tangosdk:relative tangosdk:w-full tangosdk:h-full tangosdk:p-0 tangosdk:text-center tangosdk:[&:first-child[data-selected=true]_button]:rounded-l-md tangosdk:[&:last-child[data-selected=true]_button]:rounded-r-md tangosdk:group/day tangosdk:aspect-square tangosdk:select-none',
          defaultClassNames.day
        ),
        range_start: cn(
          'tangosdk:rounded-l-md tangosdk:bg-accent',
          defaultClassNames.range_start
        ),
        range_middle: cn(
          'tangosdk:rounded-none',
          defaultClassNames.range_middle
        ),
        range_end: cn(
          'tangosdk:rounded-r-md tangosdk:bg-accent',
          defaultClassNames.range_end
        ),
        today: cn(
          'tangosdk:bg-accent tangosdk:text-accent-foreground tangosdk:rounded-md tangosdk:data-[selected=true]:rounded-none',
          defaultClassNames.today
        ),
        outside: cn(
          'tangosdk:text-muted-foreground tangosdk:aria-selected:text-muted-foreground',
          defaultClassNames.outside
        ),
        disabled: cn(
          'tangosdk:text-muted-foreground tangosdk:opacity-50',
          defaultClassNames.disabled
        ),
        hidden: cn('tangosdk:invisible', defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (
            <div
              data-slot="calendar"
              ref={rootRef}
              className={cn(className)}
              {...props}
            />
          )
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === 'left') {
            return (
              <ChevronLeftIcon
                className={cn('tangosdk:size-4', className)}
                {...props}
              />
            )
          }

          if (orientation === 'right') {
            return (
              <ChevronRightIcon
                className={cn('tangosdk:size-4', className)}
                {...props}
              />
            )
          }

          return (
            <ChevronDownIcon
              className={cn('tangosdk:size-4', className)}
              {...props}
            />
          )
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="tangosdk:flex tangosdk:size-(--cell-size) tangosdk:items-center tangosdk:justify-center tangosdk:text-center">
                {children}
              </div>
            </td>
          )
        },
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: React.ComponentProps<typeof DayButton>) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        'tangosdk:data-[selected-single=true]:bg-primary tangosdk:data-[selected-single=true]:text-primary-foreground tangosdk:data-[range-middle=true]:bg-accent tangosdk:data-[range-middle=true]:text-accent-foreground tangosdk:data-[range-start=true]:bg-primary tangosdk:data-[range-start=true]:text-primary-foreground tangosdk:data-[range-end=true]:bg-primary tangosdk:data-[range-end=true]:text-primary-foreground tangosdk:group-data-[focused=true]/day:border-ring tangosdk:group-data-[focused=true]/day:ring-ring/50 tangosdk:dark:hover:text-accent-foreground tangosdk:flex tangosdk:aspect-square tangosdk:size-auto tangosdk:w-full tangosdk:min-w-(--cell-size) tangosdk:flex-col tangosdk:gap-1 tangosdk:leading-none tangosdk:font-normal tangosdk:group-data-[focused=true]/day:relative tangosdk:group-data-[focused=true]/day:z-10 tangosdk:group-data-[focused=true]/day:ring-[3px] tangosdk:data-[range-end=true]:rounded-md tangosdk:data-[range-end=true]:rounded-r-md tangosdk:data-[range-middle=true]:rounded-none tangosdk:data-[range-start=true]:rounded-md tangosdk:data-[range-start=true]:rounded-l-md tangosdk:[&>span]:text-xs tangosdk:[&>span]:opacity-70',
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
