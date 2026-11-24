import type { Metadata } from 'next'

/**
 * Central SEO configuration. Everything that is used in more than one place
 * (canonical URLs, Open Graph defaults, structured data) lives here so the
 * values stay consistent across the site.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || 'https://imperialacademy.edu.gh'
).replace(/\/+$/, '')

export const SITE_NAME = 'Imperial Academy'
export const SITE_TAGLINE = 'Building Strong Foundations for the Future'
export const DEFAULT_OG_IMAGE = '/images/og-image.jpg'

export const SITE_DESCRIPTION =
  'Imperial Academy is a private school in New Tafo Akim, Ghana, offering nursery, primary and junior high education that builds strong academic foundations and character.'

export const DEFAULT_KEYWORDS = [
  'Imperial Academy',
  'Imperial Academy Ghana',
  'private school New Tafo Akim',
  'schools in Akim',
  'nursery school Ghana',
  'primary school New Tafo',
  'junior high school Ghana',
  'best school in Eastern Region Ghana',
  'admissions Ghana',
]

/** Official school details, also reused for structured data. */
export const SCHOOL = {
  name: SITE_NAME,
  legalName: 'Imperial Academy',
  email: 'imperailacademy68@gmail.com',
  telephone: ['+233201188847', '+233543974931'],
  streetAddress: 'TQ 63, New Tafo Akim',
  digitalAddress: 'EE-1049-7190',
  addressLocality: 'New Tafo Akim',
  addressRegion: 'Eastern Region',
  addressCountry: 'GH',
  latitude: 6.217797208236703,
  longitude: -0.3515880323753746,
  foundingDate: '2017',
} as const

export function absoluteUrl(path = '/'): string {
  if (/^https?:\/\//i.test(path)) return path
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

/** Collapse whitespace and cut text at a word boundary (meta descriptions). */
export function truncate(text: string, max = 155): string {
  const clean = text
    .replace(/[#*_`>]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`
}

interface PageMetadataOptions {
  title: string
  description: string
  /** Route path, e.g. "/about" */
  path: string
  keywords?: string[]
  image?: string
  type?: 'website' | 'article'
  /** Use the title verbatim instead of applying the "| Imperial Academy" template. */
  absoluteTitle?: boolean
  noIndex?: boolean
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
  section?: string
  tags?: string[]
}

/**
 * Builds page-level metadata with canonical URL, Open Graph and Twitter cards.
 * The title template ("%s | Imperial Academy") comes from the root layout.
 */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  absoluteTitle = false,
  noIndex = false,
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: PageMetadataOptions): Metadata {
  const url = absoluteUrl(path)
  const socialTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`

  const openGraph: Metadata['openGraph'] =
    type === 'article'
      ? {
          type: 'article',
          title: socialTitle,
          description,
          url,
          siteName: SITE_NAME,
          locale: 'en_GH',
          images: [{ url: image, width: 1200, height: 630, alt: socialTitle }],
          publishedTime,
          modifiedTime,
          authors,
          section,
          tags,
        }
      : {
          type: 'website',
          title: socialTitle,
          description,
          url,
          siteName: SITE_NAME,
          locale: 'en_GH',
          images: [{ url: image, width: 1200, height: 630, alt: socialTitle }],
        }

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    robots: noIndex ? { index: false, follow: false, nocache: true } : undefined,
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title: socialTitle,
      description,
      images: [image],
    },
  }
}

/* ------------------------------------------------------------------ */
/* Structured data (schema.org / JSON-LD)                              */
/* ------------------------------------------------------------------ */

import type { SiteSettings } from './siteSettings'

const SOCIAL_SCHEMA_KEYS: (keyof SiteSettings)[] = [
  'facebookUrl',
  'instagramUrl',
  'twitterUrl',
  'linkedinUrl',
  'youtubeUrl',
  'tiktokUrl',
]

const currentPhones = (settings?: Partial<SiteSettings> | null) =>
  [settings?.phone1 || SCHOOL.telephone[0], settings?.phone2].filter(Boolean) as string[]

export function organizationSchema(settings?: Partial<SiteSettings> | null) {
  const sameAs = SOCIAL_SCHEMA_KEYS.map((key) => settings?.[key]).filter(Boolean);
  return {
    '@context': 'https://schema.org',
    '@type': 'School',
    '@id': `${SITE_URL}/#school`,
    name: SCHOOL.name,
    alternateName: 'Imperial Academy Ghana',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/images/logo.jpeg'),
    },
    image: absoluteUrl(DEFAULT_OG_IMAGE),
    description: SITE_DESCRIPTION,
    email: settings?.email || SCHOOL.email,
    telephone: currentPhones(settings)[0],
    foundingDate: SCHOOL.foundingDate,
    slogan: SITE_TAGLINE,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings?.addressLine1 || SCHOOL.streetAddress,
      addressLocality: SCHOOL.addressLocality,
      addressRegion: SCHOOL.addressRegion,
      addressCountry: SCHOOL.addressCountry,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SCHOOL.latitude,
      longitude: SCHOOL.longitude,
    },
    areaServed: {
      '@type': 'City',
      name: SCHOOL.addressLocality,
    },
    ...(sameAs.length ? { sameAs } : {}),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '16:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '13:00',
      },
    ],
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: 'en-GH',
    publisher: { '@id': `${SITE_URL}/#school` },
  }
}

export function contactPageSchema(settings?: Partial<SiteSettings> | null) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    '@id': `${SITE_URL}/contact#page`,
    url: absoluteUrl('/contact'),
    name: 'Contact Imperial Academy',
    description:
      'Contact Imperial Academy in New Tafo Akim, Ghana for admissions, enquiries and campus visits.',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@id': `${SITE_URL}/#school` },
    mainEntity: {
      '@id': `${SITE_URL}/#school`,
      contactPoint: currentPhones(settings).map((telephone) => ({
        '@type': 'ContactPoint',
        telephone,
        contactType: 'admissions',
        areaServed: 'GH',
        availableLanguage: ['en'],
      })),
    },
  }
}

interface ArticleSchemaInput {
  title: string
  description: string
  path: string
  image?: string | null
  publishedAt?: string | null
  updatedAt?: string | null
  author?: string | null
  category?: string | null
}

export function articleSchema({
  title,
  description,
  path,
  image,
  publishedAt,
  updatedAt,
  author,
  category,
}: ArticleSchemaInput) {
  const url = absoluteUrl(path)

  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    '@id': `${url}#article`,
    headline: title,
    description,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    image: [image ? absoluteUrl(image) : absoluteUrl(DEFAULT_OG_IMAGE)],
    datePublished: publishedAt || undefined,
    dateModified: updatedAt || publishedAt || undefined,
    articleSection: category || undefined,
    author: {
      '@type': 'Person',
      name: author || SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#school`,
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/images/logo.jpeg'),
      },
    },
    isPartOf: { '@id': `${SITE_URL}/#website` },
    inLanguage: 'en-GH',
  }
}
