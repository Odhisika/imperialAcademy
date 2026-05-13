'use client'

import React from 'react'
import { 
    User, 
    Lock, 
    Bell, 
    Shield, 
    Database, 
    Globe,
    Save
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function SettingsPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">Settings</h1>
                <p className="text-zinc-500">Manage your account preferences and system configurations.</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-4">
                <TabsList className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
                    <TabsTrigger value="profile" className="px-4 py-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 shadow-sm">
                        <User className="w-4 h-4 mr-2" /> Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="px-4 py-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 shadow-sm">
                        <Shield className="w-4 h-4 mr-2" /> Security
                    </TabsTrigger>
                    <TabsTrigger value="system" className="px-4 py-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-700 shadow-sm">
                        <Database className="w-4 h-4 mr-2" /> System
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                    <Card className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your account details and email address.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input id="name" defaultValue="Admin User" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input id="email" defaultValue="admin@imperial.edu" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button className="bg-[#00236F] text-white">
                                    <Save className="w-4 h-4 mr-2" /> Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security">
                    <Card className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle>Security Settings</CardTitle>
                            <CardDescription>Manage your password and security preferences.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current">Current Password</Label>
                                <Input id="current" type="password" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new">New Password</Label>
                                    <Input id="new" type="password" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm">Confirm New Password</Label>
                                    <Input id="confirm" type="password" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button className="bg-[#00236F] text-white">
                                    <Lock className="w-4 h-4 mr-2" /> Update Password
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="system">
                    <Card className="bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800">
                        <CardHeader>
                            <CardTitle>System Configuration</CardTitle>
                            <CardDescription>Global settings for the school management system.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-zinc-100 dark:border-zinc-700 rounded-lg">
                                <div className="space-y-1">
                                    <p className="font-medium">Maintenance Mode</p>
                                    <p className="text-sm text-zinc-500">Temporarily disable the public website.</p>
                                </div>
                                <Button variant="outline" size="sm">Enable</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 border border-zinc-100 dark:border-zinc-700 rounded-lg">
                                <div className="space-y-1">
                                    <p className="font-medium">Email Notifications</p>
                                    <p className="text-sm text-zinc-500">Receive alerts for new admission requests.</p>
                                </div>
                                <Button variant="outline" size="sm" className="bg-emerald-50 text-emerald-600 border-emerald-200">Active</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
