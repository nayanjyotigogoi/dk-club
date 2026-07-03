// Server component — awaits params, passes slug to client UI
import type { Metadata } from 'next'
import { EventDetail } from './event-detail'

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
    },
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <EventDetail slug={slug} />
}
