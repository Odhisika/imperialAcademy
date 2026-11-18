import type { Metadata } from 'next'
import AdminShell from '@/components/admin/AdminShell'

// Admin screens must never be indexed or followed by search engines.
export const metadata: Metadata = {
    title: {
        default: 'Admin',
        template: '%s | Imperial Academy Admin',
    },
    description: 'Administration area for Imperial Academy staff.',
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
    alternates: {
        canonical: '/admin',
    },
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <AdminShell>{children}</AdminShell>
}
