import * as React from "react"

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> { }

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
    ({ className = "", ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${className}`}
                role="status"
                {...props}
            >
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
                    Loading...
                </span>
            </div>
        )
    }
)
Spinner.displayName = "Spinner"

export { Spinner }
