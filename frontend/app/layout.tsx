import React from "react"
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import {
    DEFAULT_KEYWORDS,
    DEFAULT_OG_IMAGE,
    SITE_DESCRIPTION,
    SITE_NAME,
    SITE_TAGLINE,
    SITE_URL,
    organizationSchema,
    websiteSchema,
} from '@/lib/seo'
import JsonLd from '@/components/JsonLd'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: {
        default: `${SITE_NAME} | ${SITE_TAGLINE}`,
        template: `%s | ${SITE_NAME}`
    },
    description: SITE_DESCRIPTION,
    applicationName: SITE_NAME,
    keywords: DEFAULT_KEYWORDS,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: 'education',
    alternates: {
        canonical: '/',
    },
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        title: `${SITE_NAME} | ${SITE_TAGLINE}`,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        siteName: SITE_NAME,
        locale: 'en_GH',
        images: [
            {
                url: DEFAULT_OG_IMAGE,
                width: 1200,
                height: 630,
                alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${SITE_NAME} | ${SITE_TAGLINE}`,
        description: SITE_DESCRIPTION,
        images: [DEFAULT_OG_IMAGE],
    },
    icons: {
        icon: [
            { url: '/favicon.ico' },
            { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
        apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.webmanifest',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
        },
    },
    verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
        ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
        : undefined,
}

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#00236F',
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
        <html lang="en-GH" suppressHydrationWarning>
            <body className={`font-sans antialiased`}>
                <JsonLd data={[organizationSchema(), websiteSchema()]} />
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
