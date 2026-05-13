import * as React from "react"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    asChild?: boolean
}

export const buttonVariants = ({
    className = "",
    variant = 'default',
    size = 'default'
}: Partial<ButtonProps> = {}) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"

    const variantStyles = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 hover:bg-gray-100",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
        ghost: "hover:bg-gray-100",
        link: "underline-offset-4 hover:underline text-primary",
    }

    const sizeStyles = {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 text-xs",
        lg: "h-11 px-8",
        icon: "h-10 w-10",
    }

    // fallback to default if variant/size is invalid (though TS should prevent this)
    const v = variantStyles[variant as keyof typeof variantStyles] || variantStyles.default
    const s = sizeStyles[size as keyof typeof sizeStyles] || sizeStyles.default

    return `${baseStyles} ${v} ${s} ${className}`.trim()
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? 'span' : 'button'

        if (asChild) {
            return (
                <span className={buttonVariants({ variant, size, className })}>
                    {props.children}
                </span>
            )
        }

        return (
            <button
                className={buttonVariants({ variant, size, className })}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
