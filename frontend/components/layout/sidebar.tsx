'use client'

import { useState } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Newspaper,
    Building2,
    Settings,
    LogOut,
    Palette,
    ChevronLeft,
    Users,
    Mail,
    FileText,
    Trophy,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'


interface SidebarProps {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
    const pathname = usePathname()

    const menuItems = [
        {
            href: '/admin',
            label: 'Dashboard',
            icon: LayoutDashboard,
            exact: true,
        },
        {
            href: '/admin/news',
            label: 'News & Events',
            icon: Newspaper,
        },
        {
            href: '/admin/gallery',
            label: 'Gallery',
            icon: Palette,
        },
        {
            href: '/admin/admissions',
            label: 'Admissions',
            icon: Users,
        },
        {
            href: '/admin/headers',
            label: 'Page Headers',
            icon: Building2,
        },
        {
            href: '/admin/contacts',
            label: 'Messages',
            icon: Mail,
        },
        {
            href: '/admin/documents',
            label: 'Documents',
            icon: FileText,
        },
        {
            href: '/admin/activities',
            label: 'Activities',
            icon: Trophy,
        },
        {
            href: '/admin/settings',
            label: 'Settings',
            icon: Settings,
        },
    ]
    const [collapsed, setCollapsed] = useState(false)

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div
                className={cn(
                    "fixed inset-y-0 left-0 bg-white dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700 flex flex-col z-40 transition-all duration-300 md:static md:translate-x-0",
                    collapsed ? "w-16" : "w-64",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Brand */}
                <div className="flex items-center justify-between p-4 border-b border-zinc-200 dark:border-zinc-700">
                    <Link
                        href="/admin"
                        className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100"
                    >
                        <div className="w-8 h-8 rounded-md bg-[#00236F] flex items-center justify-center text-white shadow-sm">
                            <Building2 className="w-4 h-4" />
                        </div>
                        {!collapsed && <span className="text-lg">Imperial Admin</span>}
                    </Link>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden md:block text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                        aria-label="Toggle sidebar"
                    >
                        <ChevronLeft
                            className={cn(
                                "w-4 h-4 transition-transform",
                                collapsed && "rotate-180"
                            )}
                        />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = item.exact
                            ? pathname === item.href
                            : pathname.startsWith(item.href)

                        return (
                            <Button
                                key={item.href}
                                asChild
                                variant="ghost"
                                className={cn(
                                    "w-full h-10 flex items-center gap-3 px-3 justify-start transition-colors",
                                    isActive
                                        ? "bg-zinc-700 dark:bg-zinc-600 text-white hover:bg-zinc-500 dark:hover:bg-zinc-500"
                                        : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100"
                                )}
                                onClick={() => setIsOpen(false)}
                            >
                                <Link href={item.href} className="flex items-center gap-3 w-full">
                                    <Icon
                                        className={cn(
                                            "w-4.5 h-4.5 shrink-0",
                                            isActive ? "text-white" : "text-zinc-400 dark:text-zinc-500"
                                        )}
                                    />
                                    {(!collapsed || isOpen) && (
                                        <span className="truncate">{item.label}</span>
                                    )}
                                </Link>
                            </Button>
                        )
                    })}
                </nav>

                {/* Footer */}
                <div className="p-2 border-t border-zinc-200 dark:border-zinc-700">
                    <Button
                        variant="ghost"
                        className="w-full h-10 flex items-center gap-3 justify-start text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                        onClick={() => {
                            localStorage.removeItem('isAuthenticated')
                            localStorage.removeItem('auth_token')
                            localStorage.removeItem('userEmail')
                            localStorage.removeItem('userName')
                            document.cookie =
                                'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
                            window.location.href = '/admin/login'
                        }}
                    >
                        <LogOut className="w-4.5 h-4.5 shrink-0" />
                        {!collapsed && <span>Sign Out</span>}
                    </Button>
                </div>
            </div>
        </>
    )
}