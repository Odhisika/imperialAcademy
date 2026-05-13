"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const AccordionContext = React.createContext<{ value?: string; onValueChange?: (value: string) => void }>({})
const AccordionItemContext = React.createContext<{ value?: string }>({})

const Accordion = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { type?: "single" | "multiple"; collapsible?: boolean; defaultValue?: string; value?: string; onValueChange?: (value: string) => void }
>(({ className, type = "single", collapsible, defaultValue, value: controlledValue, onValueChange, ...props }, ref) => {
    const [value, setValue] = React.useState<string | undefined>(defaultValue)

    const handleValueChange = (newValue: string) => {
        if (controlledValue !== undefined) {
            onValueChange?.(newValue)
        } else {
            setValue(prev => (prev === newValue && collapsible ? "" : newValue))
        }
    }

    const currentValue = controlledValue !== undefined ? controlledValue : value

    return (
        <AccordionContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
            <div ref={ref} className={className} {...props} />
        </AccordionContext.Provider>
    )
})
Accordion.displayName = "Accordion"

const AccordionItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => (
    <AccordionItemContext.Provider value={{ value }}>
        <div ref={ref} className={cn("border-b", className)} {...props} />
    </AccordionItemContext.Provider>
))
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = React.useContext(AccordionContext)
    const { value: itemValue } = React.useContext(AccordionItemContext)
    const isOpen = selectedValue === itemValue

    return (
        <h3 className="flex">
            <button
                ref={ref}
                onClick={() => onValueChange?.(itemValue || "")}
                className={cn(
                    "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
                    className
                )}
                data-state={isOpen ? "open" : "closed"}
                type="button"
                {...props}
            >
                {children}
                <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
        </h3>
    )
})
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
    const { value: selectedValue } = React.useContext(AccordionContext)
    const { value: itemValue } = React.useContext(AccordionItemContext)
    const isOpen = selectedValue === itemValue

    if (!isOpen) return null

    return (
        <div
            ref={ref}
            className={cn("overflow-hidden text-sm transition-all animate-accordion-down", className)}
            data-state={isOpen ? "open" : "closed"}
            {...props}
        >
            <div className="pb-4 pt-0">{children}</div>
        </div>
    )
})
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
