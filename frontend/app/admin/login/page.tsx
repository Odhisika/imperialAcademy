'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Mail, ArrowRight, EyeOff, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ThemeToggle } from '@/components/theme-toggle'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminLogin() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Login failed')
            }

            localStorage.setItem('isAuthenticated', 'true')
            localStorage.setItem('auth_token', data.token)
            localStorage.setItem('userEmail', data.user.email)
            localStorage.setItem('userName', data.user.fullName)
            
            // Set cookie for Middleware to access
            const isProd = process.env.NODE_ENV === 'production';
            const cookieBase = `; path=/; max-age=604800; samesite=lax${isProd ? '; secure' : ''}`;
            
            document.cookie = `auth_token=${data.token}${cookieBase}`;
            document.cookie = `admin_gate=open${cookieBase}`;

            router.push('/admin')
        } catch (err: any) {
            setError(err.message || 'Invalid credentials. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4 transition-colors duration-300">
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>
            <Card className="w-full max-w-md shadow-xl border-zinc-200 dark:border-zinc-800 bg-card text-card-foreground">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 relative overflow-hidden rounded-full border-2 border-[#FEA619] shadow-md bg-white mb-4 p-1">
                        <Image 
                            src="/images/logo.jpeg" 
                            alt="Imperial Academy Logo" 
                            fill 
                            className="object-contain"
                        />
                    </div>
                    <CardTitle className="text-2xl">Admin Login</CardTitle>
                    <CardDescription>Imperial Academy Management</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5">
                         <div className="space-y-1.5">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                >
                                    Email
                                </label>
                                <input
                                    type="text"
                                    name="email"
                                    value={email}
                                    placeholder="Email"
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full h-12 px-3 py-2 border border-slate-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                                    required
                                />
                            </div>
                        <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label
                                        htmlFor="password"
                                        className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
                                    >
                                        Password
                                    </label>
                                </div>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={password}
                                        placeholder="Password"
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full h-12 px-3 py-2 border border-slate-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-700 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-gray-500 dark:focus:ring-gray-400"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#00236F] dark:hover:text-[#FEA619] transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                                <Lock size={16} />
                                {error}
                            </div>
                        )}

                        <Button 
                            type="submit" 
                            className="w-full h-12 bg-[#00236F] hover:bg-[#00236F]/90 text-white font-bold transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Signing in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Sign In <ArrowRight size={18} />
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
