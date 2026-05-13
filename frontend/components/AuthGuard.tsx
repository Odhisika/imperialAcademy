'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    // Initialize from localStorage if possible to prevent flicker/blank screen
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('isAuthenticated') === 'true' ? true : null
        }
        return null
    })
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem('auth_token')

            if (!token) {
                setIsAuthenticated(false)
                // Also clear cookie if localStorage is empty
                document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                
                if (pathname !== '/admin/login') {
                    router.push('/admin/login')
                }
                return
            }

            try {
                const controller = new AbortController()
                const timeoutId = setTimeout(() => controller.abort(), 5000)

                const res = await fetch(`${API_BASE}/api/auth/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    signal: controller.signal
                })

                clearTimeout(timeoutId)

                if (res.ok) {
                    setIsAuthenticated(true)
                    localStorage.setItem('isAuthenticated', 'true')
                } else {
                    setIsAuthenticated(false)
                    localStorage.removeItem('isAuthenticated')
                    localStorage.removeItem('auth_token')
                    // Clear cookie for middleware too
                    document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
                    
                    if (pathname !== '/admin/login') {
                        router.push('/admin/login')
                    }
                }
            } catch (err) {
                console.error('Auth verification error:', err)
                // Don't set to false immediately on network error to prevent lockouts
                if (isAuthenticated === null) {
                    setIsAuthenticated(false)
                }
            }
        }

        verifyToken()
    }, [pathname, router])

    // Fallback redirect if SPA routing hangs
    useEffect(() => {
        if (isAuthenticated === false && pathname !== '/admin/login') {
            const timer = setTimeout(() => {
                window.location.href = '/admin/login?access=post-n0-bill'
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [isAuthenticated, pathname])

    if (isAuthenticated === null) {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 gap-4">
                <Loader2 className="h-8 w-8 text-[#00236F] animate-spin" />
                <p className="text-sm text-zinc-500 font-medium animate-pulse">Verifying Session...</p>
            </div>
        )
    }

    if (!isAuthenticated && pathname !== '/admin/login') {
        return (
            <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 gap-4">
                <Loader2 className="h-8 w-8 text-[#00236F] animate-spin" />
                <p className="text-sm text-zinc-500 font-medium">Redirecting to Login...</p>
                <button 
                    onClick={() => window.location.href = '/admin/login?access=post-n0-bill'}
                    className="text-xs text-zinc-400 hover:text-[#00236F] underline mt-4"
                >
                    Stuck? Click here to unlock login
                </button>
            </div>
        )
    }

    return <>{children}</>
}
