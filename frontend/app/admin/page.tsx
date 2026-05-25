'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Users, Newspaper, Image as ImageIcon, Mail, Loader2, ArrowUpRight, RefreshCw, XCircle, ArrowRight, Clock } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

interface DashboardStats {
    admissions: number
    news: number
    gallery: number
    unreadContacts: number
    recentAdmissions: any[]
    recentMessages: any[]
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchStats = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE}/api/dashboard/stats`)
            if (!res.ok) throw new Error('Failed to fetch stats')
            setStats(await res.json())
        } catch (err) {
            setError('Could not connect to the server to fetch stats.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchStats()
    }, [fetchStats])

    const statCards = [
        { title: 'Total Admissions', value: stats?.admissions ?? '—', icon: Users, color: 'bg-[#00236F]', trend: '+12%' },
        { title: 'News Articles', value: stats?.news ?? '—', icon: Newspaper, color: 'bg-emerald-500', trend: '+2' },
        { title: 'Gallery Images', value: stats?.gallery ?? '—', icon: ImageIcon, color: 'bg-amber-500', trend: '+15' },
        { title: 'Unread Inquiries', value: stats?.unreadContacts ?? '—', icon: Mail, color: 'bg-rose-500', trend: '-3' }
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between flex-wrap gap-4 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#00236F] dark:text-zinc-100">Dashboard Overview</h1>
                    <p className="text-zinc-500 mt-1">Real-time statistics and activity for Imperial Academy.</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={fetchStats}
                        disabled={loading}
                        className="gap-2 border-zinc-200"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Link href="/admissions" target="_blank">
                        <Button className="bg-[#FEA619] hover:bg-[#e59516] text-[#00236F] font-bold gap-2">
                            View Site <ArrowRight className="w-4 h-4" />
                        </Button>
                    </Link>
                </div>
            </div>

            {loading && !stats ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4 text-zinc-400">
                    <Loader2 className="w-10 h-10 animate-spin text-[#FEA619]" />
                    <span className="font-medium">Syncing school data...</span>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-16">
                    <div className="text-center space-y-4 max-w-md">
                        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto">
                            <XCircle className="w-10 h-10 text-rose-500" />
                        </div>
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Connection Error</h3>
                        <p className="text-zinc-500">{error}</p>
                        <Button variant="outline" onClick={fetchStats} className="w-full">Try Again</Button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Stats Grid */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((stat) => (
                            <Card key={stat.title} className="bg-white dark:bg-zinc-800/50 shadow-sm border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-all duration-300 overflow-hidden group">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500">{stat.title}</CardTitle>
                                    <div className={`p-2.5 rounded-xl ${stat.color} shadow-lg shadow-zinc-200 dark:shadow-none group-hover:scale-110 transition-transform`}>
                                        <stat.icon className="w-5 h-5 text-white" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{stat.value}</div>
                                    <p className="text-xs text-zinc-400 mt-2 flex items-center gap-1 font-medium">
                                        <span className={stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}>{stat.trend}</span>
                                        since last month
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Recent Admissions */}
                        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Users className="w-5 h-5 text-[#FEA619]" />
                                        Recent Admissions
                                    </CardTitle>
                                    <Link href="/admin/admissions">
                                        <Button variant="ghost" size="sm" className="text-xs text-zinc-500 hover:text-[#00236F]">View All</Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {stats?.recentAdmissions.length ? (
                                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                        {stats.recentAdmissions.map((adm) => (
                                            <div key={adm.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-[#00236F]/5 flex items-center justify-center text-[#00236F] font-bold">
                                                        {adm.studentName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-zinc-900 dark:text-zinc-100">{adm.studentName}</div>
                                                        <div className="text-xs text-zinc-500">{adm.className} • {new Date(adm.createdAt).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400 border-none font-bold">New</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-zinc-400 text-sm">No recent admissions.</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Recent Messages */}
                        <Card className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
                            <CardHeader className="border-b border-zinc-100 dark:border-zinc-800/50">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-rose-500" />
                                        Latest Inquiries
                                    </CardTitle>
                                    <Link href="/admin/contacts">
                                        <Button variant="ghost" size="sm" className="text-xs text-zinc-500 hover:text-[#00236F]">View All</Button>
                                    </Link>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                {stats?.recentMessages.length ? (
                                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                                        {stats.recentMessages.map((msg) => (
                                            <div key={msg.id} className="p-4 flex items-start gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                                                <div className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-rose-500 mt-1">
                                                    <Mail className="w-4 h-4" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">{msg.name}</div>
                                                        <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {new Date(msg.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-zinc-500 line-clamp-2">{msg.message}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-zinc-400 text-sm">No recent messages.</div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    )
}
