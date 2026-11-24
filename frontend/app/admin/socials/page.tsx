'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
    Clock,
    ExternalLink,
    Facebook,
    Instagram,
    Linkedin,
    Loader2,
    Mail,
    MapPin,
    Music2,
    Phone,
    RefreshCw,
    Save,
    Twitter,
    XCircle,
    Youtube,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FALLBACK_SETTINGS, type SiteSettings } from '@/lib/siteSettings'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || ''

const SOCIAL_FIELDS = [
    { key: 'facebookUrl', label: 'Facebook', placeholder: 'https://facebook.com/imperialacademy or @handle', Icon: Facebook },
    { key: 'instagramUrl', label: 'Instagram', placeholder: 'https://instagram.com/imperialacademy or @handle', Icon: Instagram },
    { key: 'twitterUrl', label: 'X (Twitter)', placeholder: 'https://x.com/imperialacademy or @handle', Icon: Twitter },
    { key: 'linkedinUrl', label: 'LinkedIn', placeholder: 'https://linkedin.com/company/imperialacademy or company name', Icon: Linkedin },
    { key: 'youtubeUrl', label: 'YouTube', placeholder: 'https://youtube.com/@imperialacademy or @handle', Icon: Youtube },
    { key: 'tiktokUrl', label: 'TikTok', placeholder: 'https://tiktok.com/@imperialacademy or @handle', Icon: Music2 },
] as const

const CONTACT_FIELDS = [
    { key: 'addressLine1', label: 'Street / Mailing address', placeholder: 'TQ 63, New Tafo Akim', Icon: MapPin },
    { key: 'digitalAddress', label: 'Digital address', placeholder: 'EE-1049-7190', Icon: MapPin },
    { key: 'phone1', label: 'Primary phone', placeholder: '0201188847', Icon: Phone },
    { key: 'phone2', label: 'Secondary phone', placeholder: '0543974931', Icon: Phone },
    { key: 'email', label: 'Email address', placeholder: 'imperailacademy68@gmail.com', Icon: Mail },
] as const

const HOURS_FIELDS = [
    { key: 'weekdayHours', label: 'Monday - Friday', placeholder: '8:00 AM - 4:00 PM' },
    { key: 'saturdayHours', label: 'Saturday', placeholder: '9:00 AM - 1:00 PM' },
    { key: 'sundayHours', label: 'Sunday', placeholder: 'Closed' },
] as const

export default function SocialsPage() {
    const [form, setForm] = useState<SiteSettings>(FALLBACK_SETTINGS)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState('')

    const fetchSettings = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`${API_BASE}/api/settings`)
            if (!res.ok) throw new Error('Failed to load settings')
            setForm({ ...FALLBACK_SETTINGS, ...(await res.json()) })
        } catch (err: any) {
            setError(err.message || 'Connection error.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    const setField = (key: keyof SiteSettings, value: string) => {
        setSuccess('')
        setForm((current) => ({ ...current, [key]: value }))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        setError(null)
        setSuccess('')

        try {
            const token = localStorage.getItem('auth_token')
            const { updatedAt, ...payload } = form
            const res = await fetch(`${API_BASE}/api/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Could not save settings.')

            setForm({ ...FALLBACK_SETTINGS, ...data })
            setSuccess('Saved. Changes appear on the website within a minute.')
        } catch (err: any) {
            setError(err.message || 'Could not save settings. Please try again.')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Socials &amp; Contact</h1>
                    <p className="text-zinc-500 mt-1">
                        Update the social media links and contact details shown across the website.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" onClick={fetchSettings} className="gap-2 w-full sm:w-auto">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
                    </Button>
                    <a href="/contact" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2 w-full sm:w-auto">
                            <ExternalLink className="w-4 h-4" /> View page
                        </Button>
                    </a>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 p-3 rounded-lg text-sm">
                    <XCircle className="w-4 h-4 shrink-0" /> {error}
                </div>
            )}
            {success && (
                <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 p-3 rounded-lg text-sm">
                    {success}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-24 gap-3 text-zinc-400">
                    <Loader2 className="w-7 h-7 animate-spin" /> Loading settings…
                </div>
            ) : (
                <form onSubmit={handleSave} className="space-y-6">
                    <Card className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Facebook className="w-5 h-5 text-[#00236F] dark:text-[#FEA619]" /> Social Media Links
                            </CardTitle>
                            <CardDescription>
                                Enter a full URL or just a handle (for example <code>@imperialacademy</code>). Leave a field empty to hide that icon.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {SOCIAL_FIELDS.map(({ key, label, placeholder, Icon }) => (
                                    <div key={key} className="space-y-2">
                                        <Label htmlFor={key} className="flex items-center gap-2">
                                            <Icon className="w-4 h-4 text-zinc-400" /> {label}
                                        </Label>
                                        <Input
                                            id={key}
                                            type="text"
                                            inputMode="url"
                                            placeholder={placeholder}
                                            value={form[key] || ''}
                                            onChange={(e) => setField(key, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-[#00236F] dark:text-[#FEA619]" /> Contact Details
                            </CardTitle>
                            <CardDescription>
                                These details are used in the website footer and on the Contact Us page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {CONTACT_FIELDS.map(({ key, label, placeholder, Icon }) => (
                                    <div key={key} className="space-y-2">
                                        <Label htmlFor={key} className="flex items-center gap-2">
                                            <Icon className="w-4 h-4 text-zinc-400" /> {label}
                                        </Label>
                                        <Input
                                            id={key}
                                            type={key === 'email' ? 'email' : 'text'}
                                            placeholder={placeholder}
                                            value={form[key] || ''}
                                            onChange={(e) => setField(key, e.target.value)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-zinc-100 dark:border-zinc-800 pt-5">
                                <p className="flex items-center gap-2 text-sm font-bold text-zinc-700 dark:text-zinc-200 mb-4">
                                    <Clock className="w-4 h-4 text-zinc-400" /> Office Hours
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {HOURS_FIELDS.map(({ key, label, placeholder }) => (
                                        <div key={key} className="space-y-2">
                                            <Label htmlFor={key}>{label}</Label>
                                            <Input
                                                id={key}
                                                type="text"
                                                placeholder={placeholder}
                                                value={form[key] || ''}
                                                onChange={(e) => setField(key, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={saving} className="bg-[#00236F] text-white gap-2">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving…' : 'Save changes'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}
