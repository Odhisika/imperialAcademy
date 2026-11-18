import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/seo'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || SITE_URL

type Route = {
  path: string
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency']
  priority: number
}

const STATIC_ROUTES: Route[] = [
  { path: '/', changeFrequency: 'weekly', priority: 1 },
  { path: '/admissions', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/academics', changeFrequency: 'monthly', priority: 0.9 },
  { path: '/about', changeFrequency: 'monthly', priority: 0.8 },
  { path: '/news', changeFrequency: 'weekly', priority: 0.8 },
  { path: '/gallery', changeFrequency: 'monthly', priority: 0.7 },
  { path: '/contact', changeFrequency: 'yearly', priority: 0.7 },
  { path: '/admissions/policy', changeFrequency: 'yearly', priority: 0.6 },
  { path: '/privacy', changeFrequency: 'yearly', priority: 0.3 },
  { path: '/terms', changeFrequency: 'yearly', priority: 0.3 },
]

interface NewsItem {
  id: number
  publishedAt?: string
  updatedAt?: string
}

function toDate(value?: string): Date | undefined {
  if (!value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

async function getNews(): Promise<NewsItem[]> {
  try {
    const res = await fetch(`${API_BASE}/api/news`, { next: { revalidate: 3600 } })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Failed to fetch news for sitemap:', error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const news = await getNews()

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency,
    priority,
  }))

  const newsEntries: MetadataRoute.Sitemap = news
    .filter((article) => Number.isFinite(article.id))
    .map((article) => ({
      url: `${SITE_URL}/news/${article.id}`,
      lastModified: toDate(article.updatedAt) || toDate(article.publishedAt),
      changeFrequency: 'monthly',
      priority: 0.6,
    }))

  return [...staticEntries, ...newsEntries]
}
