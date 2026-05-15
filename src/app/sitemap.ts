import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://meowly.qzz.io'
  
  const staticRoutes = [
    '',
    '/dmca',
    '/awards',
    '/categories',
    '/companies',
    '/network',
    '/people',
    '/search',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return [
    ...staticRoutes,
  ]
}
