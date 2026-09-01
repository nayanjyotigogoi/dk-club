import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { CHAPTERS } from '@/lib/learning/chapters-data'
import { ChapterView } from './chapter-view'
import type { ChapterData } from './chapter-view'

export const revalidate = 30

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

async function fetchChapter(slug: string): Promise<ChapterData | null> {
  try {
    const res = await fetch(`${API}/learning/chapters/${slug}`, {
      next: { revalidate: 30 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const data = await fetchChapter(slug)
  if (!data) return { title: 'Chapter not found' }
  const { chapter } = data
  return {
    title: `Chapter ${chapter.number}: ${chapter.title_en}`,
    description: chapter.description,
    alternates: { canonical: `https://dibrugarhkoreanclub.com/learn/chapters/${slug}` },
  }
}

export function generateStaticParams() {
  return CHAPTERS.map(c => ({ slug: c.slug }))
}

export default async function ChapterPage({ params }: Props) {
  const { slug } = await params
  const data = await fetchChapter(slug)
  if (!data) notFound()
  return <ChapterView data={data} />
}
