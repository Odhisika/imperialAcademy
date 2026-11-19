'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, KeyRound, CheckCircle2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ADMIN_LOGIN_URL } from '@/lib/admin'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

export default function ChangePasswordPage() {
    const router = useRouter()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [done, setDone] = useState(false)

    const signOut = () => {
        localStorage.removeItem('isAuthenticated')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('mustChangePassword')
        localStorage.removeItem('userEmail')
        localStorage.removeItem('userName')
        document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        document.cookie = 'admin_gate=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        window.location.href = ADMIN_LOGIN_URL
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.')
            return
        }
        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long.')
            return
        }

        setLoading(true)
        try {
            const token = localStorage.getItem('auth_token')
            const res = await fetch(`${API_BASE}/api/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ currentPassword, newPassword }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Could not update password.')

            localStorage.setItem('mustChangePassword', 'false')
            setDone(true)
            setTimeout(() => router.push('/admin'), 1200)
        } catch (err: any) {
            setError(err.message || 'Could not update password. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <Card className="w-full max-w-md shadow-xl border-zinc-200 dark:border-zinc-800 bg-card text-card-foreground">
                <CardHeader className="text-center">
                    <div className="mx-auto w-14 h-14 rounded-full bg-[#00236F]/10 flex items-center justify-center mb-3">
                        {done ? (
                            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                        ) : (
                            <KeyRound className="w-7 h-7 text-[#00236F] dark:text-[#FEA619]" />
                        )}
                    </div>
                    <CardTitle className="text-2xl">
                        {done ? 'Password updated' : 'Set a new password'}
                    </CardTitle>
                    <CardDescription>
                        {done
                            ? 'Taking you to the dashboard…'
                            : 'Your account is using the default password. Choose a new one to continue.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {done ? (
                        <div className="flex justify-center py-4">
                            <Lock className="w-10 h-10 text-emerald-500 animate-pulse" />
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="current-password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Current password
                                </label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Default password"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="new-password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    New password
                                </label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="At least 8 characters"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="confirm-password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                    Confirm new password
                                </label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat new password"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded text-sm text-red-600 dark:text-red-400">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-[#00236F] hover:bg-[#00236F]/90 text-white font-bold"
                            >
                                {loading ? 'Updating…' : 'Update password'}
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={signOut}
                                className="w-full text-sm text-zinc-500 hover:text-rose-500"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> Sign out
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
