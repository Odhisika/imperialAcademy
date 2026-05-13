'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/sidebar'
import Header from '@/components/layout/header'
import AuthGuard from '@/components/AuthGuard'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const isLoginPage = pathname === '/admin/login'

    if (isLoginPage) {
        return <>{children}</>
    }

    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden bg-background text-foreground transition-colors duration-300">
                <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
                <div className="flex flex-col flex-1 overflow-hidden relative">
                    <Header onMenuClick={() => setSidebarOpen(true)} />
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        {children}
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}