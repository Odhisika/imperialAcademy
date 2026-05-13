"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

const DropdownMenuContext = React.createContext<{
    open: boolean
    setOpen: (open: boolean) => void
} | undefined>(undefined)

const DropdownMenu = ({ children }: { children: React.ReactNode }) => {
    const [open, setOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false)
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [open])

    return (
        <DropdownMenuContext.Provider value={{ open, setOpen }}>
            <div className="relative inline-block text-left" ref={containerRef}>
                {children}
            </div>
        </DropdownMenuContext.Provider>
    )
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    asChild?: boolean
}

const DropdownMenuTrigger = React.forwardRef<
    HTMLButtonElement,
    DropdownMenuTriggerProps
>(({ className, children, asChild = false, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext)
    if (!context) throw new Error("DropdownMenuTrigger must be used within a DropdownMenu")
    
    const Comp = asChild ? Slot : "button"
    
    return (
        <Comp
            ref={ref}
            className={cn("outline-none", className)}
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                context.setOpen(!context.open)
            }}
            {...props}
        >
            {children}
        </Comp>
    )
})
DropdownMenuTrigger.displayName = "DropdownMenuTrigger"

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
    align?: 'start' | 'end' | 'center'
}

const DropdownMenuContent = React.forwardRef<
    HTMLDivElement,
    DropdownMenuContentProps
>(({ className, children, align = 'end', ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext)
    if (!context) throw new Error("DropdownMenuContent must be used within a DropdownMenu")
    
    if (!context.open) return null

    const alignClass = align === 'start' ? 'left-0' : align === 'center' ? 'left-1/2 -translate-x-1/2' : 'right-0'
    
    return (
        <div
            ref={ref}
            className={cn(
                "absolute mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-zinc-900 ring-1 ring-black/5 dark:ring-white/10 z-[100]",
                "animate-in fade-in-80 slide-in-from-top-2 origin-top-right",
                alignClass,
                className
            )}
            onClick={() => context.setOpen(false)}
            {...props}
        >
            <div className="py-1" role="menu" aria-orientation="vertical">
                {children}
            </div>
        </div>
    )
})
DropdownMenuContent.displayName = "DropdownMenuContent"

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
    disabled?: boolean
}

const DropdownMenuItem = React.forwardRef<
    HTMLDivElement,
    DropdownMenuItemProps
>(({ className, children, disabled, onClick, ...props }, ref) => {
    const context = React.useContext(DropdownMenuContext)
    
    return (
        <div
            ref={ref}
            className={cn(
                "flex items-center px-4 py-2 text-sm text-gray-700 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-800 hover:text-gray-900 dark:hover:text-zinc-100 cursor-pointer transition-colors",
                disabled && "opacity-40 pointer-events-none cursor-not-allowed",
                className
            )}
            role="menuitem"
            aria-disabled={disabled}
            onClick={(e) => {
                if (disabled) return
                onClick?.(e)
                context?.setOpen(false)
            }}
            {...props}
        >
            {children}
        </div>
    )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

const DropdownMenuSeparator = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("h-px my-1 bg-gray-200", className)}
            {...props}
        />
    )
})
DropdownMenuSeparator.displayName = "DropdownMenuSeparator"

const DropdownMenuLabel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn("px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider", className)}
            {...props}
        >
            {children}
        </div>
    )
})
DropdownMenuLabel.displayName = "DropdownMenuLabel"

export {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
}
