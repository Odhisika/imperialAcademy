'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

function ProgressBarContent() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Start loading on path or search param change
    setLoading(true)
    setProgress(30)

    const timer = setTimeout(() => {
      setProgress(70)
    }, 150)

    const completeTimer = setTimeout(() => {
      setProgress(100)
      setTimeout(() => {
        setLoading(false)
        setProgress(0)
      }, 150)
    }, 300)

    return () => {
      clearTimeout(timer)
      clearTimeout(completeTimer)
    }
  }, [pathname, searchParams])

  if (!loading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 w-full bg-transparent pointer-events-none">
      <div 
        className="h-full bg-[#FEA619] transition-all duration-300 ease-out shadow-[0_0_10px_#FEA619]"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

export default function ProgressBar() {
    return (
        <Suspense fallback={null}>
            <ProgressBarContent />
        </Suspense>
    )
}
