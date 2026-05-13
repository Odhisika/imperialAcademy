"use client"

import * as React from "react"

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
    ({ className = "", value = 0, ...props }, ref) => {
        const clampedValue = Math.min(Math.max(value, 0), 100)

        return (
            <div
                ref={ref}
                className={`relative h-4 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800 ${className}`}
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={clampedValue}
                {...props}
            >
                <div
                    className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-in-out"
                    style={{ width: `${clampedValue}%` }}
                />
            </div>
        )
    }
)
Progress.displayName = "Progress"

export { Progress }
