'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Mail, Loader2, Trash2, CheckCircle, Clock, Search, XCircle, RefreshCw } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

interface Contact {
    id: number
    name: string
    email: string
    subject: string
    message: string
    isRead: boolean
    submissionDate: string
}

export default function ContactsAdminPage() {
    const [contacts, setContacts] = useState<Contact[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const fetchContacts = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE}/api/contacts`)
            if (!res.ok) throw new Error('Failed to load inquiries')
            setContacts(await res.json())
        } catch (err: any) {
            setError(err.message || 'Connection error.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchContacts()
    }, [fetchContacts])

    const toggleReadStatus = async (id: number, currentStatus: boolean) => {
        try {
            const res = await fetch(`${API_BASE}/api/contacts/${id}/read`, { 
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isRead: !currentStatus })
            })
            if (!res.ok) throw new Error('Update failed')
            setContacts(contacts.map(c => c.id === id ? { ...c, isRead: !currentStatus } : c))
        } catch (err) {
            console.error(err)
        }
    }

    const deleteContact = async (id: number) => {
        if (!confirm('Are you sure you want to delete this inquiry?')) return
        try {
            const res = await fetch(`${API_BASE}/api/contacts/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Delete failed')
            setContacts(contacts.filter(c => c.id !== id))
        } catch (err) {
            console.error(err)
        }
    }

    const filteredContacts = contacts.filter(c => 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.message.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const unreadCount = contacts.filter(c => !c.isRead).length

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Contact Inquiries</h1>
                    <p className="text-zinc-500">You have {unreadCount} unread messages from the contact form.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input 
                            type="text" 
                            placeholder="Search messages..." 
                            className="pl-10 pr-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-[#00236F]/20 w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="sm" onClick={fetchContacts} className="gap-2">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                </div>
            </div>

            {loading && contacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-zinc-400">
                    <Loader2 className="w-8 h-8 animate-spin" />
                    <span>Loading inquiries...</span>
                </div>
            ) : error ? (
                <div className="text-center py-20">
                    <XCircle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
                    <p className="text-zinc-500">{error}</p>
                    <Button variant="outline" className="mt-4" onClick={fetchContacts}>Try Again</Button>
                </div>
            ) : filteredContacts.length === 0 ? (
                <div className="text-center py-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                    <Mail className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <p className="text-zinc-500">No inquiries found matching your search.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredContacts.map((contact) => (
                        <Card 
                            key={contact.id} 
                            className={`border-zinc-200 dark:border-zinc-800 transition-all ${!contact.isRead ? 'border-l-4 border-l-[#FEA619] shadow-md' : 'opacity-80'}`}
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!contact.isRead ? 'bg-[#00236F]/10 text-[#00236F]' : 'bg-zinc-100 text-zinc-400'}`}>
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <CardTitle className="text-lg">{contact.subject}</CardTitle>
                                                {!contact.isRead && (
                                                    <span className="bg-[#FEA619] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase">New</span>
                                                )}
                                            </div>
                                            <CardDescription className="flex items-center gap-2 mt-1">
                                                <span className="font-bold text-zinc-700 dark:text-zinc-300">{contact.name}</span>
                                                <span className="text-zinc-300">•</span>
                                                <span>{contact.email}</span>
                                                <span className="text-zinc-300">•</span>
                                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(contact.submissionDate).toLocaleString()}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className={`${!contact.isRead ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-100' : 'text-zinc-500 hover:bg-zinc-100'} gap-1.5`}
                                            onClick={() => toggleReadStatus(contact.id, contact.isRead)}
                                        >
                                            <CheckCircle className="w-4 h-4" /> 
                                            {contact.isRead ? 'Mark Unread' : 'Mark Read'}
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-100"
                                            onClick={() => deleteContact(contact.id)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-xl text-zinc-600 dark:text-zinc-400 whitespace-pre-wrap text-sm leading-relaxed border border-zinc-100 dark:border-zinc-800">
                                    {contact.message}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
