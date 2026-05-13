'use client'

import React, { useState } from 'react'
import { Bell, Search, User, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
    onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

    return (
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-700 bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-4 flex-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-zinc-500 dark:text-zinc-400"
                    onClick={onMenuClick}
                >
                    <Menu className="w-6 h-6" />
                </Button>

                {/* Search */}
                <div className="flex items-center flex-1 max-w-2xl">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full h-9 pl-9 pr-3 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-0"
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <ThemeToggle />

                {/* Notifications */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border border-white dark:border-zinc-800" />
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                    <div className="relative">
                        <DropdownMenuTrigger
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-700 focus:outline-none"
                        >
                            <div className="w-8 h-8 rounded-full bg-zinc-600 dark:bg-zinc-500 flex items-center justify-center text-white">
                                <User className="w-4 h-4" />
                            </div>
                            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                User
                            </span>
                        </DropdownMenuTrigger>

                        {isUserMenuOpen && (
                            <DropdownMenuContent className="w-56 border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-md">
                                <DropdownMenuLabel className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                                    My Account
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="cursor-pointer text-zinc-700 dark:text-zinc-300 focus:bg-zinc-100 dark:focus:bg-zinc-700"
                                >
                                    Profile
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    onClick={() => setIsUserMenuOpen(false)}
                                    className="cursor-pointer text-zinc-700 dark:text-zinc-300 focus:bg-zinc-100 dark:focus:bg-zinc-700"
                                >
                                    Settings
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                <DropdownMenuItem
                                    onClick={() => {
                                        setIsUserMenuOpen(false)
                                        localStorage.removeItem('isAuthenticated')
                                        localStorage.removeItem('auth_token')
                                        localStorage.removeItem('userEmail')
                                        localStorage.removeItem('userName')
                                        document.cookie =
                                            'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
                                        window.location.href = '/admin/login'
                                    }}
                                    className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950"
                                >
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        )}
                    </div>
                </DropdownMenu>
            </div>
        </header>
    )
}