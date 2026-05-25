export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/admin/',
    },
    sitemap: 'https://imperialacademy.edu.gh/sitemap.xml',
  };
}
