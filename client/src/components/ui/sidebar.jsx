import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_MOBILE = "18rem"
const SIDEBAR_WIDTH_ICON = "3rem"

const SidebarContext = React.createContext(null)

function useSidebar() {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider.")
  }
  return context
}

const SidebarProvider = React.forwardRef(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile()
    const [openMobile, setOpenMobile] = React.useState(false)
    const [_open, _setOpen] = React.useState(defaultOpen)

    const open = openProp ?? _open

    const setOpen = React.useCallback(
      (value) => {
        const next =
          typeof value === "function" ? value(open) : value
        onOpenChange ? onOpenChange(next) : _setOpen(next)
        document.cookie = `sidebar:state=${next}; path=/; max-age=${
          60 * 60 * 24 * 7
        }`
      },
      [open, onOpenChange]
    )

    const toggleSidebar = React.useCallback(() => {
      isMobile
        ? setOpenMobile((v) => !v)
        : setOpen((v) => !v)
    }, [isMobile, setOpen])

    React.useEffect(() => {
      const handler = (e) => {
        if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault()
          toggleSidebar()
        }
      }
      window.addEventListener("keydown", handler)
      return () => window.removeEventListener("keydown", handler)
    }, [toggleSidebar])

    const value = {
      state: open ? "expanded" : "collapsed",
      open,
      setOpen,
      isMobile,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }

    return (
      <SidebarContext.Provider value={value}>
        <TooltipProvider delayDuration={0}>
          <div
            ref={ref}
            style={{
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              ...style,
            }}
            className={cn(
              "group/sidebar-wrapper flex min-h-svh w-full",
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
)
SidebarProvider.displayName = "SidebarProvider"

const Sidebar = React.forwardRef(
  (
    {
      side = "left",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, state, openMobile, setOpenMobile } =
      useSidebar()

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side={side}
            className="w-[--sidebar-width] bg-sidebar p-0"
            style={{ "--sidebar-width": SIDEBAR_WIDTH_MOBILE }}
          >
            {children}
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <div
        ref={ref}
        data-state={state}
        className={cn(
          "hidden md:block w-[--sidebar-width] bg-sidebar text-sidebar-foreground",
          state === "collapsed" &&
            collapsible === "icon" &&
            "w-[--sidebar-width-icon]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef(
  ({ className, ...props }, ref) => {
    const { toggleSidebar } = useSidebar()

    return (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        className={cn("h-7 w-7", className)}
        onClick={toggleSidebar}
        {...props}
      >
        <PanelLeft />
      </Button>
    )
  }
)
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-1 flex-col gap-2 overflow-auto p-2",
        className
      )}
      {...props}
    />
  )
)
SidebarContent.displayName = "SidebarContent"

const SidebarHeader = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-2 flex flex-col gap-2", className)}
      {...props}
    />
  )
)
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-2 flex flex-col gap-2", className)}
      {...props}
    />
  )
)
SidebarFooter.displayName = "SidebarFooter"

const SidebarInput = React.forwardRef(
  ({ className, ...props }, ref) => (
    <Input
      ref={ref}
      className={cn("h-8", className)}
      {...props}
    />
  )
)
SidebarInput.displayName = "SidebarInput"

const SidebarSeparator = React.forwardRef(
  ({ className, ...props }, ref) => (
    <Separator
      ref={ref}
      className={cn("mx-2", className)}
      {...props}
    />
  )
)
SidebarSeparator.displayName = "SidebarSeparator"

export {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInput,
  SidebarSeparator,
  useSidebar,
}
