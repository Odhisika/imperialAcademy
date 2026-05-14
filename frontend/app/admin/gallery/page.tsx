'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import {
    Plus,
    Search,
    Trash2,
    Image as ImageIcon,
    RefreshCw,
    X,
    Loader2,
    Pencil,
    Check,
    ChevronLeft,
    ChevronRight,
    LayoutGrid,
    List
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''
const PAGE_SIZE = 12

const CATEGORIES = ['All', 'Campus', 'Sports', 'Academic', 'Arts', 'Events', 'Other']

// ── Types ──────────────────────────────────────────────────────────────────
interface GalleryItem {
    id: number
    title?: string
    imageUrl: string
    category: string
    createdAt: string
}

// ── Upload Modal ───────────────────────────────────────────────────────────
function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [title, setTitle] = useState('')
    const [category, setCategory] = useState('Campus')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    
    // File upload states
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        } else {
            setSelectedFile(null)
            setPreviewUrl(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedFile) { setError('Please select an image file'); return }
        setSaving(true)
        setError('')
        try {
            // 1. Upload the file first
            const formData = new FormData()
            formData.append('image', selectedFile)

            const uploadRes = await fetch(`${API_BASE}/api/upload`, {
                method: 'POST',
                body: formData,
            })

            if (!uploadRes.ok) throw new Error('File upload failed')
            const uploadData = await uploadRes.json()
            const uploadedImageUrl = uploadData.imageUrl

            // 2. Save the gallery item with the new URL
            const res = await fetch(`${API_BASE}/api/gallery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: title.trim() || undefined, imageUrl: uploadedImageUrl, category })
            })
            if (!res.ok) throw new Error('Failed to save gallery item')
            onSuccess()
            onClose()
        } catch (err: any) {
            setError(err.message || 'Failed to upload. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Add Gallery Image</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Select Image <span className="text-rose-500">*</span></label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00236F]/10 file:text-[#00236F] hover:file:bg-[#00236F]/20 cursor-pointer"
                        />
                        {/* Live preview */}
                        {previewUrl && (
                            <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-zinc-100 relative">
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Title <span className="text-zinc-400 font-normal">(optional)</span></label>
                        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Annual Sports Day 2024" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Category</label>
                        <div className="flex flex-wrap gap-2">
                            {CATEGORIES.filter(c => c !== 'All').map(c => (
                                <button
                                    type="button"
                                    key={c}
                                    onClick={() => setCategory(c)}
                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                                        ${category === c
                                            ? 'bg-[#00236F] text-white'
                                            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200'
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-sm text-rose-500">{error}</p>}

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-[#00236F] hover:bg-[#001a54] text-white" disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Upload
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ── Inline Edit ────────────────────────────────────────────────────────────
function EditableTitle({ item, onSave }: { item: GalleryItem; onSave: (id: number, title: string, category: string) => Promise<void> }) {
    const [editing, setEditing] = useState(false)
    const [val, setVal] = useState(item.title || '')
    const [cat, setCat] = useState(item.category)
    const [saving, setSaving] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

    const handleSave = async () => {
        setSaving(true)
        await onSave(item.id, val, cat)
        setSaving(false)
        setEditing(false)
    }

    if (editing) {
        return (
            <div className="p-3 space-y-2">
                <input
                    ref={inputRef}
                    value={val}
                    onChange={e => setVal(e.target.value)}
                    className="w-full text-sm border border-zinc-300 dark:border-zinc-600 rounded px-2 py-1 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-[#00236F]"
                    placeholder="Title..."
                />
                <select
                    value={cat}
                    onChange={e => setCat(e.target.value)}
                    className="w-full text-xs border border-zinc-300 dark:border-zinc-600 rounded px-2 py-1 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                >
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                </select>
                <div className="flex gap-1">
                    <button onClick={handleSave} disabled={saving} className="flex-1 py-1 bg-[#00236F] text-white text-xs rounded hover:bg-[#001a54] flex items-center justify-center gap-1 disabled:opacity-50">
                        {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />} Save
                    </button>
                    <button onClick={() => setEditing(false)} className="flex-1 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-xs rounded hover:bg-zinc-200">
                        Cancel
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="p-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">{item.title || <span className="text-zinc-400 italic">Untitled</span>}</p>
                <span className="text-xs text-zinc-500">{item.category}</span>
            </div>
            <button onClick={() => setEditing(true)} className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-400 hover:text-zinc-600 shrink-0 transition-colors">
                <Pencil className="w-3.5 h-3.5" />
            </button>
        </div>
    )
}

// ── Delete Confirm ─────────────────────────────────────────────────────────
function DeleteConfirm({ onConfirm, onCancel, deleting }: { onConfirm: () => void; onCancel: () => void; deleting: boolean }) {
    return (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 p-3 rounded-t-lg z-10">
            <p className="text-white text-xs font-medium text-center">Delete this image?</p>
            <div className="flex gap-2">
                <button onClick={onConfirm} disabled={deleting} className="px-3 py-1 bg-rose-500 text-white text-xs rounded-full hover:bg-rose-600 disabled:opacity-50 flex items-center gap-1">
                    {deleting ? <Loader2 className="w-3 h-3 animate-spin" /> : null} Delete
                </button>
                <button onClick={onCancel} className="px-3 py-1 bg-white/20 text-white text-xs rounded-full hover:bg-white/30">
                    Cancel
                </button>
            </div>
        </div>
    )
}

// ── Gallery Card ───────────────────────────────────────────────────────────
function GalleryCard({ item, onDelete, onEdit }: {
    item: GalleryItem
    onDelete: (id: number) => Promise<void>
    onEdit: (id: number, title: string, category: string) => Promise<void>
}) {
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const [imgError, setImgError] = useState(false)

    const handleDelete = async () => {
        setDeleting(true)
        await onDelete(item.id)
        setDeleting(false)
    }

    return (
        <Card className="group bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow">
            {/* Image area */}
            <div className="aspect-video bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden">
                {imgError || !item.imageUrl ? (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-zinc-300" />
                    </div>
                ) : (
                    <Image
                        src={item.imageUrl}
                        alt={item.title || 'Gallery image'}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={() => setImgError(true)}
                    />
                )}

                {/* Overlay actions */}
                {!confirmDelete && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-2 gap-2">
                        <button
                            onClick={() => setConfirmDelete(true)}
                            className="p-1.5 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-sm"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                )}

                {/* Delete confirm overlay */}
                {confirmDelete && (
                    <DeleteConfirm
                        onConfirm={handleDelete}
                        onCancel={() => setConfirmDelete(false)}
                        deleting={deleting}
                    />
                )}
            </div>

            {/* Editable title */}
            <EditableTitle item={item} onSave={onEdit} />
        </Card>
    )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function GalleryPage() {
    const [items, setItems] = useState<GalleryItem[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [showUpload, setShowUpload] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

    const fetchGallery = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE}/api/gallery`)
            if (!res.ok) throw new Error()
            setItems(await res.json())
        } catch {
            setError('Could not reach the server.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { fetchGallery() }, [fetchGallery])

    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`${API_BASE}/api/gallery/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
            setItems(prev => prev.filter(i => i.id !== id))
        } catch {
            alert('Failed to delete. Please try again.')
        }
    }

    const handleEdit = async (id: number, title: string, category: string) => {
        try {
            const res = await fetch(`${API_BASE}/api/gallery/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, category })
            })
            if (!res.ok) throw new Error()
            const updated = await res.json()
            setItems(prev => prev.map(i => i.id === id ? { ...i, ...updated } : i))
        } catch {
            alert('Failed to save changes.')
        }
    }

    // Filter + Paginate
    const filtered = items.filter(item => {
        const matchSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase())
        const matchCat = categoryFilter === 'All' || item.category === categoryFilter
        return matchSearch && matchCat
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    const handleFilterChange = (val: string) => { setCategoryFilter(val); setCurrentPage(1) }
    const handleSearch = (val: string) => { setSearchTerm(val); setCurrentPage(1) }

    return (
        <>
            {showUpload && (
                <UploadModal
                    onClose={() => setShowUpload(false)}
                    onSuccess={fetchGallery}
                />
            )}

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Gallery Management</h1>
                        <p className="text-zinc-500 mt-1">
                            {items.length} image{items.length !== 1 ? 's' : ''} in the gallery
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={fetchGallery} disabled={loading} className="gap-2">
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button className="bg-[#00236F] hover:bg-[#001a54] text-white gap-2" onClick={() => setShowUpload(true)}>
                            <Plus className="w-4 h-4" /> Add Image
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Search */}
                            <div className="relative flex-1 min-w-[180px] max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                                <Input
                                    placeholder="Search by title..."
                                    value={searchTerm}
                                    onChange={e => handleSearch(e.target.value)}
                                    className="pl-9"
                                />
                            </div>

                            {/* Category pills */}
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(c => (
                                    <button
                                        key={c}
                                        onClick={() => handleFilterChange(c)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                                            ${categoryFilter === c
                                                ? 'bg-[#00236F] text-white'
                                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                                            }`}
                                    >
                                        {c}
                                    </button>
                                ))}
                            </div>

                            {/* View toggle */}
                            <div className="flex items-center border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden ml-auto">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#00236F] text-white' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[#00236F] text-white' : 'text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
                                >
                                    <List className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Loading / Error */}
                {loading && (
                    <div className="flex items-center justify-center py-20 gap-3 text-zinc-400">
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>Loading gallery...</span>
                    </div>
                )}

                {!loading && error && (
                    <div className="text-center py-16 space-y-3">
                        <ImageIcon className="w-10 h-10 text-zinc-300 mx-auto" />
                        <p className="text-zinc-500">{error}</p>
                        <Button variant="outline" size="sm" onClick={fetchGallery}>Try Again</Button>
                    </div>
                )}

                {/* Grid / List */}
                {!loading && !error && (
                    <>
                        {paginated.length === 0 ? (
                            <div className="text-center py-16 space-y-3">
                                <ImageIcon className="w-10 h-10 text-zinc-300 mx-auto" />
                                <p className="text-zinc-500">No images found.</p>
                                <Button className="bg-[#00236F] text-white" onClick={() => setShowUpload(true)}>
                                    <Plus className="w-4 h-4 mr-2" /> Add First Image
                                </Button>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {paginated.map(item => (
                                    <GalleryCard key={item.id} item={item} onDelete={handleDelete} onEdit={handleEdit} />
                                ))}
                            </div>
                        ) : (
                            // List view
                            <div className="space-y-2">
                                {paginated.map(item => (
                                    <Card key={item.id} className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                                        <CardContent className="p-3 flex items-center gap-4">
                                            <div className="w-16 h-16 rounded-lg bg-zinc-100 dark:bg-zinc-800 relative overflow-hidden shrink-0">
                                                {item.imageUrl ? (
                                                    <Image src={item.imageUrl} alt={item.title || ''} fill className="object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ImageIcon className="w-5 h-5 text-zinc-300" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 truncate">
                                                    {item.title || <span className="text-zinc-400 italic">Untitled</span>}
                                                </p>
                                                <span className="text-xs text-zinc-500">{item.category}</span>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}

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
                                    <span className="text-sm font-medium px-2">{currentPage} / {totalPages}</span>
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
