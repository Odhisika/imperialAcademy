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
        icon: [
            {
                url: '/icon-light-32x32.png',
                media: '(prefers-color-scheme: light)',
            },
            {
                url: '/icon-dark-32x32.png',
                media: '(prefers-color-scheme: dark)',
            },
            {
                url: '/icon.svg',
                type: 'image/svg+xml',
            },
        ],
        apple: '/apple-icon.png',
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
