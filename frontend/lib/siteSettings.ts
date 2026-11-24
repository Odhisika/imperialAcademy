export interface SiteSettings {
    facebookUrl: string
    instagramUrl: string
    twitterUrl: string
    linkedinUrl: string
    youtubeUrl: string
    tiktokUrl: string
    addressLine1: string
    digitalAddress: string
    phone1: string
    phone2: string
    email: string
    weekdayHours: string
    saturdayHours: string
    sundayHours: string
    updatedAt: string | null
}

export const FALLBACK_SETTINGS: SiteSettings = {
    facebookUrl: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    youtubeUrl: '',
    tiktokUrl: '',
    addressLine1: 'TQ 63, New Tafo Akim',
    digitalAddress: 'EE-1049-7190',
    phone1: '0201188847',
    phone2: '0543974931',
    email: 'imperailacademy68@gmail.com',
    weekdayHours: '8:00 AM - 4:00 PM',
    saturdayHours: '9:00 AM - 1:00 PM',
    sundayHours: 'Closed',
    updatedAt: null,
}

/** Server-side helper shared by the public footer, contact page and layouts. */
export async function getSiteSettings(): Promise<SiteSettings> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/api/settings`, {
            next: { revalidate: 60 },
        })
        if (!res.ok) return FALLBACK_SETTINGS
        return { ...FALLBACK_SETTINGS, ...(await res.json()) }
    } catch {
        return FALLBACK_SETTINGS
    }
}

/** Turns a Ghanaian 0-prefixed number into a dialable tel: value. */
export function telHref(phone: string): string {
    const trimmed = phone.trim()
    if (!trimmed) return ''
    const normalized = trimmed.startsWith('0') ? `+233${trimmed.slice(1)}` : trimmed
    return `tel:${normalized.replace(/[^\d+]/g, '')}`
}
