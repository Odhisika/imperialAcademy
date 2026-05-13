'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Trophy, Upload, CheckCircle, AlertCircle, Loader2, Trash2, Plus, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface Activity {
    id: number
    title: string
    description: string
    imageUrl: string
    order: number
}

export default function ActivitiesAdminPage() {
    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [showAddForm, setShowAddForm] = useState(false)

    const fetchActivities = useCallback(async () => {
        setLoading(true)
        try {
            const res = await fetch(`${API_BASE}/api/activities`)
            if (!res.ok) throw new Error('Failed to fetch activities')
            setActivities(await res.json())
        } catch (err) {
            setError('Could not load activities.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchActivities()
    }, [fetchActivities])

    const handleAddActivity = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        
        setUploading(true)
        setError(null)
        setSuccess(null)

        try {
            const res = await fetch(`${API_BASE}/api/activities`, {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Failed to add activity')
            }

            setSuccess('Activity added successfully!')
            fetchActivities()
            setShowAddForm(false)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this activity?')) return

        try {
            const res = await fetch(`${API_BASE}/api/activities/${id}`, {
                method: 'DELETE',
            })
            if (!res.ok) throw new Error('Failed to delete')
            setSuccess('Activity deleted successfully')
            fetchActivities()
        } catch (err: any) {
            setError(err.message)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#00236F] dark:text-zinc-100">Extra-Curricular Activities</h1>
                    <p className="text-zinc-500 mt-1">Manage the clubs and sports activities displayed on the academics page.</p>
                </div>
                <Button 
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-[#FEA619] hover:bg-[#e59516] text-[#00236F] font-bold gap-2"
                >
                    {showAddForm ? 'Cancel' : <><Plus size={18} /> Add Activity</>}
                </Button>
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

            {showAddForm && (
                <Card className="border-zinc-200 dark:border-zinc-800 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300">
                    <CardHeader>
                        <CardTitle>Add New Activity</CardTitle>
                        <CardDescription>Fill in the details to add a new club or sport.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddActivity} className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Activity Title</Label>
                                    <Input id="title" name="title" placeholder="e.g., Soccer, Debate Club" required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="order">Display Order</Label>
                                    <Input id="order" name="order" type="number" defaultValue="0" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea id="description" name="description" placeholder="Describe the activity..." required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Cover Image</Label>
                                <Input id="image" name="image" type="file" accept="image/*" required />
                            </div>
                            <Button 
                                type="submit" 
                                className="w-full bg-[#00236F] hover:bg-[#001a54] text-white font-bold"
                                disabled={uploading}
                            >
                                {uploading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</> : 'Save Activity'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-zinc-400">
                        <Loader2 className="w-10 h-10 animate-spin mb-4" />
                        <p>Loading activities...</p>
                    </div>
                ) : activities.length === 0 ? (
                    <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-3xl">
                        <Trophy className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                        <p className="text-zinc-500">No activities added yet.</p>
                    </div>
                ) : (
                    activities.map((activity) => (
                        <Card key={activity.id} className="group overflow-hidden border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all">
                            <div className="relative aspect-video">
                                <Image 
                                    src={activity.imageUrl} 
                                    alt={activity.title} 
                                    fill 
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button 
                                        variant="destructive" 
                                        size="sm" 
                                        onClick={() => handleDelete(activity.id)}
                                        className="gap-2"
                                    >
                                        <Trash2 size={16} /> Delete
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-bold text-[#00236F] dark:text-zinc-100 text-lg mb-1">{activity.title}</h3>
                                <p className="text-sm text-zinc-500 line-clamp-2">{activity.description}</p>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
