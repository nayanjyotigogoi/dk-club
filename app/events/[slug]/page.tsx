// Server component — awaits params, passes slug to client UI
import type { Metadata } from 'next'
import { EventDetail } from './event-detail'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

export async function generateStaticParams() {
  try {
    const res = await fetch(`${API_URL}/events`, { next: { revalidate: 0 } })
    if (!res.ok) return []
    const events: { slug: string }[] = await res.json()
    return events.map(e => ({ slug: e.slug }))
  } catch {
    return []
  }
}

export const dynamicParams = true

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    title,
    description: `${title} — an event by Dibrugarh Korean Club celebrating Korean language and culture in Assam, India.`,
    keywords: [title, 'Dibrugarh Korean Club event', 'Korean event Assam', 'Korean culture Assam', 'K-pop event Dibrugarh', 'Hangul Day Assam'],
    alternates: { canonical: `https://dibrugarhkoreanclub.com/events/${slug}` },
    openGraph: {
      title: `${title} | Dibrugarh Korean Club`,
      description: `Join us for ${title} — a Korean cultural event by Dibrugarh Korean Club.`,
      url: `https://dibrugarhkoreanclub.com/events/${slug}`,
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'Dibrugarh Korean Club' }],
    },
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <EventDetail slug={slug} />
}
