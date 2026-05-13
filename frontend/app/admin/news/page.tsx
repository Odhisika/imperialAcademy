'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Trash2, Edit2, Star, RefreshCw, X, Loader2, Tag, Calendar, ChevronLeft, ChevronRight, Newspaper } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const PAGE_SIZE = 8
const CATEGORIES = ['All', 'Academic', 'Sports', 'Science', 'Arts', 'Admissions', 'Events', 'General']

interface NewsArticle {
    id: number
    title: string
    slug: string
    content: string
    excerpt?: string
    category: string
    imageUrl?: string
    isFeatured: boolean
    author?: string
    publishedAt: string
}

const emptyForm = { title: '', slug: '', content: '', excerpt: '', category: 'General', imageUrl: '', author: '', isFeatured: false }

function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ── Article Form Modal ─────────────────────────────────────────────────────
function ArticleModal({ article, onClose, onSuccess }: {
    article: NewsArticle | null
    onClose: () => void
    onSuccess: () => void
}) {
    const [form, setForm] = useState(article ? {
        title: article.title, slug: article.slug, content: article.content,
        excerpt: article.excerpt || '', category: article.category,
        imageUrl: article.imageUrl || '', author: article.author || '',
        isFeatured: article.isFeatured
    } : emptyForm)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(article?.imageUrl || null)

    const set = (k: string, v: string | boolean) => setForm(f => ({ ...f, [k]: v }))

    const handleTitleChange = (v: string) => {
        set('title', v)
        if (!article) set('slug', slugify(v))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
        } else {
            setSelectedFile(null)
            setPreviewUrl(article?.imageUrl || null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title.trim() || !form.content.trim()) { setError('Title and content are required.'); return }
        setSaving(true); setError('')
        
        try {
            let finalImageUrl = form.imageUrl

            // 1. Upload the file first if a new one is selected
            if (selectedFile) {
                const formData = new FormData()
                formData.append('image', selectedFile)

                const uploadRes = await fetch(`${API_BASE}/api/upload`, {
                    method: 'POST',
                    body: formData,
                })

                if (!uploadRes.ok) throw new Error('File upload failed')
                const uploadData = await uploadRes.json()
                finalImageUrl = uploadData.imageUrl
            }

            // 2. Save the article
            const method = article ? 'PATCH' : 'POST'
            const url = article ? `${API_BASE}/api/news/${article.id}` : `${API_BASE}/api/news`
            
            // Log the payload to debug
            console.log('Saving article with image:', finalImageUrl);
            
            const payload = { ...form, imageUrl: finalImageUrl }
            
            const res = await fetch(url, { 
                method, 
                headers: { 'Content-Type': 'application/json' }, 
                body: JSON.stringify(payload) 
            })
            if (!res.ok) throw new Error('Failed to save article')
            onSuccess(); onClose()
        } catch (err: any) { 
            setError(err.message || 'Failed to save. Please try again.') 
        } finally { 
            setSaving(false) 
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="sticky top-0 bg-white dark:bg-zinc-900 flex items-center justify-between p-6 border-b border-zinc-100 dark:border-zinc-800 z-10">
                    <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{article ? 'Edit Article' : 'New Article'}</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Title <span className="text-rose-500">*</span></label>
                        <Input value={form.title} onChange={e => handleTitleChange(e.target.value)} placeholder="Article title..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Slug</label>
                        <Input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="auto-generated-from-title" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Category</label>
                            <select value={form.category} onChange={e => set('category', e.target.value)}
                                className="w-full border border-zinc-300 dark:border-zinc-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                                {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Author</label>
                            <Input value={form.author} onChange={e => set('author', e.target.value)} placeholder="Admin" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Excerpt <span className="text-zinc-400 font-normal">(optional)</span></label>
                        <Input value={form.excerpt} onChange={e => set('excerpt', e.target.value)} placeholder="Short summary..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Featured Image <span className="text-zinc-400 font-normal">(optional)</span></label>
                        <Input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#00236F]/10 file:text-[#00236F] hover:file:bg-[#00236F]/20 cursor-pointer"
                        />
                        {/* Live preview */}
                        {previewUrl && (
                            <div className="mt-2 aspect-video rounded-lg overflow-hidden bg-zinc-100 relative max-w-sm">
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Content <span className="text-rose-500">*</span></label>
                        <textarea value={form.content} onChange={e => set('content', e.target.value)} rows={6} placeholder="Full article content..."
                            className="w-full border border-zinc-300 dark:border-zinc-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-[#00236F] resize-y" />
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" checked={form.isFeatured} onChange={e => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-[#00236F]" />
                        <span className="text-sm text-zinc-700 dark:text-zinc-300">Mark as Featured</span>
                    </label>
                    {error && <p className="text-sm text-rose-500">{error}</p>}
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" className="bg-[#00236F] hover:bg-[#001a54] text-white" disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            {article ? 'Save Changes' : 'Publish'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function NewsPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('All')
    const [currentPage, setCurrentPage] = useState(1)
    const [modalArticle, setModalArticle] = useState<NewsArticle | 'new' | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const [deleting, setDeleting] = useState(false)

    const fetchNews = useCallback(async () => {
        setLoading(true); setError(null)
        try {
            const res = await fetch(`${API_BASE}/api/news`)
            if (!res.ok) throw new Error()
            setArticles(await res.json())
        } catch { setError('Could not reach the server.') }
        finally { setLoading(false) }
    }, [])

    useEffect(() => { fetchNews() }, [fetchNews])

    const handleDelete = async (id: number) => {
        setDeleting(true)
        try {
            const res = await fetch(`${API_BASE}/api/news/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error()
            setArticles(prev => prev.filter(a => a.id !== id))
            setDeleteId(null)
        } catch { alert('Failed to delete.') }
        finally { setDeleting(false) }
    }

    const handleToggleFeatured = async (article: NewsArticle) => {
        try {
            const res = await fetch(`${API_BASE}/api/news/${article.id}`, {
                method: 'PATCH', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isFeatured: !article.isFeatured })
            })
            if (!res.ok) throw new Error()
            setArticles(prev => prev.map(a => a.id === article.id ? { ...a, isFeatured: !a.isFeatured } : a))
        } catch { alert('Failed to update.') }
    }

    const filtered = articles.filter(a => {
        const matchSearch = a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (a.author || '').toLowerCase().includes(searchTerm.toLowerCase())
        const matchCat = categoryFilter === 'All' || a.category === categoryFilter
        return matchSearch && matchCat
    })

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
    const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

    const changeFilter = (v: string) => { setCategoryFilter(v); setCurrentPage(1) }
    const changeSearch = (v: string) => { setSearchTerm(v); setCurrentPage(1) }

    const editingArticle = modalArticle !== 'new' ? modalArticle : null

    return (
        <>
            {modalArticle !== null && (
                <ArticleModal
                    article={editingArticle}
                    onClose={() => setModalArticle(null)}
                    onSuccess={fetchNews}
                />
            )}

            {/* Delete confirm dialog */}
            {deleteId !== null && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 space-y-4">
                        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Delete Article?</h3>
                        <p className="text-sm text-zinc-500">This action cannot be undone.</p>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
                            <Button variant="destructive" onClick={() => handleDelete(deleteId)} disabled={deleting}>
                                {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />} Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">News & Events</h1>
                        <p className="text-zinc-500 mt-1">{articles.length} article{articles.length !== 1 ? 's' : ''} published</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={fetchNews} disabled={loading} className="gap-2">
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                        </Button>
                        <Button className="bg-[#00236F] hover:bg-[#001a54] text-white gap-2" onClick={() => setModalArticle('new')}>
                            <Plus className="w-4 h-4" /> New Article
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <Card className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                    <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <div className="relative flex-1 min-w-[180px] max-w-sm">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 w-4 h-4" />
                                <Input placeholder="Search articles..." value={searchTerm} onChange={e => changeSearch(e.target.value)} className="pl-9" />
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {CATEGORIES.map(c => (
                                    <button key={c} onClick={() => changeFilter(c)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${categoryFilter === c ? 'bg-[#00236F] text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}>
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* States */}
                {loading && (
                    <div className="flex items-center justify-center py-20 gap-3 text-zinc-400">
                        <Loader2 className="w-6 h-6 animate-spin" /><span>Loading articles...</span>
                    </div>
                )}
                {!loading && error && (
                    <div className="text-center py-16 space-y-3">
                        <Newspaper className="w-10 h-10 text-zinc-300 mx-auto" />
                        <p className="text-zinc-500">{error}</p>
                        <Button variant="outline" size="sm" onClick={fetchNews}>Try Again</Button>
                    </div>
                )}

                {/* Article list */}
                {!loading && !error && (
                    <>
                        <div className="grid gap-3">
                            {paginated.length === 0 ? (
                                <div className="text-center py-16 space-y-3">
                                    <Newspaper className="w-10 h-10 text-zinc-300 mx-auto" />
                                    <p className="text-zinc-500">No articles found.</p>
                                    <Button className="bg-[#00236F] text-white" onClick={() => setModalArticle('new')}>
                                        <Plus className="w-4 h-4 mr-2" /> Write First Article
                                    </Button>
                                </div>
                            ) : paginated.map(article => {
                                const date = new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
                                return (
                                    <Card key={article.id} className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-sm transition-all">
                                        <CardContent className="p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                                {/* Icon */}
                                                <div className="w-10 h-10 rounded-lg bg-[#00236F]/10 flex items-center justify-center shrink-0">
                                                    <Newspaper className="w-5 h-5 text-[#00236F] dark:text-blue-400" />
                                                </div>

                                                {/* Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">{article.title}</h3>
                                                        {article.isFeatured && (
                                                            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 shrink-0">
                                                                ★ Featured
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-zinc-500">
                                                        <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{article.category}</span>
                                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{date}</span>
                                                        {article.author && <span>by {article.author}</span>}
                                                        {article.excerpt && <span className="truncate max-w-xs hidden lg:block text-zinc-400">{article.excerpt}</span>}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex items-center gap-1 shrink-0">
                                                    <button
                                                        onClick={() => handleToggleFeatured(article)}
                                                        title={article.isFeatured ? 'Remove featured' : 'Mark as featured'}
                                                        className={`p-2 rounded-lg transition-colors ${article.isFeatured ? 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100' : 'text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20'}`}
                                                    >
                                                        <Star className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setModalArticle(article)}
                                                        className="p-2 rounded-lg text-zinc-400 hover:text-[#00236F] hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                    >
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteId(article.id)}
                                                        className="p-2 rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between pt-2">
                                <p className="text-sm text-zinc-500">
                                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
                                </p>
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </Button>
                                    <span className="text-sm font-medium px-2">{currentPage} / {totalPages}</span>
                                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
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
