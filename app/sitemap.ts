import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://dibrugarhkoreanclub.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/join`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/culture`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/community`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/courses`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/magazine`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/goodies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/resources`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.6 },
  ]

  return staticRoutes
}
