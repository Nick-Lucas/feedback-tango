'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { PanelLeftIcon } from 'lucide-react'

import { useIsMobile } from '@/src/react/hooks/use-mobile'
import { cn } from '@/src/react/lib/utils'
import { Button } from '@/src/react/components/ui/button'
import { Input } from '@/src/react/components/ui/input'
import { Separator } from '@/src/react/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/src/react/components/ui/sheet'
import { Skeleton } from '@/src/react/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/src/react/components/ui/tooltip'

const SIDEBAR_COOKIE_NAME = 'sidebar_state'
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7
const SIDEBAR_WIDTH = '16rem'
const SIDEBAR_WIDTH_MOBILE = '18rem'
const SIDEBAR_WIDTH_ICON = '3rem'
const SIDEBAR_KEYBOARD_SHORTCUT = 'b'

type SidebarContextProps = {
  state: 'expanded' | 'collapsed'
  open: boolean
  setOpen: (open: boolean) => void
  openMobile: boolean
  setOpenMobile: (open: boolean) => void
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | null>(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.')
  }

  return context
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const isMobile = useIsMobile()
  const [openMobile, setOpenMobile] = React.useState(false)

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = React.useState(defaultOpen)
  const open = openProp ?? _open
  const setOpen = React.useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === 'function' ? value(open) : value
      if (setOpenProp) {
        setOpenProp(openState)
      } else {
        _setOpen(openState)
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`
    },
    [setOpenProp, open]
  )

  // Helper to toggle the sidebar.
  const toggleSidebar = React.useCallback(() => {
    return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open)
  }, [isMobile, setOpen, setOpenMobile])

  // Adds a keyboard shortcut to toggle the sidebar.
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
        (event.metaKey || event.ctrlKey)
      ) {
        event.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toggleSidebar])

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open ? 'expanded' : 'collapsed'

  const contextValue = React.useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
  )

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delayDuration={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH,
              '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            'tangosdk:group/sidebar-wrapper tangosdk:has-data-[variant=inset]:bg-sidebar tangosdk:flex tangosdk:min-h-svh tangosdk:w-full',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  )
}

function Sidebar({
  side = 'left',
  variant = 'sidebar',
  collapsible = 'offcanvas',
  className,
  children,
  ...props
}: React.ComponentProps<'div'> & {
  side?: 'left' | 'right'
  variant?: 'sidebar' | 'floating' | 'inset'
  collapsible?: 'offcanvas' | 'icon' | 'none'
}) {
  const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

  if (collapsible === 'none') {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          'tangosdk:bg-sidebar tangosdk:text-sidebar-foreground tangosdk:flex tangosdk:h-full tangosdk:w-(--sidebar-width) tangosdk:flex-col',
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }

  if (isMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-mobile="true"
          className="tangosdk:bg-sidebar tangosdk:text-sidebar-foreground tangosdk:w-(--sidebar-width) tangosdk:p-0 tangosdk:[&>button]:hidden"
          style={
            {
              '--sidebar-width': SIDEBAR_WIDTH_MOBILE,
            } as React.CSSProperties
          }
          side={side}
        >
          <SheetHeader className="tangosdk:sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar.</SheetDescription>
          </SheetHeader>
          <div className="tangosdk:flex tangosdk:h-full tangosdk:w-full tangosdk:flex-col">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div
      className="tangosdk:group tangosdk:peer tangosdk:text-sidebar-foreground tangosdk:hidden tangosdk:md:block"
      data-state={state}
      data-collapsible={state === 'collapsed' ? collapsible : ''}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          'tangosdk:relative tangosdk:w-(--sidebar-width) tangosdk:bg-transparent tangosdk:transition-[width] tangosdk:duration-200 tangosdk:ease-linear',
          'tangosdk:group-data-[collapsible=offcanvas]:w-0',
          'tangosdk:group-data-[side=right]:rotate-180',
          variant === 'floating' || variant === 'inset'
            ? 'tangosdk:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]'
            : 'tangosdk:group-data-[collapsible=icon]:w-(--sidebar-width-icon)'
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          'tangosdk:fixed tangosdk:inset-y-0 tangosdk:z-10 tangosdk:hidden tangosdk:h-svh tangosdk:w-(--sidebar-width) tangosdk:transition-[left,right,width] tangosdk:duration-200 tangosdk:ease-linear tangosdk:md:flex',
          side === 'left'
            ? 'tangosdk:left-0 tangosdk:group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]'
            : 'tangosdk:right-0 tangosdk:group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]',
          // Adjust the padding for floating and inset variants.
          variant === 'floating' || variant === 'inset'
            ? 'tangosdk:p-2 tangosdk:group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]'
            : 'tangosdk:group-data-[collapsible=icon]:w-(--sidebar-width-icon) tangosdk:group-data-[side=left]:border-r tangosdk:group-data-[side=right]:border-l',
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className="tangosdk:bg-sidebar tangosdk:group-data-[variant=floating]:border-sidebar-border tangosdk:flex tangosdk:h-full tangosdk:w-full tangosdk:flex-col tangosdk:group-data-[variant=floating]:rounded-lg tangosdk:group-data-[variant=floating]:border tangosdk:group-data-[variant=floating]:shadow-sm"
        >
          {children}
        </div>
      </div>
    </div>
  )
}

function SidebarTrigger({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar()

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn('tangosdk:size-7', className)}
      onClick={(event) => {
        onClick?.(event)
        toggleSidebar()
      }}
      {...props}
    >
      <PanelLeftIcon />
      <span className="tangosdk:sr-only">Toggle Sidebar</span>
    </Button>
  )
}

function SidebarRail({ className, ...props }: React.ComponentProps<'button'>) {
  const { toggleSidebar } = useSidebar()

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        'tangosdk:hover:after:bg-sidebar-border tangosdk:absolute tangosdk:inset-y-0 tangosdk:z-20 tangosdk:hidden tangosdk:w-4 tangosdk:-translate-x-1/2 tangosdk:transition-all tangosdk:ease-linear tangosdk:group-data-[side=left]:-right-4 tangosdk:group-data-[side=right]:left-0 tangosdk:after:absolute tangosdk:after:inset-y-0 tangosdk:after:left-1/2 tangosdk:after:w-[2px] tangosdk:sm:flex',
        'tangosdk:in-data-[side=left]:cursor-w-resize tangosdk:in-data-[side=right]:cursor-e-resize',
        'tangosdk:[[data-side=left][data-state=collapsed]_&]:cursor-e-resize tangosdk:[[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'tangosdk:hover:group-data-[collapsible=offcanvas]:bg-sidebar tangosdk:group-data-[collapsible=offcanvas]:translate-x-0 tangosdk:group-data-[collapsible=offcanvas]:after:left-full',
        'tangosdk:[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        'tangosdk:[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className
      )}
      {...props}
    />
  )
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        'tangosdk:bg-background tangosdk:relative tangosdk:flex tangosdk:w-full tangosdk:flex-1 tangosdk:flex-col',
        'tangosdk:md:peer-data-[variant=inset]:m-2 tangosdk:md:peer-data-[variant=inset]:ml-0 tangosdk:md:peer-data-[variant=inset]:rounded-xl tangosdk:md:peer-data-[variant=inset]:shadow-sm tangosdk:md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2',
        className
      )}
      {...props}
    />
  )
}

function SidebarInput({
  className,
  ...props
}: React.ComponentProps<typeof Input>) {
  return (
    <Input
      data-slot="sidebar-input"
      data-sidebar="input"
      className={cn(
        'tangosdk:bg-background tangosdk:h-8 tangosdk:w-full tangosdk:shadow-none',
        className
      )}
      {...props}
    />
  )
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn(
        'tangosdk:flex tangosdk:flex-col tangosdk:gap-2 tangosdk:p-2',
        className
      )}
      {...props}
    />
  )
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn(
        'tangosdk:flex tangosdk:flex-col tangosdk:gap-2 tangosdk:p-2',
        className
      )}
      {...props}
    />
  )
}

function SidebarSeparator({
  className,
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn(
        'tangosdk:bg-sidebar-border tangosdk:mx-2 tangosdk:w-auto',
        className
      )}
      {...props}
    />
  )
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        'tangosdk:flex tangosdk:min-h-0 tangosdk:flex-1 tangosdk:flex-col tangosdk:gap-2 tangosdk:overflow-auto tangosdk:group-data-[collapsible=icon]:overflow-hidden',
        className
      )}
      {...props}
    />
  )
}

function SidebarGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn(
        'tangosdk:relative tangosdk:flex tangosdk:w-full tangosdk:min-w-0 tangosdk:flex-col tangosdk:p-2',
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'div'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'div'

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        'tangosdk:text-sidebar-foreground/70 tangosdk:ring-sidebar-ring tangosdk:flex tangosdk:h-8 tangosdk:shrink-0 tangosdk:items-center tangosdk:rounded-md tangosdk:px-2 tangosdk:text-xs tangosdk:font-medium tangosdk:outline-hidden tangosdk:transition-[margin,opacity] tangosdk:duration-200 tangosdk:ease-linear tangosdk:focus-visible:ring-2 tangosdk:[&>svg]:size-4 tangosdk:[&>svg]:shrink-0',
        'tangosdk:group-data-[collapsible=icon]:-mt-8 tangosdk:group-data-[collapsible=icon]:opacity-0',
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        'tangosdk:text-sidebar-foreground tangosdk:ring-sidebar-ring tangosdk:hover:bg-sidebar-accent tangosdk:hover:text-sidebar-accent-foreground tangosdk:absolute tangosdk:top-3.5 tangosdk:right-3 tangosdk:flex tangosdk:aspect-square tangosdk:w-5 tangosdk:items-center tangosdk:justify-center tangosdk:rounded-md tangosdk:p-0 tangosdk:outline-hidden tangosdk:transition-transform tangosdk:focus-visible:ring-2 tangosdk:[&>svg]:size-4 tangosdk:[&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'tangosdk:after:absolute tangosdk:after:-inset-2 tangosdk:md:after:hidden',
        'tangosdk:group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  )
}

function SidebarGroupContent({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn('tangosdk:w-full tangosdk:text-sm', className)}
      {...props}
    />
  )
}

function SidebarMenu({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn(
        'tangosdk:flex tangosdk:w-full tangosdk:min-w-0 tangosdk:flex-col tangosdk:gap-1',
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuItem({ className, ...props }: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn('tangosdk:group/menu-item tangosdk:relative', className)}
      {...props}
    />
  )
}

const sidebarMenuButtonVariants = cva(
  'tangosdk:peer/menu-button tangosdk:flex tangosdk:w-full tangosdk:items-center tangosdk:gap-2 tangosdk:overflow-hidden tangosdk:rounded-md tangosdk:p-2 tangosdk:text-left tangosdk:text-sm tangosdk:outline-hidden tangosdk:ring-sidebar-ring tangosdk:transition-[width,height,padding] tangosdk:hover:bg-sidebar-accent tangosdk:hover:text-sidebar-accent-foreground tangosdk:focus-visible:ring-2 tangosdk:active:bg-sidebar-accent tangosdk:active:text-sidebar-accent-foreground tangosdk:disabled:pointer-events-none tangosdk:disabled:opacity-50 tangosdk:group-has-data-[sidebar=menu-action]/menu-item:pr-8 tangosdk:aria-disabled:pointer-events-none tangosdk:aria-disabled:opacity-50 tangosdk:data-[active=true]:bg-sidebar-accent tangosdk:data-[active=true]:font-medium tangosdk:data-[active=true]:text-sidebar-accent-foreground tangosdk:data-[state=open]:hover:bg-sidebar-accent tangosdk:data-[state=open]:hover:text-sidebar-accent-foreground tangosdk:group-data-[collapsible=icon]:size-8! tangosdk:group-data-[collapsible=icon]:p-2! tangosdk:[&>span:last-child]:truncate tangosdk:[&>svg]:size-4 tangosdk:[&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'tangosdk:hover:bg-sidebar-accent tangosdk:hover:text-sidebar-accent-foreground',
        outline:
          'tangosdk:bg-background tangosdk:shadow-[0_0_0_1px_hsl(var(--sidebar-border))] tangosdk:hover:bg-sidebar-accent tangosdk:hover:text-sidebar-accent-foreground tangosdk:hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
      },
      size: {
        default: 'tangosdk:h-8 tangosdk:text-sm',
        sm: 'tangosdk:h-7 tangosdk:text-xs',
        lg: 'tangosdk:h-12 tangosdk:text-sm tangosdk:group-data-[collapsible=icon]:p-0!',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = 'default',
  size = 'default',
  tooltip,
  className,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean
  isActive?: boolean
  tooltip?: string | React.ComponentProps<typeof TooltipContent>
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : 'button'
  const { isMobile, state } = useSidebar()

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
      {...props}
    />
  )

  if (!tooltip) {
    return button
  }

  if (typeof tooltip === 'string') {
    tooltip = {
      children: tooltip,
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent
        side="right"
        align="center"
        hidden={state !== 'collapsed' || isMobile}
        {...tooltip}
      />
    </Tooltip>
  )
}

function SidebarMenuAction({
  className,
  asChild = false,
  showOnHover = false,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean
  showOnHover?: boolean
}) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="sidebar-menu-action"
      data-sidebar="menu-action"
      className={cn(
        'tangosdk:text-sidebar-foreground tangosdk:ring-sidebar-ring tangosdk:hover:bg-sidebar-accent tangosdk:hover:text-sidebar-accent-foreground tangosdk:peer-hover/menu-button:text-sidebar-accent-foreground tangosdk:absolute tangosdk:top-1.5 tangosdk:right-1 tangosdk:flex tangosdk:aspect-square tangosdk:w-5 tangosdk:items-center tangosdk:justify-center tangosdk:rounded-md tangosdk:p-0 tangosdk:outline-hidden tangosdk:transition-transform tangosdk:focus-visible:ring-2 tangosdk:[&>svg]:size-4 tangosdk:[&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'tangosdk:after:absolute tangosdk:after:-inset-2 tangosdk:md:after:hidden',
        'tangosdk:peer-data-[size=sm]/menu-button:top-1',
        'tangosdk:peer-data-[size=default]/menu-button:top-1.5',
        'tangosdk:peer-data-[size=lg]/menu-button:top-2.5',
        'tangosdk:group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'tangosdk:peer-data-[active=true]/menu-button:text-sidebar-accent-foreground tangosdk:group-focus-within/menu-item:opacity-100 tangosdk:group-hover/menu-item:opacity-100 tangosdk:data-[state=open]:opacity-100 tangosdk:md:opacity-0',
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuBadge({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="sidebar-menu-badge"
      data-sidebar="menu-badge"
      className={cn(
        'tangosdk:text-sidebar-foreground tangosdk:pointer-events-none tangosdk:absolute tangosdk:right-1 tangosdk:flex tangosdk:h-5 tangosdk:min-w-5 tangosdk:items-center tangosdk:justify-center tangosdk:rounded-md tangosdk:px-1 tangosdk:text-xs tangosdk:font-medium tangosdk:tabular-nums tangosdk:select-none',
        'tangosdk:peer-hover/menu-button:text-sidebar-accent-foreground tangosdk:peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
        'tangosdk:peer-data-[size=sm]/menu-button:top-1',
        'tangosdk:peer-data-[size=default]/menu-button:top-1.5',
        'tangosdk:peer-data-[size=lg]/menu-button:top-2.5',
        'tangosdk:group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: React.ComponentProps<'div'> & {
  showIcon?: boolean
}) {
  // Random width between 50 to 90%.
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn(
        'tangosdk:flex tangosdk:h-8 tangosdk:items-center tangosdk:gap-2 tangosdk:rounded-md tangosdk:px-2',
        className
      )}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className="tangosdk:size-4 tangosdk:rounded-md"
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Skeleton
        className="tangosdk:h-4 tangosdk:max-w-(--skeleton-width) tangosdk:flex-1"
        data-sidebar="menu-skeleton-text"
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  )
}

function SidebarMenuSub({ className, ...props }: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        'tangosdk:border-sidebar-border tangosdk:mx-3.5 tangosdk:flex tangosdk:min-w-0 tangosdk:translate-x-px tangosdk:flex-col tangosdk:gap-1 tangosdk:border-l tangosdk:px-2.5 tangosdk:py-0.5',
        'tangosdk:group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSubItem({
  className,
  ...props
}: React.ComponentProps<'li'>) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn(
        'tangosdk:group/menu-sub-item tangosdk:relative',
        className
      )}
      {...props}
    />
  )
}

function SidebarMenuSubButton({
  asChild = false,
  size = 'md',
  isActive = false,
  className,
  ...props
}: React.ComponentProps<'a'> & {
  asChild?: boolean
  size?: 'sm' | 'md'
  isActive?: boolean
}) {
  const Comp = asChild ? Slot : 'a'

  return (
    <Comp
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-size={size}
      data-active={isActive}
      className={cn(
        'tangosdk:text-sidebar-foreground tangosdk:ring-sidebar-ring tangosdk:hover:bg-sidebar-accent tangosdk:hover:text-sidebar-accent-foreground tangosdk:active:bg-sidebar-accent tangosdk:active:text-sidebar-accent-foreground tangosdk:[&>svg]:text-sidebar-accent-foreground tangosdk:flex tangosdk:h-7 tangosdk:min-w-0 tangosdk:-translate-x-px tangosdk:items-center tangosdk:gap-2 tangosdk:overflow-hidden tangosdk:rounded-md tangosdk:px-2 tangosdk:outline-hidden tangosdk:focus-visible:ring-2 tangosdk:disabled:pointer-events-none tangosdk:disabled:opacity-50 tangosdk:aria-disabled:pointer-events-none tangosdk:aria-disabled:opacity-50 tangosdk:[&>span:last-child]:truncate tangosdk:[&>svg]:size-4 tangosdk:[&>svg]:shrink-0',
        'tangosdk:data-[active=true]:bg-sidebar-accent tangosdk:data-[active=true]:text-sidebar-accent-foreground',
        size === 'sm' && 'tangosdk:text-xs',
        size === 'md' && 'tangosdk:text-sm',
        'tangosdk:group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  )
}

export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
