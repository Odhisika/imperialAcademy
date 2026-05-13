import { forwardRef } from 'react'
import { LucideProps } from 'lucide-react'
export const CediSign = forwardRef<SVGSVGElement, LucideProps>((props, ref) => (
    <svg
        ref={ref}
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M15 6a6 6 0 1 0 0 12" />
        <path d="M9 4v16" />
    </svg>
))

CediSign.displayName = 'CediSign'
