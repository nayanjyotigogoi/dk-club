// Server component — awaits params, passes slug to client UI
import type { Metadata } from 'next'
import { MagazineIssue } from './magazine-issue'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const title = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    title,
    description: `${title} — a magazine issue by Dibrugarh Korean Club featuring Korean culture, K-pop, K-drama and language stories from Assam, India.`,
    keywords: [title, 'DKC magazine', 'Korean culture magazine Assam', 'K-pop magazine India', 'Korean student magazine Dibrugarh'],
    alternates: { canonical: `https://dibrugarhkoreanclub.com/magazine/${slug}` },
    openGraph: {
      title: `${title} | Dibrugarh Korean Club Magazine`,
      description: `Read ${title} — Korean culture, language, and Hallyu stories from Dibrugarh Korean Club.`,
      url: `https://dibrugarhkoreanclub.com/magazine/${slug}`,
    },
  }
}

export default async function MagazineIssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <MagazineIssue slug={slug} />
}
