'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Layout, Image as ImageIcon, Loader2, Save, XCircle, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

const PAGES = ['home', 'about', 'academics', 'admissions', 'news', 'gallery', 'contact']

interface HeaderData {
    id: number
    pageName: string
    imageUrl: string
    order: number
}

function HeaderCard({ pageName, existingHeaders, onRefresh }: { 
    pageName: string, 
    existingHeaders: HeaderData[], 
    onRefresh: () => void 
}) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [deletingId, setDeletingId] = useState<number | null>(null)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setError(null)

        try {
            // 1. Upload the file to server
            const formData = new FormData()
            formData.append('image', file)

            const uploadRes = await fetch(`${API_BASE}/api/upload`, {
                method: 'POST',
                body: formData,
            })

            if (!uploadRes.ok) throw new Error('File upload failed')
            const uploadData = await uploadRes.json()
            const uploadedImageUrl = uploadData.imageUrl

            // 2. Add to header_images table
            const res = await fetch(`${API_BASE}/api/headers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    pageName, 
                    imageUrl: uploadedImageUrl,
                    order: existingHeaders.length // Put at the end
                })
            })

            if (!res.ok) throw new Error('Failed to save header record')
            
            onRefresh()
        } catch (err: any) {
            setError(err.message || 'Failed to upload.')
        } finally {
            setUploading(false)
            // Reset input
            e.target.value = ''
        }
    }

    const handleDelete = async (id: number) => {
        setDeletingId(id)
        try {
            const res = await fetch(`${API_BASE}/api/headers/${id}`, {
                method: 'DELETE'
            })
            if (!res.ok) throw new Error('Delete failed')
            onRefresh()
        } catch (err: any) {
            setError(err.message || 'Delete failed')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <Card className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 overflow-hidden flex flex-col">
            <CardHeader className="pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2 capitalize">
                            <Layout className="w-4 h-4 text-[#00236F]" />
                            {pageName} Page
                        </CardTitle>
                        <CardDescription>
                            {pageName === 'home' ? 'Carousel images for the home banner.' : `Hero image for the ${pageName} section.`}
                        </CardDescription>
                    </div>
                    <label className="cursor-pointer bg-[#00236F] hover:bg-[#001a54] text-white px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-2 disabled:opacity-50">
                        {uploading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                        Add Image
                        <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            onChange={handleFileUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </CardHeader>
            <CardContent className="p-4 flex-1">
                {error && <p className="text-xs text-rose-500 mb-3">{error}</p>}
                
                <div className="space-y-3">
                    {existingHeaders.length === 0 ? (
                        <div className="aspect-[21/9] bg-zinc-50 dark:bg-zinc-900/50 rounded-lg border-2 border-dashed border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-zinc-400">
                            <ImageIcon className="w-8 h-8 mb-2 opacity-20" />
                            <p className="text-xs">No images uploaded</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-2">
                            {existingHeaders.map((header) => (
                                <div key={header.id} className="relative aspect-[21/9] rounded-lg overflow-hidden border border-zinc-100 dark:border-zinc-800 group">
                                    <Image src={header.imageUrl} alt="Header" fill className="object-cover" />
                                    
                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <Button 
                                            variant="destructive" 
                                            size="icon" 
                                            className="h-8 w-8"
                                            onClick={() => handleDelete(header.id)}
                                            disabled={deletingId === header.id}
                                        >
                                            {deletingId === header.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </Button>
                                    </div>

                                    {/* Badge for Order (Optional) */}
                                    {existingHeaders.length > 1 && (
                                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded backdrop-blur-sm font-bold">
                                            #{header.order + 1}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function HeadersPage() {
    const [headers, setHeaders] = useState<HeaderData[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchHeaders = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE}/api/headers`)
            if (!res.ok) throw new Error('Failed to load headers')
            setHeaders(await res.json())
        } catch (err: any) {
            setError(err.message || 'Connection error.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchHeaders()
    }, [fetchHeaders])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Page Headers</h1>
                    <p className="text-zinc-500">Manage hero banners and carousels for all website pages.</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchHeaders} className="gap-2">
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                </Button>
            </div>

            {loading && headers.length === 0 ? (
                <div className="flex items-center justify-center py-20 gap-3 text-zinc-400">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading current headers...</span>
                </div>
            ) : error ? (
                <div className="flex items-center justify-center py-16">
                    <div className="text-center space-y-3">
                        <XCircle className="w-10 h-10 text-rose-400 mx-auto" />
                        <p className="text-zinc-500">{error}</p>
                        <Button variant="outline" size="sm" onClick={fetchHeaders}>Try Again</Button>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                    {PAGES.map((pageName) => {
                        const pageHeaders = headers.filter(h => h.pageName === pageName)
                        return (
                            <HeaderCard 
                                key={pageName} 
                                pageName={pageName} 
                                existingHeaders={pageHeaders}
                                onRefresh={fetchHeaders}
                            />
                        )
                    })}
                </div>
            )}
        </div>
    )
}

function RefreshCw({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
        </svg>
    )
}
