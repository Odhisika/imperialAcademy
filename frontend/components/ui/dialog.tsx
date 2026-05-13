"use client"

import * as React from "react"

interface DialogContextValue {
    open: boolean
    setOpen: (open: boolean) => void
}

const DialogContext = React.createContext<DialogContextValue | undefined>(undefined)

function useDialog() {
    const context = React.useContext(DialogContext)
    if (!context) {
        throw new Error("Dialog components must be used within a Dialog")
    }
    return context
}

interface DialogProps {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const Dialog = ({ children, open: controlledOpen, onOpenChange }: DialogProps) => {
    const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false)

    const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
    const setOpen = onOpenChange || setUncontrolledOpen

    return (
        <DialogContext.Provider value={{ open, setOpen }}>
            {children}
        </DialogContext.Provider>
    )
}

interface DialogTriggerProps {
    children: React.ReactNode
    asChild?: boolean
}

const DialogTrigger = ({ children, asChild }: DialogTriggerProps) => {
    const { setOpen } = useDialog()

    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            onClick: (e: React.MouseEvent) => {
                setOpen(true)
                const childProps = children.props as any
                if (childProps.onClick) {
                    childProps.onClick(e)
                }
            },
        } as any)
    }

    return (
        <button onClick={() => setOpen(true)}>
            {children}
        </button>
    )
}

interface DialogContentProps {
    children: React.ReactNode
    className?: string
}

const DialogContent = ({ children, className = "" }: DialogContentProps) => {
    const { open, setOpen } = useDialog()

    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50"
                onClick={() => setOpen(false)}
            />

            {/* Content */}
            <div
                className={`relative z-50 w-full max-h-[90vh] overflow-y-auto bg-background rounded-lg shadow-lg p-6 ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}

interface DialogHeaderProps {
    children: React.ReactNode
    className?: string
}

const DialogHeader = ({ children, className = "" }: DialogHeaderProps) => {
    return (
        <div className={`flex flex-col space-y-1.5 text-center sm:text-left mb-4 ${className}`}>
            {children}
        </div>
    )
}

interface DialogTitleProps {
    children: React.ReactNode
    className?: string
}

const DialogTitle = ({ children, className = "" }: DialogTitleProps) => {
    return (
        <h2 className={`text-lg font-semibold leading-none tracking-tight ${className}`}>
            {children}
        </h2>
    )
}

interface DialogDescriptionProps {
    children: React.ReactNode
    className?: string
}

const DialogDescription = ({ children, className = "" }: DialogDescriptionProps) => {
    return (
        <p className={`text-sm text-muted-foreground ${className}`}>
            {children}
        </p>
    )
}

interface DialogFooterProps {
    children: React.ReactNode
    className?: string
}

const DialogFooter = ({ children, className = "" }: DialogFooterProps) => {
    return (
        <div className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}>
            {children}
        </div>
    )
}

export {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
}
