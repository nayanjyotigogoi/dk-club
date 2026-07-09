import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/admin/',
          // Interactive quiz / revision pages — not useful in search results
          '/learn/practice/',
          '/learn/revision/',
          '/learn/search',
        ],
      },
      // Block AI training crawlers from scraping the learning content
      {
        userAgent: [
          'GPTBot',
          'ChatGPT-User',
          'Google-Extended',
          'CCBot',
          'anthropic-ai',
          'Claude-Web',
          'Omgilibot',
          'FacebookBot',
        ],
        disallow: ['/learn/'],
      },
    ],
    sitemap: 'https://dibrugarhkoreanclub.com/sitemap.xml',
    host: 'https://dibrugarhkoreanclub.com',
  }
}
