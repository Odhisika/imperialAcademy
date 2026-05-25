const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';
const SITE_URL = 'https://imperialacademy.edu.gh';

export default async function sitemap() {
  const staticRoutes = [
    '',
    '/about',
    '/academics',
    '/admissions',
    '/admissions/policy',
    '/news',
    '/gallery',
    '/contact',
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  let newsRoutes = [];
  try {
    const res = await fetch(`${API_BASE}/api/news`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const news = await res.json();
      newsRoutes = news.map((article) => ({
        url: `${SITE_URL}/news/${article.id}`,
        lastModified: new Date(article.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.6,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch news for sitemap:', error);
  }

  return [...staticRoutes, ...newsRoutes];
}
