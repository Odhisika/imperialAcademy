import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: 'Imperial Academy',
    description: 'Building Strong Foundations for the Future',
    generator: 'Imperial Academy',
    icons: {
        icon: '/favicon.ico',
        apple: '/favicon.ico',
    },
}

import { GoogleAuthProviderWrapper } from '@/components/GoogleAuthProviderWrapper';
import { ThemeProvider } from '@/components/theme-provider';
import ProgressBar from '@/components/ProgressBar';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`font-sans antialiased`}>
                <ProgressBar />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <GoogleAuthProviderWrapper>
                        {children}
                    </GoogleAuthProviderWrapper>
                </ThemeProvider>
                <Analytics />
            </body>
        </html>
    )
}
