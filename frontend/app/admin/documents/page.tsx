'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { FileText, Upload, CheckCircle, AlertCircle, Loader2, Download, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface SchoolDocument {
    id: number
    name: string
    title: string
    fileUrl: string
    updatedAt: string
}

export default function DocumentsAdminPage() {
    const [documents, setDocuments] = useState<SchoolDocument[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const fetchDocuments = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/api/documents`)
            if (!res.ok) throw new Error('Failed to fetch documents')
            setDocuments(await res.json())
        } catch (err) {
            setError('Could not load documents.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchDocuments()
    }, [fetchDocuments])

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>, name: string, title: string) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const file = formData.get('file') as File
        
        if (!file || file.size === 0) {
            setError('Please select a file to upload.')
            return
        }

        setUploading(name)
        setError(null)
        setSuccess(null)

        const uploadData = new FormData()
        uploadData.append('file', file)
        uploadData.append('name', name)
        uploadData.append('title', title)

        try {
            const res = await fetch(`${API_BASE}/api/documents/upload`, {
                method: 'POST',
                body: uploadData,
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Upload failed')
            }

            setSuccess(`${title} uploaded successfully!`)
            fetchDocuments()
            // Reset the form
            ;(e.target as HTMLFormElement).reset()
        } catch (err: any) {
            setError(err.message)
        } finally {
            setUploading(null)
        }
    }

    const getDoc = (name: string) => documents.find(d => d.name === name)

    const docTypes = [
        { name: 'prospectus', title: 'School Prospectus', description: 'Upload the latest school prospectus (PDF recommended).' },
        { name: 'academic-calendar', title: 'Academic Calendar', description: 'Upload the current academic calendar.' },
        { name: 'admission-policy', title: 'Admission Policy', description: 'Upload the school admission policy and guidelines.' },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-[#00236F] dark:text-zinc-100">School Documents</h1>
                <p className="text-zinc-500 mt-1">Manage official school documents like the prospectus and academic calendar.</p>
            </div>

            {error && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl flex items-center gap-3">
                    <CheckCircle className="w-5 h-5" />
                    <p className="text-sm font-medium">{success}</p>
                </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
                {docTypes.map((doc) => {
                    const existing = getDoc(doc.name)
                    return (
                        <Card key={doc.name} className="shadow-sm border-zinc-200 dark:border-zinc-800 overflow-hidden">
                            <CardHeader className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-[#00236F] rounded-lg">
                                        <FileText className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-xl text-[#00236F]">{doc.title}</CardTitle>
                                        <CardDescription>{doc.description}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6 space-y-6">
                                {existing ? (
                                    <div className="flex items-center justify-between p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            <div>
                                                <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{existing.title}</p>
                                                <p className="text-xs text-zinc-500">Updated: {new Date(existing.updatedAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <a 
                                            href={existing.fileUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="p-2 text-[#00236F] hover:bg-[#00236F]/10 rounded-lg transition-colors"
                                        >
                                            <Download className="w-5 h-5" />
                                        </a>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                                        <p className="text-sm text-zinc-500 italic">No file uploaded yet</p>
                                    </div>
                                )}

                                <form onSubmit={(e) => handleUpload(e, doc.name, doc.title)} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor={`${doc.name}-file`}>Select New File</Label>
                                        <Input 
                                            id={`${doc.name}-file`} 
                                            name="file" 
                                            type="file" 
                                            accept=".pdf,.doc,.docx,.xls,.xlsx"
                                            className="cursor-pointer"
                                            required
                                        />
                                    </div>
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-[#00236F] hover:bg-[#001a54] text-white font-bold gap-2"
                                        disabled={uploading === doc.name}
                                    >
                                        {uploading === doc.name ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Uploading...
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-4 h-4" />
                                                Upload {doc.title}
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
