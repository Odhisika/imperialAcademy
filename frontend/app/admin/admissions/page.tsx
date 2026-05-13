'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
    Search,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    User,
    CheckCircle2,
    XCircle,
    Clock,
    GraduationCap,
    MapPin,
    School,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    X,
    Baby,
    Users,
    UserCheck,
    UserX,
    Loader2,
    Trash2
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const PAGE_SIZE = 8

// ── Types ──────────────────────────────────────────────────────────────────
interface Admission {
    id: number
    childName: string
    childDob: string
    gender: string
    gradeLevel: string
    parentName: string
    parentEmail: string
    parentPhone: string
    address?: string
    previousSchool?: string
    status: string
    submissionDate: string
}

interface Stats {
    total: number
    pending: number
    underReview: number
    approved: number
    rejected: number
}

// ── Status config ──────────────────────────────────────────────────────────
const statusConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
    Approved: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    Rejected: { icon: XCircle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    'Under Review': { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    Pending: { icon: Clock, color: 'text-zinc-400', bg: 'bg-zinc-100 dark:bg-zinc-800' },
}

function StatusBadge({ status }: { status: string }) {
    const cfg = statusConfig[status] ?? statusConfig.Pending
    const Icon = cfg.icon
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}>
            <Icon className="w-3.5 h-3.5" />
            {status}
        </span>
    )
}

// ── Detail Modal ───────────────────────────────────────────────────────────
function DetailModal({ admission, onClose, onStatusChange, onDelete }: {
    admission: Admission
    onClose: () => void
    onStatusChange: (id: number, status: string) => Promise<void>
    onDelete: (id: number) => Promise<void>
}) {
    const [updating, setUpdating] = useState(false)

    const handleStatus = async (status: string) => {
        setUpdating(true)
        await onStatusChange(admission.id, status)
        setUpdating(false)
    }

    const dob = new Date(admission.childDob).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    })
    const submitted = new Date(admission.submissionDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
    })

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white dark:bg-zinc-900 z-10 flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <div>
                        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Application Details</h2>
                        <p className="text-sm text-zinc-500 mt-0.5">ID #{admission.id} · Submitted {submitted}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-500"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status Row */}
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <StatusBadge status={admission.status} />
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" disabled={updating}>
                                    {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                                    Change Status
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {['Pending', 'Under Review', 'Approved', 'Rejected'].map(s => (
                                    <DropdownMenuItem
                                        key={s}
                                        onClick={() => handleStatus(s)}
                                        disabled={s === admission.status}
                                        className={s === 'Approved' ? 'text-emerald-600' : s === 'Rejected' ? 'text-rose-600' : ''}
                                    >
                                        {s}
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Student Info */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Student Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoRow icon={User} label="Full Name" value={admission.childName} />
                            <InfoRow icon={Baby} label="Date of Birth" value={dob} />
                            <InfoRow icon={User} label="Gender" value={admission.gender} />
                            <InfoRow icon={GraduationCap} label="Grade Level" value={admission.gradeLevel} />
                            {admission.previousSchool && (
                                <InfoRow icon={School} label="Previous School" value={admission.previousSchool} />
                            )}
                        </div>
                    </section>

                    <div className="border-t border-zinc-100 dark:border-zinc-800" />

                    {/* Parent / Guardian Info */}
                    <section>
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-3">Parent / Guardian</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoRow icon={User} label="Name" value={admission.parentName} />
                            <InfoRow icon={Mail} label="Email" value={admission.parentEmail} />
                            <InfoRow icon={Phone} label="Phone" value={admission.parentPhone} />
                            {admission.address && (
                                <InfoRow icon={MapPin} label="Address" value={admission.address} />
                            )}
                        </div>
                    </section>
                </div>

                {/* Footer actions */}
                <div className="sticky bottom-0 bg-white dark:bg-zinc-900 border-t border-zinc-100 dark:border-zinc-800 px-6 py-4 flex flex-col sm:flex-row justify-between gap-3 sm:gap-2">
                    <Button
                        variant="ghost"
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/10 w-full sm:w-auto order-last sm:order-first"
                        onClick={() => onDelete(admission.id)}
                        disabled={updating}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Application
                    </Button>
                    <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end">
                        <Button variant="outline" onClick={onClose} className="flex-1 sm:flex-none">Close</Button>
                        {admission.status !== 'Approved' && (
                            <Button
                                className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1 sm:flex-none"
                                onClick={() => handleStatus('Approved')}
                                disabled={updating}
                            >
                                {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                                Approve
                            </Button>
                        )}
                        {admission.status !== 'Rejected' && (
                            <Button
                                variant="destructive"
                                className="flex-1 sm:flex-none"
                                onClick={() => handleStatus('Rejected')}
                                disabled={updating}
                            >
                                {updating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                                Reject
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
            <Icon className="w-4 h-4 text-[#00236F] dark:text-blue-400 mt-0.5 shrink-0" />
            <div>
                <p className="text-xs text-zinc-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{value}</p>
            </div>
        </div>
    )
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ title, value, icon: Icon, color }: {
    title: string
    value: number | string
    icon: React.ElementType
    color: string
}) {
    return (
        <Card className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-zinc-500">{title}</CardTitle>
                <div className={`p-2 rounded-lg ${color}`}>
                    <Icon className="w-4 h-4 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">{value}</div>
            </CardContent>
        </Card>
    )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function AdmissionsPage() {
    const [admissions, setAdmissions] = useState<Admission[]>([])
    const [stats, setStats] = useState<Stats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedAdmission, setSelectedAdmission] = useState<Admission | null>(null)

    // ── Fetch ────────────────────────────────────────────────────────────
    const fetchAll = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const [admRes, statsRes] = await Promise.all([
                fetch(`${API_BASE}/api/admissions`),
                fetch(`${API_BASE}/api/admissions/stats`),
            ])
            if (!admRes.ok || !statsRes.ok) throw new Error('Failed to load data')
            const [admData, statsData] = await Promise.all([admRes.json(), statsRes.json()])
            setAdmissions(admData)
            setStats(statsData)
        } catch (err) {
            setError('Could not reach the server. Showing no data.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchAll() }, [fetchAll])

    // ── Update Status ────────────────────────────────────────────────────
    const updateStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(`${API_BASE}/api/admissions/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setAdmissions(prev => prev.map(a => a.id === id ? { ...a, status: updated.status } : a))
            // Update selected modal too
            setSelectedAdmission(prev => prev?.id === id ? { ...prev, status: updated.status } : prev)
            // Refetch stats
            const statsRes = await fetch(`${API_BASE}/api/admissions/stats`)
            if (statsRes.ok) setStats(await statsRes.json())
        } catch {
            alert('Failed to update status. Please try again.')
        }
    }

    // ── Delete Application ────────────────────────────────────────────────
    const deleteAdmission = async (id: number) => {
        if (!confirm('Are you sure you want to delete this application? This action cannot be undone.')) return
        try {
            const res = await fetch(`${API_BASE}/api/admissions/${id}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error()
            setAdmissions(prev => prev.filter(a => a.id !== id))
            setSelectedAdmission(null)
            // Refetch stats
            const statsRes = await fetch(`${API_BASE}/api/admissions/stats`)
            if (statsRes.ok) setStats(await statsRes.json())
        } catch {
            alert('Failed to delete application. Please try again.')
        }
    }

    // ── Filter + Paginate ────────────────────────────────────────────────
    const filtered = admissions.filter(item => {
        const matchSearch =
            item.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.parentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.parentName.toLowerCase().includes(searchTerm.toLowerCase())
        const matchStatus = statusFilter === 'All' || item.status === statusFilter
        return matchSearch && matchStatus
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    const handleFilterChange = (val: string) => {
        setStatusFilter(val)
        setCurrentPage(1)
    }
    const handleSearchChange = (val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
    }

    // ── Render ───────────────────────────────────────────────────────────
    return (
        <>
            {selectedAdmission && (
                <DetailModal
                    admission={selectedAdmission}
                    onClose={() => setSelectedAdmission(null)}
                    onStatusChange={updateStatus}
                    onDelete={deleteAdmission}
                />
            )}

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                            Admission Requests
                        </h1>
                        <p className="text-zinc-500 mt-1">Review and manage student admission applications.</p>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchAll}
                        disabled={loading}
                        className="gap-2"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard title="Total Applications" value={stats?.total ?? '—'} icon={Users} color="bg-[#00236F]" />
                    <StatCard title="Pending Review" value={stats?.pending ?? '—'} icon={Clock} color="bg-amber-500" />
                    <StatCard title="Approved" value={stats?.approved ?? '—'} icon={UserCheck} color="bg-emerald-500" />
                    <StatCard title="Rejected" value={stats?.rejected ?? '—'} icon={UserX} color="bg-rose-500" />
                </div>

                {/* Filters */}
                <Card className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-4 flex-wrap">
                            <div className="relative flex-1 min-w-[200px] max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={e => handleSearchChange(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                {['All', 'Pending', 'Under Review', 'Approved', 'Rejected'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => handleFilterChange(s)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                                            ${statusFilter === s
                                                ? 'bg-[#00236F] text-white'
                                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                            }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Loading / Error */}
                {loading && (
                    <div className="flex items-center justify-center py-20 gap-3 text-zinc-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Loading admissions...</span>
                    </div>
                )}

                {!loading && error && (
                    <div className="flex items-center justify-center py-16">
                        <div className="text-center space-y-3">
                            <XCircle className="w-10 h-10 text-rose-400 mx-auto" />
                            <p className="text-zinc-500">{error}</p>
                            <Button variant="outline" size="sm" onClick={fetchAll}>Try Again</Button>
                        </div>
                    </div>
                )}

                {/* List */}
                {!loading && !error && (
                    <>
                        <div className="grid gap-3">
                            {paginated.length > 0 ? paginated.map(request => {
                                const cfg = statusConfig[request.status] ?? statusConfig.Pending
                                const Icon = cfg.icon
                                const submitted = new Date(request.submissionDate).toLocaleDateString('en-GB', {
                                    day: 'numeric', month: 'short', year: 'numeric'
                                })
                                return (
                                    <Card
                                        key={request.id}
                                        className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all"
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex flex-col lg:flex-row lg:items-center gap-4">

                                                {/* Avatar + Name */}
                                                <div className="flex items-center gap-3 min-w-[180px]">
                                                    <div className="w-10 h-10 rounded-full bg-[#00236F]/10 flex items-center justify-center text-[#00236F] dark:text-blue-400 shrink-0 font-bold text-sm">
                                                        {request.childName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
                                                            {request.childName}
                                                        </h3>
                                                        <p className="text-xs text-zinc-500">{request.gradeLevel}</p>
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="grid grid-cols-1 sm:grid-cols-3 flex-1 gap-3">
                                                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                        <User className="w-3.5 h-3.5 shrink-0" />
                                                        {request.parentName}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                        <Mail className="w-3.5 h-3.5 shrink-0" />
                                                        <span className="truncate">{request.parentEmail}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-zinc-500">
                                                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                                                        {submitted}
                                                    </div>
                                                </div>

                                                {/* Status + Actions */}
                                                <div className="flex items-center gap-3 justify-between lg:justify-end w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-zinc-100 dark:border-zinc-800">
                                                    <div className="flex items-center gap-3">
                                                        <StatusBadge status={request.status} />
                                                    </div>

                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setSelectedAdmission(request)}
                                                            className="h-9 text-xs sm:text-sm"
                                                        >
                                                            View Details
                                                        </Button>

                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-9 w-9">
                                                                    <MoreVertical className="w-4 h-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    onClick={() => updateStatus(request.id, 'Approved')}
                                                                    className="text-emerald-600 cursor-pointer"
                                                                >
                                                                    <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => updateStatus(request.id, 'Under Review')}
                                                                    className="text-amber-600 cursor-pointer"
                                                                >
                                                                    <Clock className="w-4 h-4 mr-2" /> Mark Under Review
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => updateStatus(request.id, 'Rejected')}
                                                                    className="text-rose-600 cursor-pointer"
                                                                >
                                                                    <XCircle className="w-4 h-4 mr-2" /> Reject
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            }) : (
                                <div className="text-center py-16 text-zinc-400">
                                    <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                    <p>No admission requests found.</p>
                                </div>
                            )}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-2">
                                <p className="text-sm text-zinc-500">
                                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-sm font-medium px-2">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    )
}