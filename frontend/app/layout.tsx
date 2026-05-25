import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: 'Imperial Academy | Building Strong Foundations',
        template: '%s | Imperial Academy'
    },
    description: 'Imperial Academy is a premier educational institution dedicated to building strong foundations for the future through excellence in academics and character development.',
    keywords: ['Imperial Academy', 'School', 'Education', 'Academy', 'Excellence', 'Academics'],
    authors: [{ name: 'Imperial Academy' }],
    creator: 'Imperial Academy',
    publisher: 'Imperial Academy',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    metadataBase: new URL('https://imperialacademy.edu.gh'), // Replace with actual domain if known
    openGraph: {
        title: 'Imperial Academy',
        description: 'Building Strong Foundations for the Future',
        url: 'https://imperialacademy.edu.gh',
        siteName: 'Imperial Academy',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Imperial Academy',
        description: 'Building Strong Foundations for the Future',
    },
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
